import * as React from 'react';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";

// declare prop & state types for Login component
type MyState = { 
    userName: string,
    password: string
};

class Login extends React.Component<{}, MyState> {
    constructor(props: any) {
        super(props);
        this.state = {
            userName: '',
            password: ''
        };
    }

    generateLeftLoginPanel(argument: void) : JSX.Element {
        return (                        
        <Container className="login-text-box">
            <br />
            <h2 style={{marginBottom: '1.5rem'}}>Login</h2>
            <p>A free site to track your job applications and progress.</p>
            <p>Log in to check and update your job applications!</p>
        </Container>
        );
    }

    generateRightLoginPanel(argument: void) : JSX.Element {
        return (
            <Container className="login-form-field">
                {this.generateLoginForm()}
                <div className='create-account'>
                    {this.generateCreateAnAccount()}
                </div>
                
            </Container>   
        );
    }

    generateLoginForm(argument: void) : JSX.Element {
        return (
            <Form>
                <br />
                <Form.Group className="mb-3">
                    <Form.Text style={{color: 'red'}} id="requiredAsterick">* </Form.Text>
                    <Form.Text style={{color: '#212529'}} id="requiredHelper">
                        Indicates a required field
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="userName" style={{fontWeight: 'bold'}}>Username</Form.Label>
                    <Form.Text style={{color: 'red'}} id="requiredAsterick"> *</Form.Text>
                    <Form.Control id="userName" type="text" placeholder="Enter username" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="password" style={{fontWeight: 'bold'}}>Password</Form.Label>
                    <Form.Text style={{color: 'red'}} id="requiredAsterick"> *</Form.Text>
                    <Form.Control id="password" type="password" placeholder="Enter password" />
                </Form.Group>
                <Form.Group>
                    <Link to="../registration">Forgot password?</Link>
                </Form.Group>
                <br />
                <Button type="submit" className='login-button'>Log In</Button>
                
            </Form>
        );  
    }

    generateCreateAnAccount(argument: void) : JSX.Element {
        return (
            <Link to="../registration" className="create-account"><br />Create an account</Link>
        );
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        {this.generateLeftLoginPanel()}
                    </Col>
                    <Col>
                        {this.generateRightLoginPanel()}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Login;