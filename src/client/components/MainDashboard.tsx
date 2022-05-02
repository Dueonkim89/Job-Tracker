import { Container, Row, Col, Form, Button, Nav, Table } from 'react-bootstrap';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserLoggedInContext } from "../context/UserLoggedInStatus";
import { User } from './User';
import { Application } from './Application';
import { render } from 'react-dom';


export default function Dashboard() {
    let navigate = useNavigate();
    // logged in status
    const {loggedInStatus, setLoggedInStatus} = useContext(UserLoggedInContext);
    // user hashmap with hashmaps as data points
    const userData = localStorage.getItem('user');
    let user : User = userData ? JSON.parse(userData) : null;
    //let applications : Array<Application> = [];
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        if (user) {
            getApps();
            getSkills();
        } else {
            navigate('/login');
        }
    }, [JSON.stringify(applications)])

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
                let temp : Array<Application> = [];
                // Go through all applications and create a new map
                for (let i=0; i<data.data.length; i++) {
                    let current = data.data[i]
                    // create application object
                    let application : Application = {"applicationID" : current.applicationID,
                                                     "companyName" : current.companyName,
                                                     "datetime" : new Date(current.datetime),
                                                     "jobPostingURL" : current.jobPostingURL,
                                                     "location" : current.location,
                                                     "position" : current.position,
                                                     "status" : current.status}
                    // Another GET call to get the company name from companyID
                    //getCompany(data.data[i].companyID, application);
                    temp.push(application);
                }
                setApplications(temp);
            })
        } else {
            //navigate('/login');
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
    const GenerateMainTable = () : JSX.Element => {
        return (
            <Container className="main-table">
                <br />
                <SetUpTable />
            </Container>
        );
    }

    // table
    const SetUpTable = () : JSX.Element => {
        return (
            <Table striped bordered hover size="sm">
                <TableHeader></TableHeader>
                <tbody>
                    {tableRow}
                </tbody>
            </Table>
        )
    }

    const TableHeader = () : JSX.Element => {
        return(
            <thead>
                <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Location</th>
                <th>Company</th>
                </tr>
            </thead>
        )
    }

    const tableRow = applications.map((app) => {
        return (
            <tr>
                <td>{app.status}</td>
                <td>{app.position}</td>
                <td>{app.location}</td>
                <td>{app.companyName}</td>
            </tr>
        )
    })

    return (
        <Container>
            <Row>
            {/*  TODO: set up bottom area for website information */}
            <GenerateMainTable />
            </Row>
            <Row>
            {/*  TODO: set up bottom area for website information */}
            </Row>
        </Container>
    )
}