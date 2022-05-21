import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { validStringData, validPassword } from "../utils/formValidation";
import { UserLoggedInContext } from "../context/UserLoggedInStatus";

function Login() {
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameValid, setUsernameValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    // logged in status
    const {loggedInStatus, setLoggedInStatus} = useContext(UserLoggedInContext);

    const userData = localStorage.getItem("user");
    let user = new Map();

    // checks if the token in the local storage matches the one created when the user logged in.
    // if it is the user is directed to main dashboard page
    useEffect(() => {
        if (userData) {
            user = JSON.parse(userData);
            setLoggedInStatus(true);
            navigate('/main');
        } else {
            
        }
    }, []);

    const generateLeftLoginPanel = (argument: void): JSX.Element => {
        return (
            <Container className="login-text-box">
                <br />
                <h2 style={{ marginBottom: "1.5rem" }}>Login</h2>
                <p>A free site to track your job applications and progress.</p>
                <p>Log in to check and update your job applications!</p>
            </Container>
        );
    };

    // Once the user clicks submit and the login username and password have been authenticated
    // the user will be redirected to the main dashboard page
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        // See if all the form field has data and a valid strong password
        setUsernameValid(validStringData(username));
        //setPasswordValid(validPassword(password));

        // only make GET request when all the form field is valid
        if (usernameValid && passwordValid) {
            axios
                .post("/api/users/login", { username, password })
                .then((res) => {
                    setLoggedInStatus(true);
                    // create user
                    user.set('token' , res.data.token);
                    user.set('userID', res.data.userID);
                    const jsonObject = Object.fromEntries(user);
                    localStorage.setItem("user", JSON.stringify(jsonObject));
                    navigate('/main');
                    window.location.reload();
                })
                .catch((err) => {
                    const errField = err.response?.data?.field
                    if(errField) alert(`Invalid ${errField}. Please try again.`)
                    console.log(err);
                }).finally(() => {
                    setPassword("");
                    setUsername("");
                });
        }
    };

    const generateRightLoginPanel = (argument: void): JSX.Element => {
        return (
            <Container className="login-form-field">
                {generateLoginForm()}
                <div className="create-account">{generateCreateAnAccount()}</div>
            </Container>
        );
    };

    const generateLoginForm = (argument: void): JSX.Element => {
        const invalidStyle = "3px solid red";
        return (
            <Form onSubmit={handleSubmit}>
                <br />
                <Form.Group className="mb-3">
                    <Form.Text style={{ color: "red" }} id="requiredAsterick">
                        *{" "}
                    </Form.Text>
                    <Form.Text style={{ color: "#212529" }} id="requiredHelper">
                        Indicates a required field
                    </Form.Text>
                </Form.Group>
                <Form.Group>{renderInvalidInput()}</Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="username" style={{ fontWeight: "bold" }}>
                        username
                    </Form.Label>
                    <Form.Text style={{ color: "red" }} id="requiredAsterick">
                        {" "}
                        *
                    </Form.Text>
                    <Form.Control
                        style={{ border: !usernameValid ? invalidStyle : "" }}
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Enter username"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="password" style={{ fontWeight: "bold" }}>
                        Password
                    </Form.Label>
                    <Form.Text style={{ color: "red" }} id="requiredAsterick">
                        {" "}
                        *
                    </Form.Text>
                    {/* re-add style={{ border: !passwordValid ? invalidStyle: ''}}  */}
                    <Form.Control
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter password"
                    />
                </Form.Group>
                <Form.Group>
                    <Link to="../forgot_password">Forgot password?</Link>
                </Form.Group>
                <br />
                <Button type="submit" className="login-button">
                    Log In
                </Button>
            </Form>
        );
    };

    const renderInvalidInput = (argument: void) => {
        if (!usernameValid || !passwordValid) {
            return (
                <Form.Text style={{ color: "red" }} id="requiredAsterick">
                    Your username or password is incorrect.
                </Form.Text>
            );
        }
    };

    const generateCreateAnAccount = (argument: void): JSX.Element => {
        return (
            <Link to="../registration" className="create-account">
                <br />
                Create an account
            </Link>
        );
    };

    return (
        <Container>
            <Row>
                <Col>{generateLeftLoginPanel()}</Col>
                <Col>{generateRightLoginPanel()}</Col>
            </Row>
        </Container>
    );
}

export default Login;