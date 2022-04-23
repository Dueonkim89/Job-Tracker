import React, { useEffect} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Protected() {
    let navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get("http://localhost:3001/protected", {headers : {
            Authorization : token,
        }}).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err);
            // if user not authenticated, redirect to login page
            navigate('/users/login')

        })
    }, [])
    return (
        <div>
            <h1>Protected</h1>
        </div>
    )
}

export default Protected;