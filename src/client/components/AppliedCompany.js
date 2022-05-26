import * as React from 'react';
import { Container, Row, Table, Button } from 'react-bootstrap';
import {getCompanyNameFromURL, getUserApplications, formatDate, getCommentsForCompany, getSkillsForApplication} from '../utils/helper';
import {UserLoggedInContext} from "../context/UserLoggedInStatus";
import { Navigate, Link } from "react-router-dom"

const formPadding = ".75rem";
const labelFontSize = "1.2rem";

//  pass in props of: company name, applications for company
//  other available positions, comments for company

class AppliedCompany extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           applications: [],
           companyComments: [],
           companyName: "",
           companyID: null,
           jobSkills: {}
        };
    }

    // cache app state as class property
    globalLoggedInState = undefined;

    componentDidMount() {
        // make call to server and get all applications and comments only if user is logged in
        if (this.globalLoggedInState) {
            const companyName = getCompanyNameFromURL(window.location.href);
            this.setState({companyName});

            // call async method. since life cycle cant be async.
            this.getApplicationsAndComments(companyName);
        }
    }

    async getApplicationsAndComments(companyName) {
        try {
            const userApplications = await getUserApplications(companyName);
            let companyID = null;
            let companyComments = [];
            let jobSkills = {};
        
            // get companyID, comment, and job skills if user has applications
            if (userApplications.length > 0) {

                // for each app, get the skills required for it
                for (const app of userApplications) {
                    const appSkills = await getSkillsForApplication(app.applicationID);
                    jobSkills[app.applicationID] = appSkills;
                }

                companyID = userApplications[0].companyID;
                companyComments = await getCommentsForCompany(companyID);
            }
 
            this.setState({applications: userApplications, companyID, companyComments, jobSkills});
        }
        catch (error) {
            // console.log(error);
            alert("Server error. Please try again later.");
        }
    }

    createPageHeader() {
        return (
            <h2 style={{padding: "1.25rem", color: "#212529" }}>{this.state.companyName}</h2>
        );
    }

    generateAppTableBody() {
        // get from state: applications
        return this.state.applications.map((app, idx) => {
            return (
                <tr key={app.applicationID}>
                    <td>{idx + 1}</td>
                    <td>{app.status}</td>
                    <td>{app.position}</td>
                    <td>{app.location}</td>
                    <td>{this.state.jobSkills[app.applicationID].join(', ')}</td>
                    <td>{formatDate(app.datetime)}</td>
                    <td>{app.notes}</td>
                </tr>
            );
        });
    }

    showApplications() {
        // argument: array of maps
        // props of user applications from server
        // create tbody dynamically from props.
        return (
            <Table bordered>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Required Skills</th>
                    <th>Date</th>
                    <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {this.generateAppTableBody()}
                </tbody>
            </Table>
        );
    }

    generateCommentTableBody() {
        // get from state: companyComments
        return this.state.companyComments.map((comment, idx) => {
            return (
                <tr key={comment.commentID}>
                    <td>{idx + 1}</td>
                    <td>{comment.title}</td>
                    <td>{comment.text}</td>
                </tr>
            );
        });
    }

    showComments() {
        // create tbody dynamically from state
        return (
            <Table bordered>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Text</th>
                    </tr>
                </thead>
                <tbody>
                    {this.generateCommentTableBody()}
                </tbody>
            </Table>
        );
    }

    render() {
        //console.log(this.state);
        const ApplicationFormBorder = "3px solid #0a2a66";
        return (
            <UserLoggedInContext.Consumer>
                {({loggedInStatus}) => (
                <div>
                    { !loggedInStatus && <Navigate to="/main" replace={true} /> }
                    {this.globalLoggedInState = loggedInStatus}
                    <Container fluid style={{ marginTop: "2.75rem", width: '65vw', border: ApplicationFormBorder}}>
                        <Row style={{borderBottom: ApplicationFormBorder, backgroundColor: "#c0c6cc"}}>
                            {this.createPageHeader()}
                        </Row>
                        <Row style={{backgroundColor: "#c0c6cc", textAlign: "left"}}>
                            <h3 style={{fontSize: "1.2rem", marginTop: "1.25rem", marginBottom: "1.25rem" }}>Your Applications</h3>
                            {this.showApplications()}
                        </Row>
                        <Row style={{backgroundColor: "#c0c6cc", textAlign: "left"}}>
                            <h3 style={{fontSize: "1.2rem", marginTop: "1.25rem", marginBottom: "1.25rem" }}>Comments</h3>
                            {this.showComments()}
                        </Row>
                        <Row style={{backgroundColor: "#c0c6cc", textAlign: "left"}}>
                            <div style={{fontSize: "1.2rem", marginTop: "1.25rem", marginBottom: "1.25rem" }}>
                            <Link to="/add_comment" state={{ companyName: this.state.companyName, companyID: this.state.companyID }}>
                                <Button variant="primary">Add comment</Button>
                            </Link>
                            </div>                    
                        </Row>
                    </Container>
                </div>
                )}
            </UserLoggedInContext.Consumer>
        );
    }
}

export default AppliedCompany;