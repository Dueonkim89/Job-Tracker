import express from "express";
import * as appModel from "../models/applicationModel";
const router = express.Router();

/**
 * @description: Returns all of a user's job applications
 * @method: GET /api/applications?userID={userID}
 * @returns: HTTP 200 and all fields from Applications tables
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/", async function (req, res, next) {
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
 * @param: JSON of {companyID, jobPostingURL, position, userID, status, location}
 * @returns: HTTP 201 and JSON of {success: true, applicationID, userID, jobID, status, location, datetime}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/", async function (req, res, next) {
    const { companyID, jobPostingURL, position, userID, status, location } = req.body;
    const datetime = new Date();
    try {
        const applicationID = await appModel.createApp({
            companyID,
            jobPostingURL,
            position,
            userID,
            status,
            location,
            datetime,
        });
        const response = {
            success: true,
            applicationID,
            companyID,
            jobPostingURL,
            position,
            userID,
            status,
            location,
            datetime,
        };
        return res.status(201).json(response);
    } catch (err) {
        console.error(`Error in creating new application:`);
        console.error({ companyID, jobPostingURL, position, userID, status, location, datetime });
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
router.post("/status", async function (req, res, next) {
    const { applicationID, status } = req.body;
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
