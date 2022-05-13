import * as React from 'react';
import { Container, Row, Form, Button, Col } from 'react-bootstrap';
import {getListOfAllCompanies, getUserToken, getAllSkills} from '../utils/helper';
import {validStringData} from '../utils/formValidation';
import {UserLoggedInContext} from "../context/UserLoggedInStatus";
import { Navigate, useNavigate, Link,  useLocation } from "react-router-dom"

const formPadding = ".75rem";
const labelFontSize = "1.2rem";

class NewJobApplication extends React.Component {
    constructor(props) {
        // CAN get PROPS from constructor
        super(props);
        this.state = {
           companyList: [],
           skillListFromServer: [],
           applicationSkillList: [],
           companyName: "",
           title: "",
           location: "",
           url: "",
           skill: "",
           status: ""
        };

        // this.enterFirstName = this.enterFirstName.bind(this);enterLocationaa
        this.pickCompany = this.pickCompany.bind(this);
        this.enterTitle = this.enterTitle.bind(this);
        this.enterLocation = this.enterLocation.bind(this);
        this.enterURL = this.enterURL.bind(this);
        this.enterSkill = this.enterSkill.bind(this);
        this.pickAppStatus = this.pickAppStatus.bind(this);
        this.addSkillToRequiredList = this.addSkillToRequiredList.bind(this);
    }

    globalLoggedInState = undefined;

    createApplicationHeader() {
        return (
            <h2 style={{padding: "1.25rem", color: "#212529" }}>Add a New Application</h2>
        );
    }

    pickCompany(event) {
        this.setState({companyName: event.target.value});
    }

    enterTitle(event)  {
        this.setState({title: event.target.value});
    }

    enterLocation(event) {
        this.setState({location: event.target.value});
    }

    enterURL(event) {
        this.setState({url: event.target.value});
    }

    enterSkill(event) {
        this.setState({skill: event.target.value});
    }

    pickAppStatus(event) {
        this.setState({status: event.target.value});
    }

    addSkillToRequiredList() {
        // update state of applicationSkillList
        // reset state of skill to empty string
        const {skill} = this.state;
        if (validStringData(skill)) {
            this.setState(prevState => ({
                applicationSkillList: [...prevState.applicationSkillList, skill]
            }));
            this.setState({skill: ""});
        }
    }

    componentDidMount() {
        // make call to server and get all company list and skills only if user logged in
        // set company value to props if passed in
        if (this.globalLoggedInState) {
            const token = getUserToken();
            getListOfAllCompanies(token).then(
                (result) => { 
                    this.setState({companyList: result});
                    // get company name if props are provided and set drop down value to props
                    if (this.props.companies.state) {
                        this.setState({companyName: this.props.companies.state});
                    }
                },
                (error) => { 
                   return;
                }
            );

            getAllSkills().then(
                (result) => {
                    this.setState({skillListFromServer: result});
                }
            ).catch((error) => {
                return;
                }
            );
        }
    }

    createApplicationForm() {
        return (
            <Form>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="companyName" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Company</Form.Label>
                    {this.createCompanyDropDrownMenu()}
                    {this.addCompanyNavigation()}
                </Form.Group>
                <Row style={{padding: formPadding}}>
                    <Form.Group as={Col}>
                        <Form.Label htmlFor="url" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Url</Form.Label>
                        <Form.Control id="url" type="text" value={this.state.url} onChange={this.enterURL} placeholder="Enter url" />
                    </Form.Group>
                    <Form.Group as={Col} style={{position: "relative", marginLeft: "2.5rem"}}>      
                        {/*Position the button at bottomn left corner of parent*/}
                        <Button style={{position: "absolute", bottom: "0px", "left": "0px"}} variant="primary">Scrape data from url</Button>
                    </Form.Group>
                </Row>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="title" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Title</Form.Label>
                    <Form.Control id="title" type="text" value={this.state.title} onChange={this.enterTitle} placeholder="Enter title" />
                </Form.Group>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="location" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Location</Form.Label>
                    <Form.Control id="location" type="text" value={this.state.location} onChange={this.enterLocation} placeholder="Enter location" />
                </Form.Group>
                {this.generateApplicationSkills()}
                {this.displayCurrentJobRequiredSkills()}
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="status" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Application status</Form.Label>
                    {this.createStatusDropDrownMenu()}
                </Form.Group>
                <div style={{padding: formPadding}}>
                    <Button type="submit">Submit</Button>
                </div>
            </Form>    
        );
    }

