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
 */
router.get("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const requestorID = req.user?.userID as number;
    try {
        const userID = validateAndParseStringID(req.query.userID);
        validateAuthorization(requestorID, userID);
        const rows = await appModel.getUserApps(userID);
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
 * @description: Deletes a user's job application
 * @method: PATCH /api/applications?applicationID={applicationID}
 * @returns: HTTP 201 and JSON of {success: true, applicationID}
 */
router.delete("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const requestorID = req.user?.userID as number;
    try {
        const applicationID = validateAndParseStringID(req.query.applicationID);
        const { userID } = await appModel.getAppByID(applicationID);
        validateAuthorization(requestorID, userID);
        await appModel.deleteApp(applicationID);
        return res.status(201).json({ success: true, applicationID });
    } catch (err: any) {
        err.sourceMessage = `Error in deleting application`;
        next(err);
    }
});

/**
 * @description: Updates a user's job application with certain fields
 * @method: PATCH /api/applications
 * @param: JSON of {applicationID, companyID, jobPostingURL, position, userID, status, location, notes}
 *   NOTE: applicationID is mandatory, all other fields are optional
 * @returns: HTTP 201 and JSON of {success: true, applicationID}
 */
router.patch("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
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
 */
router.patch("/contact", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
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
 * @description: Get an application contact
 * @method: GET /api/applications/contact?contactID={contactID}
 * @returns: HTTP 200 and JSON of all fields from contact table
 */
router.get("/contact", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const requestorID = req.user?.userID as number;
    try {
        const contactID = validateAndParseStringID(req.query.contactID);
        const { userID } = await appModel.getContactAndAppByID(contactID);
        validateAuthorization(requestorID, userID);
        const result = await appModel.getContactByID(contactID);
        return res.status(200).json(result);
    } catch (err: any) {
        err.sourceMessage = `Error in getting application contact`;
        next(err);
    }
});

export default router;
