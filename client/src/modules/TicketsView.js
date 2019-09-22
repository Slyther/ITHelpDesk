import React, { Component } from 'react';
import { Table, ButtonToolbar, Button } from 'react-bootstrap';
import InputModal from '../components/InputModal';

class TicketsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTicketDescription: '',
      newTicketETA: '',
      newTicketPriority: '',
      newTicketType: '',
      newTicketDepartment: '',
      newTicketStatus: '',
      newTicketHandler: '',
      ticketToModify: -1,
      tickets: [],
      departments: [],
      types: [],
      users: [],
      userInfo: { ...props.userInfo },
      ticketsView: props.ticketsView,
      showModal: false,
      showTicketModal: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  componentDidMount() {
    this.getTickets();
    this.getDepartments();
    this.getTypes();
    this.getUsers();
  }

  closeModal() {
    this.setState({
      newTicketDescription: '',
      newTicketETA: '',
      newTicketPriority: '',
      newTicketType: '',
      newTicketDepartment: '',
      newTicketStatus: '',
      newTicketHandler: '',
      ticketToModify: -1,
      showModal: false,
      showTicketModal: false,
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
    let url = '';
    switch(ticketsView) {
      case 'unassigned':
      case 'allassigned':
        url = `http://localhost:5000/api/tickets/${ticketsView}/`;
        break;
      case 'assigned':
      default:
        url = `http://localhost:5000/api/tickets/${ticketsView}/${userInfo.id}`;
        break;
    }
    fetch(url, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          tickets: [...response],
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
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          tickets: [response, ...this.state.tickets],
        });
      });
  }

  modifyTicket() {
    fetch(`http://localhost:5000/api/tickets/${this.state.ticketToModify}`, {
      method: 'PUT',
      headers: [
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
      ],
      credentials: 'include',
      body: JSON.stringify({
        description: this.state.newTicketDescription,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.getTickets();
      });
  }

  render() {
    const { tickets, showModal, departments, types, users } = this.state;
    const ticketsView = tickets.map((ticket) => {
      let currDepartment = departments.find((x) => x._id === ticket.department);
      if (typeof currDepartment === 'undefined') currDepartment = 'undef';
      let currType = types.find((x) => x._id === ticket.ticketType);
      if (typeof currType === 'undefined') currType = 'undef';
      let currHandler = users.find((x) => x._id === ticket.handler);
      if (typeof currHandler === 'undefined') currHandler = 'None Assigned';
      let currCreator = users.find((x) => x._id === ticket.creator);
      if (typeof currCreator === 'undefined') currCreator = 'undef';
      return (
        <tr key={ticket._id}>
          <td>{currCreator}</td>
          <td>{new Date(ticket.creation)}</td>
          <td>{ticket.priority}</td>
          <td>{currDepartment}</td>
          <td>{currType}</td>
          <th>{ticket.status}</th>
          <td>{new Date(ticket.completion)}</td>
          <td>
            <Button
              variant="primary"
              onClick={() => {
                this.setState({
                  showModal: true,
                  ticketToModify: ticket._id,
                  newTicketDescription: ticket.description,
                });
              }}>
              <span className="far fa-edit"></span>
            </Button>
          </td>
        </tr>
      );
    });

    return (
      <div className="container">
        <h2>Tickets</h2>
        <ButtonToolbar bsPrefix="btn-toolbar">
          <Button
            variant="secondary"
            onClick={() => this.setState({ showModal: true })}>
            Create Ticket
          </Button>
        </ButtonToolbar>
        <Table responsive hover striped>
          <thead>
            <tr>
              <th>Creator</th>
              <th>Created On</th>
              <th>Priority</th>
              <th>Department</th>
              <th>Type</th>
              <th>Status</th>
              <th>Resolved On</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>{ticketsView}</tbody>
        </Table>
        {showModal && (
          <InputModal
            handleChange={(e) => this.handleChange(e)}
            onCreate={() => {
              if (this.state.ticketToModify !== -1) {
                this.modifyTicket();
              } else {
                this.createTicket();
              }
              this.closeModal();
            }}
            show={showModal}
            closeModal={() => this.closeModal()}
            title="Create Ticket"
            inputs={[
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
      </div>
    );
  }
}

export default TicketsView;
