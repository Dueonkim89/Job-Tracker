import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function Login() {
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // checks if the token in the local storage matches the one created when the user logged in. if it is the user is directed to protected page
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("/api/users/login", {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                console.log(res);
                navigate("/protected");
            })
            .catch((err) => {
                console.log(err);
                navigate("/login");
            });
    }, []);
    // Once the user clicks submit and the login username and password have been authenticated the user will be redirected to the protected page
    const submit = () => {
        console.log(username, password);
        axios
            .post("/api/users/login", { username, password })
            .then((user) => {
                console.log(user);
                localStorage.setItem("token", user.data.token);
                navigate("/protected");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />
            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <button onClick={submit}>Submit</button>
        </div>
    );
}

export default Login;
