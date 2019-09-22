import React, { Component } from 'react';
import { Modal, DropdownButton, Dropdown } from 'react-bootstrap';

class CardModal extends Component {
  constructor(props) {
    super(props);
    this.cardDescription = React.createRef();
    // this.commentInput = React.createRef();
    this.state = {
      resolvedActivity: [],
      card: props.card,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.card.activity.length !== state.card.activity.length){
      return {
        card: props.card
      };
    }
    return null;
  }

  resizeTextArea = (textArea) => {
    textArea.style.height = "1px";
    textArea.style.height = (10+textArea.scrollHeight)+"px";
  }

  componentDidMount() {
    this.resizeTextArea(this.cardDescription.current);
  }

  render() {
    let columnsJSX = this.props.columns
      .filter((column) => this.props.card.column !== column._id)
      .map((column) => {
        return (
          <Dropdown.Item
            key={column._id}
            onClick={() =>
              this.props.changeColumn(this.props.card, column._id)
            }>
            {column.name}
          </Dropdown.Item>
        );
      });

    let usersJSX = this.props.currentBoard.users
      .filter((user) => this.props.card.handler !== user._id)
      .map((user) => {
        return (
          <Dropdown.Item
            key={user._id}
            onClick={() => this.props.assignUser(this.props.card, user._id)}>
            {user.username}
          </Dropdown.Item>
        );
      });

    if(columnsJSX.length === 0)
      columnsJSX = (<Dropdown.Item>No Columns Available</Dropdown.Item>)
    if(usersJSX.length === 0)
      usersJSX = (<Dropdown.Item>No users Available</Dropdown.Item>)

    let currentUser = this.props.currentBoard.users.find(
      (x) => x._id === this.props.card.handler
    );
    if (currentUser) {
      currentUser = currentUser.username;
    } else {
      currentUser = 'None Assigned';
    }

    return (
      <Modal show={this.props.show} onHide={this.props.closeModal} size="lg">
        <Modal.Header closeButton style={{ borderBottomColor: '#3e5369' }}>
          <Modal.Title>{this.props.card.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="row">
          <div className="col-md-9">
            <h6 className="subtitle">Description</h6>
            <textarea
              className="form-control card-description"
              id={`description_${this.props.card._id}`}
              onChange={this.props.handleChange}
              onBlur={this.props.submitCardChange}
              ref={this.cardDescription}
              onKeyUp={() => this.resizeTextArea(this.cardDescription.current)}
              placeholder="Write a description here.">
              {this.props.card.description || ''}
            </textarea>
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
              {this.props.card.activity.map((act) => {
                return (
                  <p key={act} className="activity-entry">
                    {act}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="col-md-3">
            <h6 className="text-center">Actions</h6>
            <div>Move</div>
            <DropdownButton
              variant="secondary"
              title={
                this.props.columns.find((x) => x._id === this.props.card.column)
                  .name
              }>
              {columnsJSX}
            </DropdownButton>
            <div className="mrg-top-30">Assign User</div>
            <DropdownButton variant="secondary" title={currentUser}>
              {usersJSX}
            </DropdownButton>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
export default CardModal;