    addCompanyNavigation() {
        return (   
            <Link to="/add_company" state={{companies: this.state.companyList}}>
                {/*NOTE: If no / provided to the path, routes to /application/add_company by default */}
                <p style={{marginBottom: "0rem"}}>Don't see the company? Click here to add.</p>
            </Link>
        );
    }

    createStatusDropDrownMenu() {
        return (
            <Form.Select value={this.state.status} onChange={this.pickAppStatus} aria-label="Choose application status from dropdown menu" id="status">
                <option value="">Pick application status</option>
                <option value="applied">Applied</option>
                <option value="online_assessment">Online Assessment</option>
                <option value="phone_interview">Phone Interview</option>
                <option value="technical_interview">Technical Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
            </Form.Select>
        );
    }
    
    createCompanyDropDrownMenu() {
        //  To get company names dynamically from server
        return (
            <Form.Select style={{marginBottom: ".65rem"}} value={this.state.companyName} onChange={this.pickCompany} aria-label="Choose company from dropdown menu" id="companyName">
                <option value="">Pick company name</option>
                {this.dynamicallyCreateCompanyList()}
            </Form.Select>
        );
    }

    dynamicallyCreateCompanyList() {
        const {companyList} = this.state;
        return (
            companyList.map((company) => 
             <option key={company.companyID} value={company.name}>{company.name}</option>
        ));
    }

    generateApplicationSkills() {
        // https://stackoverflow.com/questions/45167565/does-react-js-support-html5-datalist
        return (
            <Row style={{padding: formPadding}}>
                <Form.Group as={Col}>
                    <Form.Label htmlFor="jobSkills" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Job skills</Form.Label>
                    <Form.Control list="skills" id="jobSkills" type="text" placeholder="Enter job skills" name="jobSkills" value={this.state.skill} onChange={this.enterSkill} />
                    <datalist id="skills">
                        {this.getSkills()}
                    </datalist>
                </Form.Group>
                <Form.Group as={Col} style={{position: "relative", marginLeft: "2.5rem"}}>      
                        {/*Position the button at bottomn left corner of parent*/}
                    <Button style={{position: "absolute", bottom: "0px", "left": "0px"}} onClick={this.addSkillToRequiredList} variant="primary">Add skill</Button>
                </Form.Group>
            </Row>
        );
    }

    displayCurrentJobRequiredSkills() {
        // display current required skills as string
        if (this.state.applicationSkillList.length > 0) {
            return (
                <p style={{paddingLeft: formPadding, marginBottom: "0rem"}}>{this.state.applicationSkillList.join(', ')}</p>
            );
        }
    }

    getSkills() {
        // render dynamically from state
        const {skillListFromServer} = this.state;
        return (
            skillListFromServer.map((skill) => 
             <option key={skill.skillID} value={skill.name}>{skill.name}</option>
        ));
    }

    render() {
        console.log(this.state.applicationSkillList);
        // redirect to login if user is not logged in
        const ApplicationFormBorder = "3px solid #0a2a66";
        return (
            <UserLoggedInContext.Consumer>
                {({loggedInStatus}) => (
                <div>
                    { !loggedInStatus && <Navigate to="/main" replace={true} /> }
                    {this.globalLoggedInState = loggedInStatus}
                    <Container fluid style={{ marginTop: "2.75rem", width: '65vw', border: ApplicationFormBorder}}>
                        <Row style={{borderBottom: ApplicationFormBorder, backgroundColor: "#c0c6cc"}}>
                            {this.createApplicationHeader()}
                        </Row>
                        <Row style={{backgroundColor: "#c0c6cc", textAlign: "left"}}>
                            {this.createApplicationForm()}
                        </Row>
                    </Container>
                </div>    
                )}
            </UserLoggedInContext.Consumer>
        );
    }
}

function AddApplicationWithNavigation(props) {
    let navigate = useNavigate();
    const {loggedInStatus} = React.useContext(UserLoggedInContext);

    // not logged in, send user to login page
    if (!loggedInStatus) {
        navigate('/login');
    } 
    const location = useLocation();
    return <NewJobApplication {...props} navigate={navigate} companies={location}/>
}

export default AddApplicationWithNavigation;
