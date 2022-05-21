import * as React from 'react';
import { Container, Row, Table, Button } from 'react-bootstrap';
import {getCompanyNameFromURL, getUserApplications, formatDate} from '../utils/helper';
import {UserLoggedInContext} from "../context/UserLoggedInStatus";
import { Navigate } from "react-router-dom"

const formPadding = ".75rem";
const labelFontSize = "1.2rem";

//  pass in props of: company name, applications for company
//  other available positions, comments for company

class AppliedCompany extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           applications: [],
           comments: [],
           companyName: "",
           companyID: null
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
            if (userApplications.length > 0) {
                companyID = userApplications[0].companyID;
            }
            this.setState({applications: userApplications, companyID});
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
                    <th>Date</th>
                    <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>1</td>
                    <td>Phone Interview</td>
                    <td>Software Engineer</td>
                    <td>Seattle, Washginton, USA</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>Technical Interview</td>
                    <td>Android Engineer</td>
                    <td>Dallas, Texas, USA</td>
                    </tr>
                </tbody>
            </Table>
        );
    }

    showComments() {
        // argument: array of maps
        // props of comments for company from server
        // need username, title, text
        // create tbody dynamically from props
        // enable routing to comment page
        // hyperlink will be the text
        return (
            <Table bordered>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Text</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>1</td>
                    <td>User1</td>
                    <td>Great interview experience.</td>
                    <td>1/1/22</td>
                    <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod....</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>User2</td>
                    <td>Horrible interview experience.</td>
                    <td>3/1/22</td>
                    <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod....</td>
                    </tr>
                </tbody>
            </Table>
        );
    }

    render() {
        console.log(this.state.applications, this.state.companyID);
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
                                <Button variant="primary">Add comment</Button>
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