import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Protected() {
    let navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = localStorage.getItem("loggedIn");
        axios
            .get("/api/users/protected", {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
                // if user not authenticated, redirect to login page
                localStorage.setItem("loggedIn", "");
                navigate("/login");
            });
    }, []);
    return (
        <div>
            <h1>Protected</h1>
        </div>
    );
}

export default Protected;
