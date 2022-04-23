import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Row, Form, Nav } from 'react-bootstrap';

class NewJobApplication extends React.Component {

    createApplicationHeader(argument: void) : JSX.Element {
        return (
            <h2 style={{padding: "1.25rem", color: "#212529" }}>Add a New Application</h2>
        );
    }

    createApplicationForm() : JSX.Element {
        const formPadding: string = "1rem";
        const labelFontSize: string = "1.1rem";
        return (
            <Form>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="companyName" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Company</Form.Label>
                    {this.createCompanyDropDrownMenu()}
                    {this.addCompanyNavigation()}
                </Form.Group>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="title" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Title</Form.Label>
                </Form.Group>
            </Form>    
        );
    }

    addCompanyNavigation(argument: void) : JSX.Element {
        return (
            <LinkContainer to="/registration">
                {/*NOTE: If no / provided to the path, routes to /application/company by default */}
                <a>Don't see your company? Click here to add.</a>
            </LinkContainer>
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

    render() {
        const ApplicationFormBorder: string = "3px solid #0a2a66";
        return (
            <Container fluid style={{ marginTop: "1.75rem", width: '60vw', border: ApplicationFormBorder}}>
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