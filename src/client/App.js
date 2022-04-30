import React, { useState }  from "react";
import "./App.css";
import AppBar from './components/AppBar';
import Registration from "./components/Registration";
import Login from "./components/Login";
import NewJobApplication from "./components/NewJobApplication";
import AddCompany from "./components/AddCompany";
import AppliedCompany from "./components/AppliedCompany";
import { Routes, Route } from "react-router-dom"; 
import Protected from "./components/Protected";
import {UserLoggedInContext} from "./context/UserLoggedInStatus";


function App() {
    // use hooks to implement context
    const [loggedInStatus, setLoggedInStatus] = useState(false);
    const value = {loggedInStatus, setLoggedInStatus};
    // console.log("i am in app.js", loggedInStatus, value)
    return (
        <UserLoggedInContext.Provider value={value}>
            <div className="App">
                <AppBar />
                {/*anything in this main App page shows up by default in any other page that is routed to*/}
                {setRoutes()}
            </div>
        </UserLoggedInContext.Provider>
    );
}

function setRoutes() {
    // NOTE: Switch === Routes in In react-router-dom v6+
    // https://reactrouter.com/docs/en/v6/upgrading/v5
    return (
        <Routes>
            <Route path="" element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="registration" element={<Registration />} />
            <Route path="application" element={<NewJobApplication />} />
            <Route path="add_company" element={<AddCompany />} />
            <Route path="applied_company/:company_name" element={<AppliedCompany />} />
            <Route path="protected" element={<Protected />} />
        </Routes>
    );
}

export default App;
