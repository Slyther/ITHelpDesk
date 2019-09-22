import React, { Fragment } from 'react';
import { NavDropdown, Navbar, Nav } from 'react-bootstrap';

const Menu = (props) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand>IT Help Desk</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-nav-bar">
        <Nav className="mr-auto">
          {props.isLoggedIn && (
            <Nav.Link
              className={`nav-item ${
                props.ticketsView === 'own' ? 'active' : ''
              }`}
              onClick={() => props.redirectToTicketsView('own')}>
              Home
            </Nav.Link>
          )}
          {props.isLoggedIn &&
            (props.userInfo.role === 'tech' ||
              props.userInfo.role === 'admin') && (
              <Fragment>
                <Nav.Link
                  className={`nav-item ${
                    props.ticketsView === 'assigned' ? 'active' : ''
                  }`}
                  onClick={() => props.redirectToTicketsView('assigned')}>
                  My Assigned Tickets
                </Nav.Link>
                <Nav.Link
                  className={`nav-item ${
                    props.ticketsView === 'unassigned' ? 'active' : ''
                  }`}
                  onClick={() => props.redirectToTicketsView('unassigned')}>
                  Unassigned Tickets
                </Nav.Link>
              </Fragment>
            )}
          {props.isLoggedIn && props.userInfo.role === 'admin' && (
            <Fragment>
              <Nav.Link
                className={`nav-item ${
                  props.ticketsView === 'allassigned' ? 'active' : ''
                }`}
                onClick={() => props.redirectToTicketsView('allassigned')}>
                All Asigned Tickets
              </Nav.Link>
              <Nav.Link
                className={`nav-item ${props.departmentsView ? 'active' : ''}`}
                onClick={() => props.redirectToDepartmentsView()}>
                Departments
              </Nav.Link>
              <Nav.Link
                className={`nav-item ${props.typesView ? 'active' : ''}`}
                onClick={() => props.redirectToTypesView()}>
                Ticket Types
              </Nav.Link>
            </Fragment>
          )}
          {!props.isLoggedIn && (
            <Nav.Link
              className={`nav-item ${props.loginView ? 'active' : ''}`}
              onClick={() => props.redirectToLoginView()}>
              Login
            </Nav.Link>
          )}
        </Nav>
        {props.isLoggedIn && (
          <NavDropdown
            className="navbar-nav nav-item dropdown col-lg-2"
            title={props.userInfo.username}
            id="nav-dropdown">
            <NavDropdown.Item
              onClick={() => props.redirectToTicketsView('own')}>
              My Tickets
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={props.logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Menu;
