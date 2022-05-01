import { Container, Row, Col, Form, Button, Nav, Table } from 'react-bootstrap';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserLoggedInContext } from "../context/UserLoggedInStatus";
import { User } from './User';


export default function Dashboard() {
    let navigate = useNavigate();
    // logged in status
    const {loggedInStatus, setLoggedInStatus} = useContext(UserLoggedInContext);
    // user hashmap with hashmaps as data points
    const userData = localStorage.getItem('user');
    let user : User = userData ? JSON.parse(userData) : null;

    useEffect(() => {
        if (user) {
            console.log("USER DATA");
            console.log(user);
            getApps();
            getSkills();
        } else {
            navigate('/login');
        }
    }, [])

    // the get request to get user information and navigate to main dashboard page
    const checkToken = () => {
        if (userData) {
            axios
                .get("/api/users/login", {
                    headers: {
                        Authorization: user.token,
                    },
                })
                .then((res) => {
                    console.log('user is logged in')
                })
                .catch((err) => {
                    localStorage.removeItem('user');
                    console.log(err);
                });
        } else {
            navigate("/login");
        }
    };

    // function to get all of user applications
    // GET /api/applications?userID={userID}
    const getApps = (argument : void) => {
        if (loggedInStatus && user.token) {
            axios.get("/api/applications?userID=" + user.userID, {
                headers: {
                    Authorization: user.token,
                }
            }).then(data => {
                console.log('GET request for applications success');
                for (let i=0; i<data.data.length; i++) {
                    // Another GET call to get the company name from companyID
                    getCompany(data.data[i].companyID);
                    console.log(data.data[i])
                }
            })
        } else {
            //navigate('/login');
        }
        
    }

    // GET request to get Company information based on companyID
    const getCompany = (companyID : any) => {
        if (user.token) {
            axios.get("/api/companies?companyID=" + companyID.toString(), {
                headers: {
                    Authorization: user.token
                }
            }).then(data => {
                console.log('GET request for Company info success');
                // return company info from data
                console.log(data.data);
            })
        } else {
            return false
        }
    }

    // GET request for all user skills
    const getSkills = () => {
        if (loggedInStatus && user.token) {
            axios.get("/api/skills/user?userID=" + user.userID, {
                headers: {
                    Authorization: user.token
                }
            }).then(data => {
                console.log("\nALL SKILLS");
                for (let i=0; i<data.data.length; i++) {
                    console.log(data.data[i]);
                    // create a dicionary with skills as key and rating as value
                    // and store the dictionary to localStorage
                }
            })
        } else {
            //navigate('/login');
        }
    }

    /* 
    Generates the main dashboard table by 
    */
    const generateMainTable = (argument: void) : JSX.Element => {
        return (
            <Container className="main-table">
                <br />
                {setUpTable()}
            </Container>
        );
    }

    // table
    const setUpTable = () => {
        return (
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <td>3</td>
                    <td colSpan={2}>Larry the Bird</td>
                    <td>@twitter</td>
                    </tr>
                </tbody>
            </Table>
        )
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