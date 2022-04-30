import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Container, Nav } from 'react-bootstrap';
import {UserLoggedInContext} from "../context/UserLoggedInStatus";

export default function ProjectAppBar() {
  // get loggedInstatus from context
  const {loggedInStatus, setLoggedInStatus} = React.useContext(UserLoggedInContext);

  const logout = () => {
    localStorage.removeItem('token');
    setLoggedInStatus(false);
  }

  function loggedInUserAppBar() {
    return (
      <Navbar bg="primary" className="proj-appbar" variant="dark">
        <Container className="me-auto">
          <Navbar.Brand>Job Tracker</Navbar.Brand>
        </Container>
        <Nav className="me-auto">
          <LinkContainer to="login">
            <Nav.Link>My contacts</Nav.Link>
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
          <Navbar.Brand>Job Tracker</Navbar.Brand>
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

  // return appbar for not logged in users
  if (!loggedInStatus) {
    return notLoggedInUserAppBar();
  }
  // return appbar for logged in users
  return loggedInUserAppBar();
}

