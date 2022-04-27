import * as React from 'react';
import { Container, Row, Form, Button } from 'react-bootstrap';

const formPadding: string = ".75rem";
const labelFontSize: string = "1.2rem";

class AddCompany extends React.Component {
    handleSubmit(event: any) : void {
        // required data: name, industry, url
        event.preventDefault();

        // TODO: validate form

        // MAKE POST request to server

        // if successful, redirect to NewJobApplication
            // pass company name as props 
            // have company name pre-selected in select menu
        
    }

    createApplicationHeader(argument: void) : JSX.Element {
        return (
            <h2 style={{padding: "1.25rem", color: "#212529" }}>Add Company</h2>
        );
    }

    createApplicationForm() : JSX.Element {
        return (
            <Form>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="companyName" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Company</Form.Label>
                    <Form.Control id="companyName" type="text" placeholder="Enter company name" />
                </Form.Group>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="url" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Url</Form.Label>
                    <Form.Control id="url" type="text" placeholder="Enter company website" />
                </Form.Group>
                <Form.Group style={{padding: formPadding}} >
                    <Form.Label htmlFor="industry" style={{fontWeight: 'bold', fontSize: labelFontSize}}>Industry</Form.Label>
                    <Form.Control id="industry" type="text" placeholder="Enter company industry" />
                </Form.Group>
                <div style={{padding: formPadding}}>
                    <Button type="submit">Submit</Button>
                </div>
            </Form>    
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

export default AddCompany;