import * as React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

// declare prop & state types for Login component
type MyState = { 
    userName: string,
    password: string
};

class Login extends React.Component<{}, MyState> {
    
}

export default Login;