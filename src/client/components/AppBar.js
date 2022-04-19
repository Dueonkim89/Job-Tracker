import * as React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

export default function ProjectAppBar() {
  return (
    <Navbar bg="primary" className="proj-appbar" variant="dark">
      <Container className="me-auto">
        <Navbar.Brand>Job Tracker</Navbar.Brand>
      </Container>
      <Nav className="me-auto">
        <Nav.Link href="#home">Login</Nav.Link>
        <Nav.Link href="#link">Sign Up</Nav.Link>
      </Nav>
    </Navbar>
  );
}