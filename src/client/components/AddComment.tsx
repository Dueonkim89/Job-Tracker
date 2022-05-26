import React, { useState } from "react";
import { Container, Form, Button, Stack } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { User } from "./User";

type LocationState = { companyName: string | null; companyID: number | null };

export default function AddComment() {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // user data stored in localstorage
    const userData = localStorage.getItem("user");
    let user: User = userData ? JSON.parse(userData) : null;
    if (!user) {
        return <Navigate to="/login" replace={true} />;
    }

    // company name and id stored in route state (redirects from company page)
    if (!location.state) {
        return <Navigate to="/main" replace={true} />;
    }
    const { companyName, companyID } = location.state as LocationState;
    if (!companyName || !companyID) {
        return <Navigate to="/main" replace={true} />;
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const body = { userID: user.userID, companyID, title: title, text: text };
            const response = await axios.post("/api/comments", body, { headers: { Authorization: user.token } });
            alert("Success!");
            navigate(`/applied_company/${companyName}`);
        } catch (err: any) {
            console.log(err);
            alert("An error occurred, please try again later.");
        } finally {
            setTitle("");
            setText("");
        }
    };

    return (
        <Container
            fluid
            style={{
                marginTop: "2.75rem",
                padding: "1rem",
                width: "60vw",
                border: "3px solid #0a2a66",
                backgroundColor: "#c0c6cc",
            }}
        >
            <Form onSubmit={handleSubmit}>
                <Stack gap={1} style={{ margin: "0 10%" }}>
                    <h2 style={{ color: "#212529" }}>Add a New Comment to {companyName}</h2>
                    <Form.Label htmlFor="title" style={{ fontWeight: "bold" }}>
                        Comment Title
                    </Form.Label>
                    <Form.Control
                        id="title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Enter title"
                    />

                    <Form.Label htmlFor="text" style={{ fontWeight: "bold" }}>
                        Comment Text
                    </Form.Label>
                    <Form.Control
                        id="text"
                        as="textarea"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        rows={4}
                        placeholder="Enter comment"
                    />

                    <Button type="submit" className="login-button">
                        Submit
                    </Button>
                </Stack>
            </Form>
        </Container>
    );
}
