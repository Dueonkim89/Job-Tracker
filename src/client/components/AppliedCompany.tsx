import * as React from 'react';
import { Container, Row, Table, Button } from 'react-bootstrap';

const formPadding: string = ".75rem";
const labelFontSize: string = "1.2rem";

//  pass in props of: company name, applications for company
//  other available positions, comments for company

class AppliedCompany extends React.Component {
    createPageHeader(argument: void) : JSX.Element {
        // get title from props
        return (
            <h2 style={{padding: "1.25rem", color: "#212529" }}>Google</h2>
        );
    }

    showApplications(argument: void) : JSX.Element {
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

    showComments(argument: void) : JSX.Element {
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
                    <th>Text</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>1</td>
                    <td>User1</td>
                    <td>Great interview experience.</td>
                    <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod....</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>User2</td>
                    <td>Horrible interview experience.</td>
                    <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod....</td>
                    </tr>
                </tbody>
            </Table>
        );
    }

    render() {
        const ApplicationFormBorder: string = "3px solid #0a2a66";
        return (
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
        );
    }
}

export default AppliedCompany;