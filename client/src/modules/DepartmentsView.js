import React, { Component } from 'react';
import { Table, ButtonToolbar, Button } from 'react-bootstrap';
import InputModal from '../components/InputModal';

class DepartmentsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newDepartment: '',
      newDepartmentDescription: '',
      departmentToModify: -1,
      departments: [],
      userInfo: { ...props.userInfo },
      showModal: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  componentDidMount() {
    this.getDepartments();
  }

  closeModal() {
    this.setState({
      newDepartment: '',
      newDepartmentDescription: '',
      departmentToModify: -1,
      showModal: false
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

  createDepartment() {
    fetch(`http://localhost:5000/api/departments/`, {
      method: 'POST',
      headers: [
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
      ],
      credentials: 'include',
      body: JSON.stringify({
        name: this.state.newDepartment,
        description: this.state.newDepartmentDescription,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          departments: [response, ...this.state.departments],
        });
      });
  }

  modifyDepartment() {
    fetch(`http://localhost:5000/api/departments/${this.state.departmentToModify}`, {
      method: 'PUT',
      headers: [
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
      ],
      credentials: 'include',
      body: JSON.stringify({
        name: this.state.newDepartment,
        description: this.state.newDepartmentDescription,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.getDepartments();
      });
  }

  render() {
    const { departments, showModal } = this.state;
    const departmentsView = departments.map((department) => {
      return (
        <tr key={department._id}>
          <td>{department.name}</td>
          <td>{department.description}</td>
          <td>
            <Button
              variant="primary"
              onClick={() => {
                this.setState({
                  showModal: true,
                  departmentToModify: department._id,
                  newDepartment: department.name,
                  newDepartmentDescription: department.description,
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
        <h2>Departments</h2>
        <ButtonToolbar bsPrefix="btn-toolbar">
          <Button
            variant="secondary"
            onClick={() => this.setState({ showModal: true })}>
            Create Department
          </Button>
        </ButtonToolbar>
        <Table responsive hover striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Modify</th>
            </tr>
          </thead>
          <tbody>{departmentsView}</tbody>
        </Table>
        {showModal && (
          <InputModal
            handleChange={(e) => this.handleChange(e)}
            onCreate={() => {
              if(this.state.departmentToModify !== -1){
                this.modifyDepartment();
              }else {
                this.createDepartment();
              }
              this.closeModal();
            }}
            show={showModal}
            closeModal={() => this.closeModal()}
            title="Create Department"
            inputs={[
              {
                label: 'Name:',
                value: this.state.newDepartment,
                valueId: 'newDepartment',
                type: 'input',
                required: true,
              },
              {
                label: 'Description:',
                value: this.state.newDepartmentDescription,
                valueId: 'newDepartmentDescription',
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

export default DepartmentsView;
