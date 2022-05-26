import React, { useContext, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Container, Nav } from 'react-bootstrap';
import {UserLoggedInContext} from "../context/UserLoggedInStatus";
import { useNavigate } from 'react-router-dom';

export default function ProjectAppBar() {
  // user
  const userData = localStorage.getItem("user");
  // get loggedInstatus from context
  const {loggedInStatus, setLoggedInStatus} = useContext(UserLoggedInContext);

  const logout = () => {
    console.log("logging out!");
    localStorage.removeItem('user');
    setLoggedInStatus(false);
  }

  if (loggedInStatus) {
    return loggedInUserAppBar()
  } else {
    return notLoggedInUserAppBar();
  }

  function loggedInUserAppBar() {
    return (
      <Navbar bg="primary" className="proj-appbar" variant="dark">
        <Container className="me-auto">
          <LinkContainer to="main">
            <Navbar.Brand>Job Tracker</Navbar.Brand>
          </LinkContainer>
        </Container>
        <Nav className="me-auto">
          <LinkContainer to="main">
            <Nav.Link>My Applications</Nav.Link>
          </LinkContainer>
          <LinkContainer to="login">
            <Nav.Link onClick={logout}>Log out</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar>
    );
  }
  
  function notLoggedInUserAppBar() {
    return (
      <Navbar bg="primary" className="proj-appbar" variant="dark">
        <Container className="me-auto">
          <LinkContainer to="login">
            <Navbar.Brand>Job Tracker</Navbar.Brand>
          </LinkContainer>
        </Container>
        <Nav className="me-auto">
          <LinkContainer to="login">
            <Nav.Link>Login</Nav.Link>
          </LinkContainer>
          <LinkContainer to="registration">
            <Nav.Link>Sign Up</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar>
    );
  }

}

