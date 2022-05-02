import { Container, Row, Col, Form, Button, Nav, Table } from 'react-bootstrap';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserLoggedInContext } from "../context/UserLoggedInStatus";
import { User } from './User';
import { Application } from './Application';
import { Skill } from './Skill';
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
    const [skills, setSkills] = useState<Skill[]>([]);

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
                let temp : Array<Skill> = [];
                // Go through all skills and create a new map
                for (let i=0; i<data.data.length; i++) {
                    let current = data.data[i]
                    // create application object
                    let skill : Skill = {"name" : current.name, "rating" : current.rating}
                    temp.push(skill);
                }
                setSkills(temp);
            })
        } else {
            //navigate('/login');
        }
    }

    /* 
    Generates the main application dashboard table
    */
    const GenerateMainTable = () : JSX.Element => {
        return (
            <Container className="main-table">
                <br />
                <SetUpAppTable />
            </Container>
        );
    }

    // table
    const SetUpAppTable = () : JSX.Element => {
        return (
            <Table striped bordered hover size="sm">
                <TableAppHeader />
                <tbody>
                    {tableAppRow}
                </tbody>
            </Table>
        )
    }

    const TableAppHeader = () : JSX.Element => {
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

    const tableAppRow = applications.map((app) => {
        return (
            <tr>
                <td>{app.status}</td>
                <td>{app.position}</td>
                <td>{app.location}</td>
                <td>{app.companyName}</td>
            </tr>
        )
    })

    /* 
    Generates the main skills dashboard table
    */
    const GenerateSkillsTable = () : JSX.Element => {
        return (
            <Container className="main-table">
                <br />
                <SetUpSkillsTable />
            </Container>
        );
    }

    // table
    const SetUpSkillsTable = () : JSX.Element => {
        return (
            <Table striped bordered hover size="sm">
                <TableSkillsHeader />
                <tbody>
                    {tableSkillsRow}
                </tbody>
            </Table>
        )
    }

    const TableSkillsHeader = () : JSX.Element => {
        return(
            <thead>
                <tr>
                <th>Skills</th>
                <th>Rating</th>
                </tr>
            </thead>
        )
    }

    const tableSkillsRow = skills.map((skill) => {
        return (
            <tr>
                <td>{skill.name}</td>
                <td>{skill.rating}</td>
            </tr>
        )
    })

    return (
        <Container>
            <Row>
                <Col xs={12} md={8}>
                {/*  TODO: set up bottom area for website information */}
                <GenerateMainTable />
                </Col>
                <Col xs={6} md={4}>
                {/*  TODO: set up bottom area for website information */}
                <GenerateSkillsTable />
                </Col>
            </Row>
            
        </Container>
    )
}