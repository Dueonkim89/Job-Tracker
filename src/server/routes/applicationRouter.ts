import express from "express";
import passport from "passport";
import appModel from "../models/applicationModel";
import { Application, Contact } from "../types/application";
import { validateAuthorization, validateAndParseStringID } from "../types/validators";
const router = express.Router();

/**
 * @description: Returns all of a user's job applications
 * @method: GET /api/applications?userID={userID}
 * @returns: HTTP 200 and all fields from Applications tables, companyName, and contacts
 * NOTE: contacts will be an array OR null if no contacts exist
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const requestorID = req.user?.userID as number;
    const { userID } = req.query;
    try {
        const parsedUserID = validateAndParseStringID(userID);
        validateAuthorization(requestorID, parsedUserID);
        const rows = await appModel.getUserApps(parsedUserID);
        res.status(200).json(rows);
    } catch (err: any) {
        err.sourceMessage = `Error in getting user applications`;
        next(err);
    }
});

/**
 * @description: Adds a user's job application to the database
 * @method: POST /api/applications
 * @param: JSON of {companyID, jobPostingURL, position, userID, status, location, notes}
 * @returns: HTTP 201 and JSON of {success: true, applicationID, datetime}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const app: Application = new Application(req.body);
    try {
        app.validateAndAssertContains(["companyID", "userID", "position", "jobPostingURL", "status", "datetime"]);
        const applicationID = await appModel.createApp(app.fields);
        const response = { success: true, applicationID, datetime: app.fields.datetime };
        return res.status(201).json(response);
    } catch (err: any) {
        err.sourceMessage = `Error in creating new application`;
        next(err);
    }
});

/**
 * @description: Updates a user's job application
 * @method: PUT /api/applications
 * @param: JSON of {applicationID, companyID, jobPostingURL, position, userID, status, location, notes}
 *   NOTE: applicationID is mandatory, all other fields are optional
 * @returns: HTTP 201 and JSON of {success: true, applicationID}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.put("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const requestorID = req.user?.userID as number;
    const app: Application = new Application(req.body);
    try {
        app.validateAndAssertContains(["applicationID"]);
        const { userID } = await appModel.getAppByID(app.fields.applicationID);
        validateAuthorization(requestorID, userID);
        await appModel.updateApp(app.fields);
        return res.status(201).json({ success: true, applicationID: app.fields.applicationID });
    } catch (err: any) {
        err.sourceMessage = `Error in updating application`;
        next(err);
    }
});

/**
 * @description: Adds a contact to a user's job application
 * @method: POST /api/applications/contact
 * @param: JSON of {applicationID, firstName, lastName, emailAddress, phoneNumber, role}
 * @returns: HTTP 201 and JSON of {success: true, contactID}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/contact", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const requestorID = req.user?.userID as number;
    const contact: Contact = new Contact(req.body);
    try {
        contact.validateAndAssertContains(["applicationID", "firstName", "lastName"]);
        const { userID } = await appModel.getAppByID(contact.fields.applicationID);
        validateAuthorization(requestorID, userID);
        const contactID = await appModel.createContact(contact.fields);
        return res.status(201).json({ success: true, contactID });
    } catch (err: any) {
        err.sourceMessage = `Error in creating new application contact`;
        next(err);
    }
});

/**
 * @description: Update an application contact
 * @method: PUT /api/applications/contact
 * @param: JSON of {contactID, applicationID, firstName, lastName, emailAddress, phoneNumber, role}
 *   NOTE: contactID is mandatory, all other fields are optional
 * @returns: HTTP 200 and JSON of {success: true, contactID}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.put("/contact", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const requestorID = req.user?.userID as number;
    const contact: Contact = new Contact(req.body);
    try {
        contact.validateAndAssertContains(["contactID"]);
        const { userID } = await appModel.getContactAndAppByID(contact.fields.contactID);
        validateAuthorization(requestorID, userID);
        await appModel.updateContact(contact.fields);
        return res.status(201).json({ success: true, contactID: contact.fields.contactID });
    } catch (err: any) {
        err.sourceMessage = `Error in updating application contact:`;
        next(err);
    }
});

/**
 * @description: Delete an application contact
 * @method: DELETE /api/applications/contact?contactID={contactID}
 * @returns: HTTP 200 and JSON of {success: true, contactID}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.delete("/contact", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const requestorID = req.user?.userID as number;
    const { contactID } = req.query;
    try {
        const parsedcontactID = validateAndParseStringID(contactID);
        const { userID } = await appModel.getContactAndAppByID(parsedcontactID);
        validateAuthorization(requestorID, userID);
        await appModel.deleteContact(parsedcontactID);
        return res.status(200).json({ success: true, contactID });
    } catch (err: any) {
        err.sourceMessage = `Error in deleting application contact`;
        next(err);
    }
});

/**
 * @description: Delete an application contact
 * @method: GET /api/applications/contact?contactID={contactID}
 * @returns: HTTP 200 and JSON of all fields from contact table
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/contact", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const requestorID = req.user?.userID as number;
    const { contactID } = req.query;
    try {
        const parsedcontactID = validateAndParseStringID(contactID);
        const { userID } = await appModel.getContactAndAppByID(parsedcontactID);
        validateAuthorization(requestorID, userID);
        const result = await appModel.getContactByID(parsedcontactID);
        return res.status(200).json(result);
    } catch (err: any) {
        err.sourceMessage = `Error in getting application contact`;
        next(err);
    }
});

export default router;
