import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, Nav, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

/**
 * Webpage #1: email form
User visits webpage: {app}.com/forgot_password
User fills out their email address & server sends an email with a unique link to webpage #2
*/
const isAxiosErrGuard = (err: any): err is AxiosError => err.isAxiosError;

export function PasswordResetEmail() {
    const [emailAddress, setEmailAddress] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const response = await axios.post("/api/pw-reset/send-email", { emailAddress });
            alert("Please check your email for the link to reset your password.");
        } catch (err: any) {
            if (isAxiosErrGuard(err) && err.response?.data?.field === "email") {
                alert("An account tied to that email not was found.");
            } else {
                console.log(err);
                alert("An error occurred, please try again later.");
            }
        } finally {
            setEmailAddress("");
        }
    };

    const generateEmailForm = (): JSX.Element => {
        return (
            <Form onSubmit={handleSubmit}>
                <Stack gap={4} className="col-md-5 mx-auto">
                    <div>
                        <strong>Please enter your email address below to reset your password</strong>
                    </div>
                    <Form.Label htmlFor="emailAddress" style={{ fontWeight: "bold" }}>
                        Email Address
                    </Form.Label>
                    <Form.Control
                        id="emailAddress"
                        type="text"
                        value={emailAddress}
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

    return <Container className="login-form-field">{generateEmailForm()}</Container>;
}

/**
 * Webpage #2: changing password
User clicks on the email-provided link: {app}.com/change_password/{unique_ID}
The webpage contains a form for the user to fill out their email address and new password; user fills out the form and clicks submit
The change-password webpage is the same for every version of the unique_ID; the unique_ID portion of the URL is simply a security mechanism

Form submits POST request to route #2 (see below)
The unique_ID is also included in this form submission (it can be obtained client-side from react-router or the document.location object)
Upon success, route will return {success: true} and redirect to the login page OR automatically log the user into the website (TBD)
Upon failure, route will return the reason for failure (see below)
 */
export function PasswordChangeForm() {
    const [emailAddress, setEmailAddress] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetID, setResetID] = useState("");
    let navigate = useNavigate();

    // link will be like:  /change_password?id=${resetID}
    useEffect(() => {
        const id = new URL(window.location.href).searchParams.get("id");
        console.log(id);
        if(!id) {
            alert("There was an error with this url, please try generating another email.");
            return navigate('/forgot_password');
        } else {
            setResetID(id);
        }
    }, [])

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const response = await axios.post("/api/pw-reset/send-email", { resetID, emailAddress, newPassword });
            alert("Password succesfully reset. You man now log in with the new password.");
            return navigate('/login');
        } catch (err: any) {
            // TODO - update these catch catching
            if (isAxiosErrGuard(err) && err.response?.data?.field === "email") {
                alert("An account tied to that email not was found.");
            } else {
                console.log(err);
                alert("An error occurred, please try again later.");
            }
        } finally {
            setEmailAddress("");
            setNewPassword("");
        }
    };

    const generateResetForm = (): JSX.Element => {
        // TODO - copy password rules from the login page (e.g. 8+ characters, uppercase/lowercase/number)
        return (
            <Form onSubmit={handleSubmit}>
                <Stack gap={4} className="col-md-5 mx-auto">
                    <div>
                        <strong>Please enter your email address and desired new password</strong>
                    </div>
                    <Form.Label htmlFor="emailAddress" style={{ fontWeight: "bold" }}>
                        Email Address
                    </Form.Label>
                    <Form.Control
                        id="emailAddress"
                        type="text"
                        value={emailAddress}
                        onChange={(event) => setEmailAddress(event.target.value)}
                        placeholder="Enter email address"
                    />
                    <Form.Label htmlFor="newPassword" style={{ fontWeight: "bold" }}>
                        New Password
                    </Form.Label>
                    <Form.Control
                        id="newPassword"
                        type="text"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="Enter new password"
                    />
                    <Button type="submit" className="login-button">
                        Submit
                    </Button>
                </Stack>
            </Form>
        );
    };

    return <Container className="login-form-field">{generateResetForm()}</Container>;
}