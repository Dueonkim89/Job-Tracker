import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Webpage #1: email form
User visits webpage: {app}.com/forgot-password
Webpage has a form to enter their email address
User fills out form and clicks submit

Form submits POST request to route #1
Route will return {success: true} if the email was validly found in the database, otherwise it will return false
Upon success, webpage will display a message instructing user to check their email inbox for a link to reset the password
Upon failure, webpage will inform user that the email does not exist in the database
 */


/**
 * Webpage #2: changing password
User clicks on the email-provided link: {app}.com/change-password/{unique_ID}
The webpage contains a form for the user to fill out their email address and new password; user fills out the form and clicks submit
The change-password webpage is the same for every version of the unique_ID; the unique_ID portion of the URL is simply a security mechanism

Form submits POST request to route #2 (see below)
The unique_ID is also included in this form submission (it can be obtained client-side from react-router or the document.location object)
Upon success, route will return {success: true} and redirect to the login page OR automatically log the user into the website (TBD)
Upon failure, route will return the reason for failure (see below)
 */