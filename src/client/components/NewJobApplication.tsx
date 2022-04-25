import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Row, Form, Button, Col } from 'react-bootstrap';

const formPadding: string = ".75rem";
const labelFontSize: string = "1.2rem";

class NewJobApplication extends React.Component {
    createApplicationHeader(argument: void) : JSX.Element {
        return (
            <h2 style={{padding: "1.25rem", color: "#212529" }}>Add a New Application</h2>
        );
    }

    createApplicationForm() : JSX.Element {
        return (
            <Form>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="companyName" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Company</Form.Label>
                    {this.createCompanyDropDrownMenu()}
                    {this.addCompanyNavigation()}
                </Form.Group>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="title" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Title</Form.Label>
                    <Form.Control id="title" type="text" placeholder="Enter title" />
                </Form.Group>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="location" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Location</Form.Label>
                    <Form.Control id="location" type="text" placeholder="Enter location" />
                </Form.Group>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="url" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Url</Form.Label>
                    <Form.Control id="url" type="text" placeholder="Enter url" />
                </Form.Group>
                {this.generateApplicationSkills()}
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

    addCompanyNavigation(argument: void) : JSX.Element {
        return (
            <LinkContainer to="/add_company">
                {/*NOTE: If no / provided to the path, routes to /application/add_company by default */}
                <a>Don't see the company? Click here to add.</a>
            </LinkContainer>
        );
    }

    createStatusDropDrownMenu(argument: void) : JSX.Element {
        return (
            <Form.Select aria-label="Choose application status from dropdown menu" id="status">
                <option>Pick application status</option>
                <option value="applied">Applied</option>
                <option value="online_assessment">Online Assessment</option>
                <option value="phone_interview">Phone Interview</option>
                <option value="technical_interview">Technical Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
            </Form.Select>
        );
    }
    
 
    createCompanyDropDrownMenu(argument: void) : JSX.Element {
        //  To get company names dynamically from server
        return (
            <Form.Select style={{marginBottom: ".65rem"}} aria-label="Choose company from dropdown menu" id="companyName">
                <option>Pick company name</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </Form.Select>
        );
    }

    generateApplicationSkills(argument: void) : JSX.Element {
        // https://stackoverflow.com/questions/45167565/does-react-js-support-html5-datalist
        return (
            <Row style={{padding: formPadding}}>
                <Form.Group as={Col}>
                    <Form.Label htmlFor="jobSkills" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Job skills</Form.Label>
                    <Form.Control list="skills" id="jobSkills" type="text" placeholder="Enter job skills" name="jobSkills"/>
                    {this.getSkills()}
                </Form.Group>
                <Form.Group as={Col} style={{position: "relative", marginLeft: "2.5rem"}}>      
                        {/*Position the button at bottomn left corner of parent*/}
                    <Button style={{position: "absolute", bottom: "0px", "left": "0px"}} variant="primary">Add skill</Button>
                </Form.Group>
            </Row>
        );
    }

    getSkills() : JSX.Element {
        // will make GET request to server to get skills and render dynamically.
        return (
            <datalist id="skills">
                <option value="C++"></option>
                <option value="Java"></option>
                <option value="Python"></option>
            </datalist>
        );
    }

    render() {
        const ApplicationFormBorder: string = "3px solid #0a2a66";
        return (
            <Container fluid style={{ marginTop: "2.75rem", width: '65vw', border: ApplicationFormBorder}}>
                <Row style={{borderBottom: ApplicationFormBorder, backgroundColor: "#c0c6cc"}}>
                    {this.createApplicationHeader()}
                </Row>
                <Row style={{backgroundColor: "#c0c6cc", textAlign: "left"}}>
                    {this.createApplicationForm()}
                </Row>
            </Container>
        );
    }
}

export default NewJobApplication;