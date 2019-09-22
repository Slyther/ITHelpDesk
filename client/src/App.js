import React, { Component, Fragment } from 'react';
import { Alert } from 'react-bootstrap';
import './App.scss';
import Login from './modules/Login';
import Menu from './modules/Menu';
import DepartmentsView from './modules/DepartmentsView';
import TicketsView from './modules/TicketsView';
import TypesView from './modules/TypesView';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      userInfo: {},
      loginView: true,
      departmentsView: false,
      ticketsView: '',
      typesView: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  componentDidMount() {
    this.checkLogin();
  }

  checkLogin() {
    fetch(`http://localhost:5000/api/users/login/`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.msg) {
          this.handleLogin(response);
        }
      });
  }

  logout = () => {
    fetch(`http://localhost:5000/api/users/logout/`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.msg) {
          this.redirectToLoginView();
        }
      });
  };

  handleLogin = (info) => {
    this.setState({
      userInfo: info,
      isLoggedIn: true,
      departmentsView: false,
      ticketsView: 'own',
      typesView: false,
      loginView: false,
    });
  };

  redirectToLoginView = () => {
    this.setState({
      isLoggedIn: false,
      userInfo: {},
      loginView: true,
      departmentsView: false,
      ticketsView: '',
      typesView: false,
    });
  };

  redirectToDepartmentsView = () => {
    const { userInfo } = this.state;
    if(userInfo.role === 'admin'){
      this.setState({
        loginView: false,
        departmentsView: true,
        ticketsView: '',
        typesView: false,
      });
    }else {
      this.redirectToTicketsView('own', 'Insufficient Privileges');
    }
  };

  redirectToTypesView = () => {
    const { userInfo } = this.state;
    if(userInfo.role === 'admin'){
      this.setState({
        loginView: false,
        departmentsView: false,
        ticketsView: '',
        typesView: true,
      });
    }else {
      this.redirectToTicketsView('own', 'Insufficient Privileges');
    }
  };

  redirectToTicketsView = (loadAs, withError = '') => {
    const { userInfo } = this.state;
    switch(loadAs){
      case 'assigned':
      case 'unassigned':
        if(userInfo.role === 'admin' || userInfo.role === 'tech'){
          this.setState({
            loginView: false,
            departmentsView: false,
            ticketsView: loadAs,
            typesView: false,
            errorMsg: withError
          });
        }else {
          this.redirectToTicketsView('own', 'Insufficient Privileges');
        }
        break;
      case 'allassigned':
        if(userInfo.role === 'admin'){
          this.setState({
            loginView: false,
            departmentsView: false,
            ticketsView: loadAs,
            typesView: false,
            errorMsg: withError
          });
        }else {
          this.redirectToTicketsView('own', 'Insufficient Privileges');
        }
        break;
      default:
        this.setState({
          loginView: false,
          departmentsView: false,
          ticketsView: loadAs,
          typesView: false,
          errorMsg: withError
        });
        break;
    }
  };

  render() {
    const {
      loginView,
      isLoggedIn,
      userInfo,
      departmentsView,
      ticketsView,
      typesView,
      errorMsg
    } = this.state;
    const JSX = (
      <Fragment>
        <Menu
          isLoggedIn={isLoggedIn}
          userInfo={userInfo}
          logout={() => this.logout()}
          redirectToLoginView={() => this.redirectToLoginView()}
          redirectToDepartmentsView={() => this.redirectToDepartmentsView()}
          redirectToTicketsView={(loadAs) => this.redirectToTicketsView(loadAs)}
          redirectToTypesView={() => this.redirectToTypesView()}
          loginView={loginView}
          departmentsView={departmentsView}
          ticketsView={ticketsView}
          typesView={typesView}
        />
        {errorMsg && 
          <Alert variant="danger" onClose={() => this.setState({errorMsg: ''})} dismissible>
            <Alert.Heading>Error!</Alert.Heading>
            <p>{errorMsg}</p>
          </Alert>
        }
        {loginView && <Login onLogin={(info) => this.handleLogin(info)} />}
        {departmentsView && <DepartmentsView userInfo={userInfo} />}
        {typesView && <TypesView userInfo={userInfo} />}
        {ticketsView && <TicketsView userInfo={userInfo} ticketsView={ticketsView} />}
      </Fragment>
    );

    return JSX;
  }
}

export default App;
