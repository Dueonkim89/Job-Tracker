import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Container, Nav } from 'react-bootstrap';
import {UserLoggedInContext} from "../context/UserLoggedInStatus";

export default function ProjectAppBar() {
  // get loggedInstatus from context
  const {loggedInStatus} = React.useContext(UserLoggedInContext);
  // return appbar for not logged in users
  if (!loggedInStatus) {
    return notLoggedInUserAppBar();
  }
  // return appbar for logged in users
  return loggedInUserAppBar();
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
        <LinkContainer to="registration">
          <Nav.Link>Log out</Nav.Link>
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

