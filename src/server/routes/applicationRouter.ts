import express from "express";
import passport from "passport";
import * as appModel from "../models/applicationModel";
const router = express.Router();

/**
 * @description: Returns all of a user's job applications
 * @method: GET /api/applications?userID={userID}
 * @returns: HTTP 200 and all fields from Applications tables, companyName, and contacts
 * NOTE: contacts will be an array OR null if no contacts exist
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { userID } = req.query;
    try {
        if (typeof userID !== "string") {
            return res.status(400).json({ success: false, message: "Invalid User ID" });
        }
        const parsedUserID = parseInt(userID);
        if (isNaN(parsedUserID)) {
            return res.status(400).json({ success: false, message: "Invalid User ID" });
        }
        const rows = await appModel.getUserApps(parsedUserID);
        res.status(200).json(rows);
    } catch (err) {
        console.error(`Error in getting user applications:`);
        console.error({ userID });
        next(err);
    }
});

/**
 * @description: Adds a user's job application to the database
 * @method: POST /api/applications
 * @param: JSON of {companyID, jobPostingURL, position, userID, status, location, notes}
 * @returns: HTTP 201 and JSON of {success: true, applicationID}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { companyID, jobPostingURL, position, userID, status, location, notes } = req.body;
    // TODO - input validation
    const datetime = new Date();
    try {
        const applicationID = await appModel.createApp({
            companyID,
            jobPostingURL,
            position,
            userID,
            status,
            location,
            notes,
            datetime,
        });
        const response = {
            success: true,
            applicationID,
        };
        return res.status(201).json(response);
    } catch (err) {
        console.error(`Error in creating new application:`);
        console.error({ companyID, jobPostingURL, position, userID, status, location, notes, datetime });
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
    const { applicationID, firstName, lastName, emailAddress, phoneNumber, role } = req.body;
    // TODO - input validation
    try {
        const contactID = await appModel.createContact({
            applicationID,
            firstName,
            lastName,
            emailAddress,
            phoneNumber,
            role,
        });
        const response = {
            success: true,
            contactID,
        };
        return res.status(201).json(response);
    } catch (err) {
        console.error(`Error in creating new application contact:`);
        console.error({ applicationID, firstName, lastName, emailAddress, phoneNumber, role });
        next(err);
    }
});

router.delete("/contact", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { contactID } = req.query;
    // TODO - input validation
    try {
        if (typeof contactID !== "string") {
            return res.status(400).json({ success: false, message: "Invalid Contact ID" });
        }
        const parsedcontactID = parseInt(contactID);
        await appModel.deleteContact(parsedcontactID);
        return res.status(200).json({ success: true, contactID });
    } catch (err) {
        console.error(`Error in deleting application contact:`);
        console.error({ contactID });
        next(err);
    }
});

/**
 * @description: Updates the status of a user's job application
 * @method: POST /api/applications/status
 * @param: JSON of {applicationID, status}
 * @returns: HTTP 201 and JSON of {success: true, applicationID, status}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/status", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { applicationID, status } = req.body;
    // TODO - input validation
    try {
        if (typeof applicationID !== "number") {
            return res.status(400).json({ success: false, message: "Application ID is not a number" });
        }
        const didUpdate = await appModel.updateAppStatus(applicationID, status);
        if (didUpdate) {
            return res.status(201).json({ success: true, applicationID, status });
        } else {
            return res.status(400).json({ success: false, message: "Invalid Application ID." });
        }
    } catch (err) {
        console.error(`Error in updating application status:`);
        console.error({ applicationID, status });
        next(err);
    }
});

export default router;
