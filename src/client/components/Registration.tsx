import * as React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import {validIntData, validStringData, validPassword} from '../utils/formValidation';
import {formatPhoneNumber} from '../utils/helper';

// declare prop & state types for Registration component
type MyState = { 
    firstName: string,
    lastName: string,
    email: string,
    userName: string,
    phoneNumber: number,
    password: string,
    firstNameValid: boolean,
    lastNameValid: boolean,
    emailValid: boolean,
    userNameValid: boolean,
    phoneNumberValid: boolean,
    passwordValid: boolean,
    userNameAvailable: boolean
};

class Registration extends React.Component<{}, MyState> {
    constructor(props: any) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            userName: '',
            phoneNumber: 0,
            password: '',
            firstNameValid: true,
            lastNameValid: true,
            emailValid: true,
            userNameValid: true,
            phoneNumberValid: true,
            passwordValid: true,
            userNameAvailable: true
        };
        this.enterFirstName = this.enterFirstName.bind(this);
        this.enterLastName = this.enterLastName.bind(this);
        this.enterEmail = this.enterEmail.bind(this);
        this.enterUserName = this.enterUserName.bind(this);
        this.enterPhoneNumber = this.enterPhoneNumber.bind(this);
        this.enterPassword = this.enterPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    enterFirstName(event: any) {
        this.setState({firstName: event.target.value});
    }

    enterLastName(event: any) {
        this.setState({lastName: event.target.value});
    }

    enterEmail(event: any) {
        this.setState({email: event.target.value});
    }

    enterUserName(event: any) {
        this.setState({userName: event.target.value});
    }

    enterPhoneNumber(event: any) {
        this.setState({phoneNumber: parseInt(event.target.value)});
    }

    enterPassword(event: any) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event: any) {
        event.preventDefault();
        
        // See if all the form field has data and a valid strong password
        this.setState({ 
            firstNameValid: validStringData(this.state.firstName),
            lastNameValid: validStringData(this.state.lastName),
            emailValid: validStringData(this.state.email),
            userNameValid: validStringData(this.state.userName),
            phoneNumberValid: validIntData(this.state.phoneNumber),
            passwordValid: validPassword(this.state.password)
        });

        // MAKE GET REQUEST: check if username is taken and update state

        // only make POST request when all the form field is valid AND username is not taken
        if (validStringData(this.state.firstName) && validStringData(this.state.lastName) 
            && validStringData(this.state.email) && validStringData(this.state.userName) 
            && validIntData(this.state.phoneNumber) && validPassword(this.state.password)) {

            // console.log(formatPhoneNumber(this.state.phoneNumber));

            console.log("To make a POST request");

            // CONDITIONAL route to user dashboard, pass in props received from server
            // https://stackoverflow.com/questions/45805930/react-router-redirect-conditional

                // update redux store before routing, so appbar is updated. 
        }
            
    }

    generateLeftRegistrationPanel(argument: void) : JSX.Element {
        return (                        
        <Container className="registeration-text-box">
            <h2 style={{marginBottom: '1.5rem'}}>Sign Up</h2>
            <p>A free site to track your job applications and progress.</p>
            <p>Join Job Tracker to organize your applications and track applications by your skill. Leave comments for companies you interviewed for and more!</p>
        </Container>
        );
    }

    generateRightRegistrationPanel(argument: void) : JSX.Element {
        return (
            <Container className="registeration-form-field">
                {this.generateRegistrationForm()}
            </Container>   
        );
    }

    generateRegistrationForm(argument: void) : JSX.Element {
        const invalidStyle: string = '3px solid red';
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label htmlFor="firstName" style={{fontWeight: 'bold'}}>First Name</Form.Label>
                        <Form.Control style={{ border: !this.state.firstNameValid ? invalidStyle: ''}} id="firstName" type="text" value={this.state.firstName} onChange={this.enterFirstName} placeholder="Enter first name" />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label htmlFor="lastName" style={{fontWeight: 'bold'}}>Last Name</Form.Label>
                        <Form.Control style={{ border: !this.state.lastNameValid ? invalidStyle: ''}} id="lastName" type="text" value={this.state.lastName} onChange={this.enterLastName} placeholder="Enter last name" />
                    </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="userEmail" style={{fontWeight: 'bold'}}>Email Address</Form.Label>
                    <Form.Control style={{ border: !this.state.emailValid ? invalidStyle: ''}} id="userEmail" type="email" value={this.state.email} onChange={this.enterEmail} placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="userName" style={{fontWeight: 'bold'}}>Username</Form.Label>
                    <Form.Control style={{ border: !this.state.userNameValid || !this.state.userNameAvailable ? invalidStyle: ''}} id="userName" type="text" value={this.state.userName} onChange={this.enterUserName} placeholder="Enter username" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="phoneNumber" style={{fontWeight: 'bold'}}>Phone Number</Form.Label>
                    <Form.Control style={{ border: !this.state.phoneNumberValid ? invalidStyle: ''}} id="phoneNumber" type="number" value={this.state.phoneNumber} onChange={this.enterPhoneNumber} placeholder="Enter phone number" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="password" style={{fontWeight: 'bold'}}>Password</Form.Label>
                    <Form.Control style={{ border: !this.state.passwordValid ? invalidStyle: ''}} id="password" type="password" value={this.state.password} onChange={this.enterPassword} placeholder="Enter password" />
                    <Form.Text style={{color: '#212529'}} id="passwordHelpBlock">
                        Your password must be 8 - 32 characters long. Contain at least 1 uppercase letter, 1 lowercase letter and 1 number.
                    </Form.Text>
                </Form.Group>
                <Button type="submit">Sign Up</Button>
            </Form>
        );  
    }

    render() {
        //const {firstNameValid, lastNameValid, emailValid, userNameValid, phoneNumberValid, passwordValid, userNameAvailable} = this.state;
        //console.log(firstNameValid, lastNameValid, emailValid, userNameValid, phoneNumberValid, passwordValid, userNameAvailable);
        return (
            <Container>
                <Row>
                    <Col>
                        {this.generateLeftRegistrationPanel()}
                    </Col>
                    <Col>
                        {this.generateRightRegistrationPanel()}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Registration;