import React, { useState, setState } from "react";

// https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
export const UserLoggedInContext = React.createContext({
    loggedInStatus: false,
    setLoggedInStatus: (status) => {}
  });