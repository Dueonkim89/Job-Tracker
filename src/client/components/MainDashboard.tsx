import { Container, Row, Col, Modal, Button, InputGroup, FormControl, Table, DropdownButton, Dropdown } from 'react-bootstrap';
import Rating from '@mui/material/Rating';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserLoggedInContext } from "../context/UserLoggedInStatus";
import { User } from './User';
import { Application } from './Application';
import { Contact } from './Contact';
import { Skill } from './Skill';
import { setConstantValue } from 'typescript';
import RaisedButton from 'material-ui/RaisedButton';
import { application } from 'express';
import { EventEmitter } from 'stream';
import { constants } from 'buffer';
import {APP_STATUSES} from "../../global/constants"


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

    const statuslist={
        myarray:["Applied","Online Assessment","Phone Interview","Technical Interview","Accepted","Rejected"]
    }

    // Showing modal useState
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => setShow(true);

    // Note state to update
    const [currentApp, setCurrentApp] = useState({notes: '', applicationID: ''});
    let currentNote : string = '';

    useEffect(() => {
        if (user) {
            getApps();
            getSkills();
        } else {
            navigate('/login');
        }
    }, [JSON.stringify(applications)])

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
                    let current = data.data[i];
                    let tempContacts : Array<Contact> = [];

                    if (current.contacts) {
                        for (let j=0; j<current.contacts.length; j++) {
                            let contact : Contact = {"contactID" : current.contacts[j].contactID,
                                                    "firstName" : current.contacts[j].firstName,
                                                    "lastName" : current.contacts[j].lastName,
                                                    "role" : current.contacts[j].role,
                                                    "emailAddress" : current.contacts[j].emailAddress,
                                                    "phoneNumber" : current.contacts[j].phoneNumber};
                            tempContacts.push(contact);
                    }
                    }
                    // create contacts and add to array
                    

                    // create application object
                    let application : Application = {"applicationID" : current.applicationID,
                                                     "companyName" : current.companyName,
                                                     "datetime" : new Date(current.datetime),
                                                     "jobPostingURL" : current.jobPostingURL,
                                                     "location" : current.location,
                                                     "position" : current.position,
                                                     "status" : current.status,
                                                     "notes" : current.notes,
                                                     "contacts" : tempContacts}
                    temp.push(application);
                }
                setApplications(temp);
                console.log(applications)
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
                    let skill : Skill = {"skillID" : current.skillID,"name" : current.name, "rating" : current.rating}
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
                <th>Notes</th>
                </tr>
            </thead>
        )
    }

    const ShowModal = () : JSX.Element => {
        return (
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Notes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <InputGroup>
                    <FormControl as="input" aria-label="With textarea" defaultValue={currentApp.notes} onChange={(e) => {
                        currentNote = e.target.value;
                    }} />
                </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => {
                    updateNotes(Number(currentApp.applicationID), currentNote)
                    .then(handleClose);
                }}>Update</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    const updateNotes = async (applicationID : number, notes : string) => {
        if (user) {
            axios.patch("/api/applications", {applicationID, notes}, {
                headers: {
                    Authorization: user.token
                }
            })
            .then((res) => {
                setApplications((apps: Application[]) => {
                    // remove update given application's notes; return the new array
                    const newApps = apps.slice();
                    const appToUpdate = newApps.find((app) => Number(app.applicationID) === applicationID);
                    if(appToUpdate) appToUpdate.notes = notes;
                    return newApps;
                });
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    const tableAppRow = applications.map((app) => {
        return (
            <tr>
                <td>
                    <div>
                        <DropdownButton align="end" title={app.status} variant="" onSelect={value=>{
                            if (value === null) {
                                value = app.status;
                            }
                            updateAppStatus(Number(app.applicationID), value)
                        }}>
                            {Object.entries(APP_STATUSES).map(([key, name])=>(
                                <Dropdown.Item eventKey={name}>{name}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                    
                </td>
                <td><a href={app.jobPostingURL} target="_blank" rel="noopener">
                    {app.position}
                </a></td>
                <td>{app.location}</td>
                <td><a href={window.origin + "/applied_company/" + app.companyName} target="_blank" rel="noopener">
                    {app.companyName}
                </a></td>
                <td>
                    <div className="d-grid">
                        <Button variant="" onClick={() => {
                            handleShow();
                            setCurrentApp({notes: app.notes, applicationID: app.applicationID})
                            }}>
                            {app.notes || <div style={{color: "grey"}}>[Click to Add Notes]</div>}
                        </Button>
                        <ShowModal />
                    </div>
                </td>
            </tr>
        )
    })

    // sends a post request to change the application status
    const updateAppStatus = (applicationID : number, status : string) => {
        if (user) {
            axios.patch("/api/applications", {applicationID, status}, {
                headers: {
                    Authorization: user.token
                }
            })
            // update the app status with given applicationID
            .then((res) => {
                setApplications((apps: Application[]) => {
                    const newApps = apps.slice();
                    const appToUpdate = newApps.find((app) => Number(app.applicationID) === applicationID);
                    if(appToUpdate) appToUpdate.status = status;
                    return newApps;
                });
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

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
                <td><Rating name="simple-controlled" value={skill.rating} id={skill.skillID} onChange={(event, newValue) => {
                    if (event.currentTarget.parentElement) {
                        let skillID = event.currentTarget.parentElement.id;
                        updateUserSkillRating(parseInt(skillID), parseInt(user.userID), newValue);
                    } 
                    }} /></td>
            </tr>
        )
    })

    const updateUserSkillRating = async (skillID:number, userID:number, rating:any) => {
        if (user) {
            axios.patch("/api/skills/user", {userID, skillID, rating}, {
                headers: {
                    Authorization: user.token
                }
            })
            // update the skill rating with the given skillID
            .then((res) => {
                setSkills((skills: Skill[]) => {
                    const newSkills = skills.slice();
                    const skillToUpdate = newSkills.find((skill) => Number(skill.skillID) === skillID);
                    if(skillToUpdate) skillToUpdate.rating = rating;
                    return newSkills;
                });
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    const navigateApplication = async (event: any) => {
        event.preventDefault();
        navigate('/application');

    }

    return (
        <Container>
            <Row>
                <Col xs={12} md={8}>
                    <br />
                    <Button variant="outline-primary" size='sm' className='float-end' onClick={navigateApplication}>Add Application</Button>{' '}
                </Col>
                <Col xs={6} md={4}></Col>
            </Row>
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