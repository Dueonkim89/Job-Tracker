import { Container, Row, Col, Form, Button, Nav, Table } from 'react-bootstrap';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserLoggedInContext } from "../context/UserLoggedInStatus";


export default function Dashboard() {
    let navigate = useNavigate();
    // userID for get request for specific user
    const [userID, setUserID] = useState(localStorage.getItem('userID'));
    // auth token
    const [token, setToken] = useState(localStorage.getItem('token'));
    // logged in status
    const {loggedInStatus, setLoggedInStatus} = useContext(UserLoggedInContext);
    // user hashmap with hashmaps as data points
    const [userInfo, setUserInfo] = useState(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (loggedInStatus) {
            getApps();
            getSkills();
        }
    }, [])

    // function to get all of user applications
    // GET /api/applications?userID={userID}
    const getApps = (argument : void) => {
        if (loggedInStatus && token) {
            axios.get("/api/applications?userID=" + userID, {
                headers: {
                    Authorization: token,
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
            setUserID('');
            navigate('/login');
        }
        
    }

    // GET request to get Company information based on companyID
    const getCompany = (companyID : any) => {
        if (token) {
            axios.get("/api/companies?companyID=" + companyID.toString(), {
                headers: {
                    Authorization: token
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
        if (loggedInStatus && token) {
            console.log('GET request for skills sent')
            axios.get("/api/skills/user?userID=" + userID, {
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