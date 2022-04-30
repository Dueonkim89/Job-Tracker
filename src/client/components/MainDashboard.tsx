import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Dashboard() {
    let navigate = useNavigate();
    // userID for get request for specific user
    const [userID, setUserID] = useState(localStorage.getItem('userID'));
    // auth token
    const [token, setToken] = useState(localStorage.getItem('token'));
    // logged in status
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn'));

    useEffect(() => {
        if (loggedIn == 'true') {
            getApps();
            getSkills();
        }
    }, [])

    // function to get all of user applications
    // GET /api/applications?userID={userID}
    const getApps = (argument : void) => {
        console.log("Starting GET request for applications");
        if (token) {
            axios.get("http://localhost:3001/api/applications?userID=" + userID, {
                headers: {
                    Authorization: token,
                }
            }).then(data => {
                console.log('GET request success');
                for (let i=0; i<data.data.length; i++) {
                    console.log()
                    // Another GET call to get the company name from companyID
                    //getCompany(data.data[i].companyID);
                    console.log(data.data[i])
                }
            })
        } else {
            setLoggedIn('');
            setUserID('');
            navigate('/login');
        }
        
    }

    // GET request to get Company information based on companyID
    /*
    const getCompany = (companyID : any) => {
        console.log(companyID);
        if (token) {
            axios.get("" + companyID.toString(), {
                headers: {
                    Authorization: token
                }
            }).then(data => {
                console.log('GET request for Company info success');
                // return company info from data
            })
        } else {
            return null
        }
    }
    */

    // GET request for all user skills
    const getSkills = () => {
        if (token) {
            console.log('GET request for skills sent')
            axios.get("http://localhost:3001/api/skills/user?userID=" + userID, {
                headers: {
                    Authorization: token
                }
            }).then(data => {
                console.log('GET request for all skills success');
                console.log("\nALL SKILLS");
                for (let i=0; i<data.data.length; i++) {
                    console.log(data.data[i]);
                    // create a dicionary with skills as key and rating as value
                    // and store the dictionary to localStorage
                }
            })
        } else {
            setLoggedIn('');
            setUserID('');
            navigate('/login');
        }
    }

    /* 
    Generates the main dashboard table by 
    */
    const generateMainTable = (argument: void) : JSX.Element => {
        return (
            <Container className="main-table">

            </Container>
        );
    }

    return (
        <Container>
            <Row>
            {/*  TODO: set up bottom area for website information */}
            {generateMainTable()}
            </Row>
            <Row>
            {/*  TODO: set up bottom area for website information */}
            </Row>
        </Container>
    )
}