import React, { Component } from 'react';
import { Table, ButtonToolbar, Button } from 'react-bootstrap';
import InputModal from '../components/InputModal';

class TypesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newType: '',
      newTypeDescription: '',
      newTypeDepartment: '',
      newTypePriority: '',
      newTypeETA: '',
      typeToModify: -1,
      types: [],
      departments: [],
      userInfo: { ...props.userInfo },
      showModal: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  componentDidMount() {
    this.getTypes();
    this.getDepartments();
  }

  closeModal() {
    this.setState({
      newType: '',
      newTypeDescription: '',
      newTypeDepartment: '',
      newTypePriority: '',
      newTypeETA: '',
      typeToModify: -1,
      showModal: false,
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

  createType() {
    fetch(`http://localhost:5000/api/types/`, {
      method: 'POST',
      headers: [
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
      ],
      credentials: 'include',
      body: JSON.stringify({
        name: this.state.newType,
        description: this.state.newTypeDescription,
        department: this.state.newTypeDepartment,
        priority: this.state.newTypePriority,
        eta: this.state.newTypeETA,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          types: [response, ...this.state.types],
        });
      });
  }

  modifyType() {
    fetch(`http://localhost:5000/api/types/${this.state.typeToModify}`, {
      method: 'PUT',
      headers: [
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
      ],
      credentials: 'include',
      body: JSON.stringify({
        name: this.state.newType,
        description: this.state.newTypeDescription,
        department: this.state.newTypeDepartment,
        priority: this.state.newTypePriority,
        eta: this.state.newTypeETA,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.getTypes();
      });
  }

  render() {
    const { types, showModal, departments } = this.state;
    const typesView = types.map((type) => {
      let currDepartment = departments.find((x) => x._id === type.department);
      if (typeof currDepartment === 'undefined') currDepartment = 'undef';
      return (
        <tr key={type._id}>
          <td>{type.name}</td>
          <td>{type.description}</td>
          <td>{currDepartment.name}</td>
          <td>{type.priority}</td>
          <td>{type.eta}</td>
          <td>
            <Button
              variant="primary"
              onClick={() => {
                this.setState({
                  showModal: true,
                  typeToModify: type._id,
                  newType: type.name,
                  newTypeDescription: type.description,
                  newTypeDepartment: type.department,
                  newTypePriority: type.priority,
                  newTypeETA: type.eta,
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
        <h2>Types</h2>
        <ButtonToolbar bsPrefix="btn-toolbar">
          <Button
            variant="secondary"
            onClick={() => this.setState({ showModal: true })}>
            Create Type
          </Button>
        </ButtonToolbar>
        <Table responsive hover striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Department</th>
              <th>Default Priority</th>
              <th>Default ETA</th>
              <th>Modify</th>
            </tr>
          </thead>
          <tbody>{typesView}</tbody>
        </Table>
        {showModal && (
          <InputModal
            handleChange={(e) => this.handleChange(e)}
            onCreate={() => {
              if (this.state.typeToModify !== -1) {
                this.modifyType();
              } else {
                this.createType();
              }
              this.closeModal();
            }}
            show={showModal}
            closeModal={() => this.closeModal()}
            title="Create Type"
            inputs={[
              {
                label: 'Name:',
                value: this.state.newType,
                valueId: 'newType',
                type: 'input',
                required: true,
              },
              {
                label: 'Description:',
                value: this.state.newTypeDescription,
                valueId: 'newTypeDescription',
                type: 'textarea',
                required: true,
              },
              {
                label: 'Department:',
                value: this.state.newTypeDepartment,
                valueId: 'newTypeDepartment',
                type: 'select',
                required: true,
                options: this.state.departments.map((x) => {
                  return { id: x._id, option: x.name };
                }),
              },
              {
                label: 'Default Priority:',
                value: this.state.newTypePriority,
                valueId: 'newTypePriority',
                type: 'select',
                required: true,
                options: [
                  { id: 'Low', option: 'Low' },
                  { id: 'Medium', option: 'Medium' },
                  { id: 'High', option: 'High' },
                  { id: 'Very High', option: 'Very High' },
                ],
              },
              {
                label: 'Default ETA:',
                value: this.state.newTypeETA,
                valueId: 'newTypeETA',
                type: 'input',
                required: true,
                placeholder: 'Example: 2d 5h 30m 50s'
              },
            ]}
          />
        )}
      </div>
    );
  }
}

export default TypesView;
