import * as React from 'react';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import {validStringData, validPassword} from '../utils/formValidation';

// declare prop & state types for Login component
type MyState = { 
    userName: string,
    password: string,
    userNameValid: boolean,
    passwordValid: boolean
};

class Login extends React.Component<{}, MyState> {
    constructor(props: any) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            userNameValid: true,
            passwordValid: true
        };
        this.enterUserName = this.enterUserName.bind(this);
        this.enterPassword = this.enterPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    enterUserName(event: any) {
        this.setState({userName: event.target.value});
    }

    enterPassword(event: any) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event: any) {
        event.preventDefault();
        
        // See if all the form field has data and a valid strong password
        this.setState({ 
            userNameValid: validStringData(this.state.userName),
            passwordValid: validPassword(this.state.password)
        });

        // only make GET request when all the form field is valid
        if (validStringData(this.state.userName) && validPassword(this.state.password)) {
            console.log("To make a GET request");

            // CONDITIONAL route to user dashboard, pass in props received from server
            // https://stackoverflow.com/questions/45805930/react-router-redirect-conditional

                // update redux store before routing, so appbar is updated. 
        }
            
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
        const invalidStyle = '3px solid red';
        return (
            <Form onSubmit={this.handleSubmit}>
                <br />
                <Form.Group className="mb-3">
                    <Form.Text style={{color: 'red'}} id="requiredAsterick">* </Form.Text>
                    <Form.Text style={{color: '#212529'}} id="requiredHelper">
                        Indicates a required field
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    {this.renderInvalidInput()}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="userName" style={{fontWeight: 'bold'}}>Username</Form.Label>
                    <Form.Text style={{color: 'red'}} id="requiredAsterick"> *</Form.Text>
                    <Form.Control style={{ border: !this.state.userNameValid ? invalidStyle: ''}} id="userName" type="text" value={this.state.userName} onChange={this.enterUserName} placeholder="Enter username" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="password" style={{fontWeight: 'bold'}}>Password</Form.Label>
                    <Form.Text style={{color: 'red'}} id="requiredAsterick"> *</Form.Text>
                    <Form.Control style={{ border: !this.state.passwordValid ? invalidStyle: ''}} id="password" type="password" value={this.state.password} onChange={this.enterPassword} placeholder="Enter password" />
                </Form.Group>
                <Form.Group>
                    <Link to="../registration">Forgot password?</Link>
                </Form.Group>
                <br />
                <Button type="submit" className='login-button'>Log In</Button>
                
            </Form>
        );  
    }

    renderInvalidInput(argument: void) {
        if (!this.state.userNameValid || !this.state.passwordValid) {
            return <Form.Text style={{color: 'red'}} id="requiredAsterick">Your username or password is incorrect.</Form.Text>
        };
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