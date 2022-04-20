import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Container, Nav } from 'react-bootstrap';

export default function ProjectAppBar() {
  return (
    <Navbar bg="primary" className="proj-appbar" variant="dark">
      <Container className="me-auto">
        <Navbar.Brand>Job Tracker</Navbar.Brand>
      </Container>
      <Nav className="me-auto">
        <Nav.Link>Login</Nav.Link>
        <LinkContainer to="registeration">
            <Nav.Link>Sign Up</Nav.Link>
        </LinkContainer>
      </Nav>
    </Navbar>
  );
}