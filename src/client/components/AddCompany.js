import * as React from 'react';
import { Container, Row, Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import {validStringData} from '../utils/formValidation';
import {companyNameAlreadyRecorded, checkIfCompanyAlreadyExists, createCompany} from '../utils/helper';
import {UserLoggedInContext} from "../context/UserLoggedInStatus";

const formPadding = ".75rem";
const labelFontSize = "1.2rem";

class AddCompany extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyName: '',
            companyURL: '',
            companyIndustry: '',
            companyNameValid: true,
            companyIndustryValid: true,
            companyURLValid: true,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.enterCompanyName = this.enterCompanyName.bind(this);
        this.enterCompanyURL = this.enterCompanyURL.bind(this);
        this.enterCompanyIndustry = this.enterCompanyIndustry.bind(this);
    }

    globalLoggedInState = undefined;

    enterCompanyName(event)  {
        this.setState({companyName: event.target.value});
    }

    enterCompanyURL(event) {
        this.setState({companyURL: event.target.value});
    }

    enterCompanyIndustry(event) {
        this.setState({companyIndustry: event.target.value});
    }

    isCompanyNameAStringType() {
        // check if company name is a string
    }

    handleSubmit(event) {
        event.preventDefault();

        const {companyName, companyURL, companyIndustry} = this.state;
        console.log(this.props);

        // Validate form for name, industry, url
        this.setState({
            companyNameValid: validStringData(companyName.trim()),
            companyURLValid: validStringData(companyURL.trim()),
            companyIndustryValid: validStringData(companyIndustry.trim())
        });

        // only make POST request when all the form field is valid
        if (validStringData(companyName.trim()) 
            && validStringData(companyURL.trim()) 
            && validStringData(companyIndustry.trim())) {

            // https://stackoverflow.com/questions/64566405/react-router-dom-v6-usenavigate-passing-value-to-another-component
            
            createCompany({name: companyName.trim(), industry: companyIndustry.trim(),  websiteURL: companyURL.trim()});
            return;

            // user entered URL and did not click
            if (!this.props.companies.state) {
                // check if company name already exists
                checkIfCompanyAlreadyExists(companyName.trim().toLowerCase()).then(
                    (result) => { 
                       console.log("success", result);
                    },
                    (error) => { 
                       console.log("error", error);
                    }
                );
            
            }
            // user did click the link
            else {
                 // company name already in list, navigate back to application page
                if (companyNameAlreadyRecorded(this.props.companies.state.companies, companyName.trim())) {
                    // navigate user back to app page with company name as props

                // ELSE, MAKE POST request to server
                } else {
                     //redirect to NewJobApplication
                }
            }


        }

            


        
        

       
   
          
    }

    createApplicationHeader() {
        return (
            <h2 style={{padding: "1.25rem", color: "#212529" }}>Add Company</h2>
        );
    }

    createApplicationForm() {
        const invalidStyle = '3px solid red';
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="companyName" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Company</Form.Label>
                    <Form.Control style={{ border: !this.state.companyNameValid ? invalidStyle: ''}} id="companyName" type="text" value={this.state.companyName} onChange={this.enterCompanyName} placeholder="Enter company name" />
                </Form.Group>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="url" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Url</Form.Label>
                    <Form.Control style={{ border: !this.state.companyURLValid ? invalidStyle: ''}} id="url" type="text" value={this.state.companyURL} onChange={this.enterCompanyURL} placeholder="Enter company website" />
                </Form.Group>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="industry" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Industry</Form.Label>
                    <Form.Control style={{ border: !this.state.companyIndustryValid ? invalidStyle: ''}} id="industry" type="text" value={this.state.companyIndustry} onChange={this.enterCompanyIndustry} placeholder="Enter company industry" />
                </Form.Group>
                <div style={{padding: formPadding}}>
                    <Button type="submit">Submit</Button>
                </div>
            </Form>    
        );
    }

    render() {
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

function AddCompanyWithNavigation(props) {
    let navigate = useNavigate();
    const {loggedInStatus} = React.useContext(UserLoggedInContext);

    // not logged in, send user to login page
    if (!loggedInStatus) {
        navigate('/login');
    } 
    const location = useLocation();
    return <AddCompany {...props} navigate={navigate} companies={location}/>
}

export default AddCompanyWithNavigation;