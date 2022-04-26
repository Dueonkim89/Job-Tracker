import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {validStringData, validPassword} from '../utils/formValidation';

function Login() {
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameValid, setUsernameValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    // auth token
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token"));

    // checks if the token in the local storage matches the one created when the user logged in. 
    // if it is the user is directed to protected page
    useEffect(() => {
        if (loggedIn) {
            axios.get("http://localhost:3001/users/login", {
            headers: {
                Authorization: loggedIn,
            }
            }).then(res => {
                console.log(res);
                navigate('/protected');
            }).catch(err => {
                console.log(err);
            })
        } else {
            navigate('/login')
        }

        const token = localStorage.getItem('token');
        
        
    }, [])

    const generateLeftLoginPanel = (argument: void) : JSX.Element => {
        return (                        
        <Container className="login-text-box">
            <br />
            <h2 style={{marginBottom: '1.5rem'}}>Login</h2>
            <p>A free site to track your job applications and progress.</p>
            <p>Log in to check and update your job applications!</p>
        </Container>
        );
    }

    // Once the user clicks submit and the login username and password have been authenticated 
    // the user will be redirected to the protected page
    const handleSubmit = (event: any) => {
        event.preventDefault();
        
        // See if all the form field has data and a valid strong password
        setUsernameValid(validStringData(username));
        //setPasswordValid(validPassword(password));
        
        // only make GET request when all the form field is valid
        if (validStringData(username) && validPassword(password)) {
            console.log("To make a GET request");
            console.log(username, password);
            axios.post("http://localhost:3001/users/login", { username, password }).then(user => {
                console.log(user);
                localStorage.setItem('token', user.data.token);
                navigate('/protected');
            }).catch(err => {
                console.log(err);
            })
        }
            
    }

    const generateRightLoginPanel = (argument: void) : JSX.Element => {
        return (
            <Container className="login-form-field">
                {generateLoginForm()}
                <div className='create-account'>
                    {generateCreateAnAccount()}
                </div>
                
            </Container>   
        );
    }

    const generateLoginForm = (argument: void) : JSX.Element => {
        const invalidStyle = '3px solid red';
        return (
            <Form onSubmit={handleSubmit}>
                <br />
                <Form.Group className="mb-3">
                    <Form.Text style={{color: 'red'}} id="requiredAsterick">* </Form.Text>
                    <Form.Text style={{color: '#212529'}} id="requiredHelper">
                        Indicates a required field
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    {renderInvalidInput()}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="username" style={{fontWeight: 'bold'}}>username</Form.Label>
                    <Form.Text style={{color: 'red'}} id="requiredAsterick"> *</Form.Text>
                    <Form.Control style={{ border: !usernameValid ? invalidStyle: ''}} id="username" type="text" value={username} onChange={event => setUsername(event.target.value)} placeholder="Enter username" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="password" style={{fontWeight: 'bold'}}>Password</Form.Label>
                    <Form.Text style={{color: 'red'}} id="requiredAsterick"> *</Form.Text>
                    {/* re-add style={{ border: !passwordValid ? invalidStyle: ''}}  */}
                    <Form.Control id="password" type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter password" />
                </Form.Group>
                <Form.Group>
                    <Link to="../registration">Forgot password?</Link>
                </Form.Group>
                <br />
                <Button type="submit" className='login-button'>Log In</Button>
                
            </Form>
        );  
    }

    const renderInvalidInput = (argument: void) => {
        if (!usernameValid || !passwordValid) {
            return <Form.Text style={{color: 'red'}} id="requiredAsterick">Your username or password is incorrect.</Form.Text>
        };
    }

    const generateCreateAnAccount = (argument: void) : JSX.Element => {
        return (
            <Link to="../registration" className="create-account"><br />Create an account</Link>
        );
    }

    return (
        <Container>
            <Row>
                <Col>
                    {generateLeftLoginPanel()}
                </Col>
                <Col>
                    {generateRightLoginPanel()}
                </Col>
            </Row>
        </Container>
    )
}

export default Login;