import React, { Component, Fragment } from 'react';
import './App.scss';
import Login from './modules/Login';
import Menu from './modules/Menu';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      userInfo: {},
      loginView: true,
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
      loginView: false,
    });
  };

  redirectToLoginView = () => {
    this.setState({
      isLoggedIn: false,
      userInfo: {},
      loginView: true,
    });
  };

  render() {
    const {
      loginView,
      isLoggedIn,
      userInfo,
    } = this.state;
    const JSX = (
      <Fragment>
        <Menu
          isLoggedIn={isLoggedIn}
          userInfo={userInfo}
          logout={this.logout}
          redirectToLoginView={this.redirectToLoginView}
          loginView={loginView}
        />
        {loginView && <Login onLogin={this.handleLogin} />}
      </Fragment>
    );

    return JSX;
  }
}

export default App;
