import React, { Component, Fragment } from 'react';
import { Table, ButtonToolbar, Button } from 'react-bootstrap';
import InputModal from '../components/InputModal';
import TicketsModal from '../components/TicketModal';

class TicketsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTicketDescription: '',
      newTicketType: '',
      newTicketDepartment: '',
      currentTicket: {},
      tickets: [],
      departments: [],
      types: [],
      users: [],
      userInfo: { ...props.userInfo },
      ticketsView: props.ticketsView,
      showModal: false,
      showTicketsModal: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  static getDerivedStateFromProps(props, state) {
    if (props.ticketsView !== state.ticketsView)
      return {
        ticketsView: props.ticketsView,
      };
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.ticketsView !== this.state.ticketsView) {
      this.getTickets();
      this.getDepartments();
      this.getTypes();
      this.getUsers();
    }
  }

  componentDidMount() {
    this.getTickets();
    this.getDepartments();
    this.getTypes();
    this.getUsers();
  }

  closeModal() {
    this.setState({
      newTicketDescription: '',
      newTicketType: '',
      newTicketDepartment: '',
      currentTicket: {},
      showModal: false,
      showTicketsModal: false,
    });
  }

  getTypes() {
    fetch(`http://localhost:5000/api/types/`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          types: [...response],
        });
      });
  }

  getUsers() {
    fetch(`http://localhost:5000/api/users/`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          users: [...response],
        });
      });
  }

  getDepartments() {
    fetch(`http://localhost:5000/api/departments/`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          departments: [...response],
        });
      });
  }

  getTickets() {
    const { ticketsView, userInfo } = this.state;
    fetch(`http://localhost:5000/api/tickets/${ticketsView}/${userInfo.id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          tickets: [...response],
          currentTicket: this.state.currentTicket._id
            ? response.find((x) => x._id === this.state.currentTicket._id)
            : {},
        });
      });
  }

  createTicket() {
    fetch(`http://localhost:5000/api/tickets/`, {
      method: 'POST',
      headers: [
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
      ],
      credentials: 'include',
      body: JSON.stringify({
        description: this.state.newTicketDescription,
        department: this.state.newTicketDepartment,
        ticketType: this.state.newTicketType,
        creator: this.state.userInfo.id,
        priority: this.state.types.find(
          (x) => x._id === this.state.newTicketType
        ).priority,
        eta: this.calculateETA(
          this.state.types.find((x) => x._id === this.state.newTicketType).eta
        ),
        status: 'Pending Assignment',
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          tickets: [response, ...this.state.tickets],
        });
      });
  }

  calculateETA(stringETA) {
    let split = stringETA.toLowerCase().split(' ');
    let eta = new Date();
    split.forEach((element) => {
      if (element.includes('d')) {
        eta.setDate(
          eta.getDate() + Number(element.substring(0, element.length - 1))
        );
      }
      if (element.includes('h')) {
        eta.setHours(
          eta.getHours() + Number(element.substring(0, element.length - 1))
        );
      }
      if (element.includes('m')) {
        eta.setMinutes(
          eta.getMinutes() + Number(element.substring(0, element.length - 1))
        );
      }
      if (element.includes('s')) {
        eta.setSeconds(
          eta.getSeconds() + Number(element.substring(0, element.length - 1))
        );
      }
    });
    return eta;
  }

  modifyTicket(ticket) {
    fetch(`http://localhost:5000/api/tickets/${ticket._id}`, {
      method: 'PUT',
      headers: [
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
      ],
      credentials: 'include',
      body: JSON.stringify({
        ...ticket,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.getTickets();
      });
  }

  render() {
    const {
      tickets,
      showModal,
      showTicketsModal,
      departments,
      types,
      users,
      currentTicket,
      ticketsView,
    } = this.state;
    const ticketsViewTable = tickets.map((ticket) => {
      let currDepartment = departments.find((x) => x._id === ticket.department);
      if (typeof currDepartment === 'undefined') currDepartment = 'undef';
      let currType = types.find((x) => x._id === ticket.ticketType);
      if (typeof currType === 'undefined') currType = 'undef';
      let currHandler = users.find((x) => x.id === ticket.handler);
      if (typeof currHandler === 'undefined') currHandler = 'None Assigned';
      let currCreator = users.find((x) => x.id === ticket.creator);
      if (typeof currCreator === 'undefined') currCreator = 'undef';
      return (
        <tr key={ticket._id}>
          <td>{currCreator.username}</td>
          <td>{new Date(ticket.creation).toUTCString()}</td>
          <td>{ticket.priority}</td>
          <td>{currDepartment.name}</td>
          <td>{currType.name}</td>
          <td>{ticket.status}</td>
          <td>{new Date(ticket.eta).toUTCString()}</td>
          <td>{new Date(ticket.completion).toUTCString()}</td>
          <td>
            <Button
              variant="primary"
              onClick={() => {
                this.setState({
                  showTicketsModal: true,
                  currentTicket: ticket,
                });
              }}>
              <span className="fas fa-search-plus"></span>
            </Button>
          </td>
        </tr>
      );
    });

    return (
      <div className="container">
        {ticketsView === 'own' && (
          <Fragment>
            <h2>My Tickets</h2>
            <ButtonToolbar bsPrefix="btn-toolbar">
              <Button
                variant="secondary"
                onClick={() => this.setState({ showModal: true })}>
                Create Ticket
              </Button>
            </ButtonToolbar>
          </Fragment>
        )}
        {ticketsView === 'assigned' && (
          <Fragment>
            <h2>My Assigned Tickets</h2>
          </Fragment>
        )}
        {ticketsView === 'unassigned' && (
          <Fragment>
            <h2>Unassigned Tickets</h2>
          </Fragment>
        )}
        {ticketsView === 'allassigned' && (
          <Fragment>
            <h2>All Assigned Tickets</h2>
          </Fragment>
        )}
        <Table responsive hover striped>
          <thead>
            <tr>
              <th>Creator</th>
              <th>Created On</th>
              <th>Priority</th>
              <th>Department</th>
              <th>Type</th>
              <th>Status</th>
              <th>ETA</th>
              <th>Resolved On</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>{ticketsViewTable}</tbody>
        </Table>
        {showModal && (
          <InputModal
            handleChange={(e) => this.handleChange(e)}
            onCreate={() => {
              this.createTicket();
              this.closeModal();
            }}
            show={showModal}
            closeModal={() => this.closeModal()}
            title="Create Ticket"
            inputs={[
              {
                label: 'Department:',
                value: this.state.newTicketDepartment,
                valueId: 'newTicketDepartment',
                type: 'select',
                required: true,
                options: this.state.departments.map((x) => {
                  return { id: x._id, option: x.name };
                }),
              },
              {
                label: 'Ticket Type:',
                value: this.state.newTicketType,
                valueId: 'newTicketType',
                type: 'select',
                required: true,
                options: this.state.types
                  .filter(
                    (x) => x.department === this.state.newTicketDepartment
                  )
                  .map((x) => {
                    return { id: x._id, option: x.name };
                  }),
              },
              {
                label: 'Description:',
                value: this.state.newTicketDescription,
                valueId: 'newTicketDescription',
                type: 'textarea',
                required: true,
              },
            ]}
          />
        )}
        {showTicketsModal && (
          <TicketsModal
            show={showTicketsModal}
            closeModal={() => this.closeModal()}
            currentTicket={currentTicket}
            userInfo={this.props.userInfo}
            users={users}
            types={types}
            departments={departments}
            modifyTicket={(ticket) => this.modifyTicket(ticket)}
          />
        )}
      </div>
    );
  }
}

export default TicketsView;
