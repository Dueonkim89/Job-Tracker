import * as React from 'react';
import { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Container, Nav } from 'react-bootstrap';
import {UserLoggedInContext} from "../context/UserLoggedInStatus";
import { Navigate, useNavigate } from 'react-router-dom';

export default function ProjectAppBar() {
  // get loggedInstatus from localStorage
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn'));
  // authentication token
  const [token, setToken] = useState(localStorage.getItem('token'));
  // return appbar for not logged in users
  if (!token && !loggedIn) {
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
        <LinkContainer to="login">
          <Nav.Link onClick={removeTokenFromLS}>Log out</Nav.Link>
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

function removeTokenFromLS(event : any) {
  localStorage.removeItem('token');
  window.location.reload();
}

