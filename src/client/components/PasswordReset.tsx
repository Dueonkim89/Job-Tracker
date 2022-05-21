import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, Nav, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Webpage #1: email form
User visits webpage: {app}.com/forgot-password
Webpage has a form to enter their email address
User fills out form and clicks submit

Form submits POST request to route #1
Route will return {success: true} if the email was validly found in the database, otherwise it will return false
Upon success, webpage will display a message instructing user to check their email inbox for a link to reset the password
Upon failure, webpage will inform user that the email does not exist in the database
 */
export function PasswordResetEmailForm() {
    const [emailAddres, setEmailAddress] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        console.log("hello");
        // See if all the form field has data and a valid strong password
        // setUsernameValid(validStringData(username));
        // //setPasswordValid(validPassword(password));

        // // only make GET request when all the form field is valid
        // if (usernameValid && passwordValid) {
        //     axios
        //         .post("/api/users/login", { username, password })
        //         .then((res) => {
        //             setLoggedInStatus(true);
        //             // create user
        //             user.set('token' , res.data.token);
        //             user.set('userID', res.data.userID);
        //             const jsonObject = Object.fromEntries(user);
        //             localStorage.setItem("user", JSON.stringify(jsonObject));
        //             navigate('/main');
        //             window.location.reload();
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         });
        // }
    };

    const generateLoginForm = (): JSX.Element => {
        return (
            <Form onSubmit={handleSubmit}>
                <Stack gap={4} className="col-md-5 mx-auto">
                    <div><strong>Please enter your email address below to reset your password</strong></div>
                    <Form.Label htmlFor="emailAddress" style={{ fontWeight: "bold" }}>
                        Email Address
                    </Form.Label>
                    <Form.Control
                        // style={{ border: !usernameValid ? invalidStyle : "" }}
                        id="emailAddress"
                        type="text"
                        value={emailAddres}
                        onChange={(event) => setEmailAddress(event.target.value)}
                        placeholder="Enter email address"
                    />
                    <Button type="submit" className="login-button">
                        Submit
                    </Button>
                </Stack>
            </Form>
        );
    };

    return <Container className="login-form-field">{generateLoginForm()}</Container>;
}

/**
 * Webpage #2: changing password
User clicks on the email-provided link: {app}.com/change-password/{unique_ID}
The webpage contains a form for the user to fill out their email address and new password; user fills out the form and clicks submit
The change-password webpage is the same for every version of the unique_ID; the unique_ID portion of the URL is simply a security mechanism

Form submits POST request to route #2 (see below)
The unique_ID is also included in this form submission (it can be obtained client-side from react-router or the document.location object)
Upon success, route will return {success: true} and redirect to the login page OR automatically log the user into the website (TBD)
Upon failure, route will return the reason for failure (see below)
 */
