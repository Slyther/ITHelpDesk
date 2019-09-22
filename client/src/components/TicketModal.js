import React, { Component, Fragment } from 'react';
import { Modal, DropdownButton, Dropdown, Button } from 'react-bootstrap';

class TicketsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTicket: props.currentTicket,
    };
  }

  handleChange = (variable, value) => {
    let { currentTicket } = this.state;
    currentTicket[variable] = value;
    this.setState({ currentTicket });
  };

  static getDerivedStateFromProps(props, state) {
    if (
      JSON.stringify(props.currentTicket) !==
      JSON.stringify(state.currentTicket)
    ) {
      return {
        ticket: props.currentTicket,
      };
    }
    return null;
  }

  render() {
    let { currentTicket } = this.state;
    let departmentsJSX = this.props.departments.map((department) => {
      return (
        <Dropdown.Item
          key={department._id}
          onClick={() => this.handleChange('department', department._id)}>
          {department.name}
        </Dropdown.Item>
      );
    });

    let typesJSX = this.props.types
      .filter((type) => type.department === currentTicket.department)
      .map((type) => {
        return (
          <Dropdown.Item
            key={type._id}
            onClick={() => this.handleChange('ticketType', type._id)}>
            {type.name}
          </Dropdown.Item>
        );
      });

    let usersJSX = this.props.users
      .filter(
        (user) => currentTicket.handler !== user.id && user.role !== 'user'
      )
      .map((user) => {
        return (
          <Dropdown.Item
            key={user._id}
            onClick={() => this.handleChange('handler', user.id)}>
            {user.username}
          </Dropdown.Item>
        );
      });

    let priorityJSX = ['Low', 'Medium', 'High', 'Very High']
      .filter((priority) => currentTicket.priority !== priority)
      .map((priority) => {
        return (
          <Dropdown.Item
            key={priority}
            onClick={() => this.handleChange('priority', priority)}>
            {priority}
          </Dropdown.Item>
        );
      });

    let statusJSX = [
      'Pending Assignment',
      'Open',
      'In Development',
      'In Review',
      'Closed',
    ]
      .filter((status) => currentTicket.status !== status)
      .map((status) => {
        return (
          <Dropdown.Item
            key={status}
            onClick={() => this.handleChange('status', status)}>
            {status}
          </Dropdown.Item>
        );
      });

    let currentUser = this.props.users.find(
      (x) => x.id === currentTicket.handler
    );
    if (currentUser) {
      currentUser = currentUser.username;
    } else {
      currentUser = 'None Assigned';
    }
    console.log(this.state);
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body className="row">
          <div className="col-md-8">
            <h6 className="subtitle">Description</h6>
            <p>{currentTicket.description}</p>
            <h6 className="subtitle">Activity</h6>
            {/* <textarea
              className="form-control activity-input"
              id={`comment_${this.props.card._id}`}
              onChange={this.props.handleChange}
              ref={this.commentInput}
              onKeyUp={() => this.resizeTextArea(this.commentInput.current)}
              placeholder="Write a comment...">
            </textarea> */}
            <div className="content">
              {currentTicket.activity.map((act) => {
                return (
                  <p key={act} className="activity-entry">
                    {act}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="col-md-4">
            <h6 className="text-center">Info</h6>
            <p>
              <b>Creator:</b>
              <br />
              {
                this.props.users.find((x) => x.id === currentTicket.creator)
                  .username
              }
            </p>
            <p>
              <b>Created on:</b>
              <br />
              {new Date(currentTicket.creation).toUTCString()}
            </p>
            <p>
              <b>ETA:</b>
              <br />
              {new Date(currentTicket.eta).toUTCString()}
            </p>
            {this.props.userInfo.role === 'user' && (
              <Fragment>
                <p>
                  <b>Status:</b>
                  <br />
                  {currentTicket.status}
                </p>
                <p>
                  <b>Handler:</b>
                  <br />
                  {currentUser}
                </p>
                <p>
                  <b>Department:</b>
                  <br />
                  {
                    this.props.departments.find(
                      (x) => x._id === currentTicket.department
                    ).name
                  }
                </p>
                <p>
                  <b>Ticket Type:</b>
                  <br />
                  {
                    this.props.types.find(
                      (x) => x._id === currentTicket.ticketType
                    ).name
                  }
                </p>
                <p>
                  <b>Priority:</b>
                  <br />
                  {currentTicket.priority}
                </p>
              </Fragment>
            )}
            {currentTicket.status === 'Closed' && (
              <p>
                <b>Resolved On:</b>
                <br />
                {new Date(currentTicket.completion).toUTCString()}
              </p>
            )}
            {(this.props.userInfo.role === 'admin' ||
              this.props.userInfo.role === 'tech') && (
              <Fragment>
                <h6 className="text-center">Actions</h6>
                <div className="mrg-top">
                  <b>Change Priority</b>
                </div>
                <DropdownButton
                  variant="secondary"
                  title={currentTicket.priority}>
                  {priorityJSX}
                </DropdownButton>
                <div className="mrg-top">
                  <b>Change Status</b>
                </div>
                <DropdownButton
                  variant="secondary"
                  title={currentTicket.status}>
                  {statusJSX}
                </DropdownButton>
                <div className="mrg-top">
                  <b>Change Department</b>
                </div>
                <DropdownButton
                  variant="secondary"
                  title={
                    this.props.departments.find(
                      (x) => x._id === currentTicket.department
                    ).name
                  }>
                  {departmentsJSX}
                </DropdownButton>
                <div className="mrg-top">
                  <b>Change Ticket Type</b>
                </div>
                <DropdownButton
                  variant="secondary"
                  title={
                    this.props.types.find(
                      (x) => x._id === currentTicket.ticketType
                    ).name
                  }>
                  {typesJSX}
                </DropdownButton>
                <div className="mrg-top">
                  <b>Assign User</b>
                </div>
                <DropdownButton variant="secondary" title={currentUser}>
                  {usersJSX}
                </DropdownButton>
                <Button
                  className="save"
                  variant="primary"
                  onClick={() => {
                    this.props.modifyTicket(currentTicket);
                    this.props.closeModal();
                  }}>
                  Save Changes
                </Button>
              </Fragment>
            )}
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
export default TicketsModal;
