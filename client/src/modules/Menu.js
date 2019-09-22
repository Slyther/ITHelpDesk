import React, { Fragment } from 'react';
import {NavDropdown} from 'react-bootstrap';

const Menu = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#na">IT Help Desk</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            {
                props.isLoggedIn && 
                <Fragment>
                    <li className={`nav-item ${props.boardsView ? 'active' : ''}`}>
                        <a className="nav-link" href="#na" onClick={props.redirectToBoardsView}>Home</a>
                    </li>
                </Fragment>
            }
            {
                !props.isLoggedIn && 
                <Fragment>
                    <li className={`nav-item ${props.loginView ? 'active' : ''}`}>
                        <a className="nav-link" href="#na" onClick={props.redirectToLoginView}>Login</a>
                    </li>
                    <li className={`nav-item ${props.registerView ? 'active' : ''}`}>
                        <a className="nav-link" href="#na" onClick={props.redirectToRegisterView}>Register</a>
                    </li>
                </Fragment>
            }
          </ul>
            {
                props.isLoggedIn && 
                <NavDropdown className="navbar-nav nav-item dropdown col-md-2" title={props.userInfo.username} id="nav-dropdown">
                    {/* <NavDropdown.Item onClick={props.redirectToBoardsView}>My Boards</NavDropdown.Item> */}
                    {/* <NavDropdown.Item onClick={props.redirectToCardsListView}>My Cards</NavDropdown.Item> */}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={props.logout}>Logout</NavDropdown.Item>
                </NavDropdown>
            }
        </div>
      </nav>
    );
}

export default Menu;