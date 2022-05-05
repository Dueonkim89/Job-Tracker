import React, { useState, useMemo }  from "react";
import "./App.css";
import AppBar from './components/AppBar';
import Registration from "./components/Registration";
import Login from "./components/Login";
import Dashboard from "./components/MainDashboard";
import NewJobApplication from "./components/NewJobApplication";
import AddCompany from "./components/AddCompany";
import AppliedCompany from "./components/AppliedCompany";
import { Routes, Route } from "react-router-dom"; 
import {UserLoggedInContext} from "./context/UserLoggedInStatus";
import {checkIfTokenExists} from "./utils/helper.js"


function App() {
    // use hooks to implement context
    const [loggedInStatus, setLoggedInStatus] = useState( checkIfTokenExists() );
    const value = useMemo(() => ({loggedInStatus, setLoggedInStatus}), [loggedInStatus, setLoggedInStatus]);
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
            <Route path="main" element={<Dashboard />} />
            <Route path="registration" element={<Registration />} />
            <Route path="application" element={<NewJobApplication />} />
            <Route path="add_company" element={<AddCompany />} />
            <Route path="applied_company/:company_name" element={<AppliedCompany />} />
        </Routes>
    );
}

export default App;
