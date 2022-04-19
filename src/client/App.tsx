import React from "react";
import "./App.css";
import AppBar from './components/AppBar';
import Registeration from "./components/Registeration";
import { Routes, Route } from "react-router-dom"; 


function App() {
    return (
        <div className="App">
            <AppBar />
            {/*anything in this main App page shows up by default in any other page that is routed to*/}
            {setRoutes()}
        </div>
    );
}

function setRoutes() {
    // NOTE: Switch === Routes in In react-router-dom v6+
    // https://reactrouter.com/docs/en/v6/upgrading/v5
    return (
        <Routes>
            <Route path="registeration" element={<Registeration />} />
        </Routes>
    );
}

export default App;
