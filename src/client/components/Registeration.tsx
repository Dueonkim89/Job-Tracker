import * as React from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

class Registeration extends React.Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Container className="registeration-text-box">
                            <h2 style={{marginBottom: '1.5rem'}}>Sign Up</h2>
                            <p>A free site to track your job applications and progress.</p>
                            <p>Join Job Tracker to organize your applications and track applications by your skill. Leave comments for companies you interviewed for and more!</p>
                        </Container>
                    </Col>
                    <Col>
                        <Container className="registeration-form-field">
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                    <Form.Label style={{fontWeight: 'bold'}}>First Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter first name" />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                    <Form.Label style={{fontWeight: 'bold'}}>Last Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter last name" />
                                    </Form.Group>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{fontWeight: 'bold'}}>Email Address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                </Form.Group>
                            </Form>
                        </Container>          
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Registeration;