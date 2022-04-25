import express from "express";
import * as appModel from "../models/applicationModel";
const router = express.Router();

/**
 * @description: Returns all of a user's job applications
 * @method: GET /api/applications?userID={userID}
 * @returns: all fields from the Jobs & Applications tables
 */
router.get("/", async function (req, res, next) {
    try {
        const { userID } = req.query;
        if (typeof userID !== "string") {
            return res.status(400).send("Invalid User ID");
        }
        const parsedUserID = parseInt(userID);
        if (isNaN(parsedUserID)) {
            return res.status(400).send("Invalid User ID");
        }
        const rows = await appModel.getUserApps(parsedUserID);
        res.status(200).send(rows);
    } catch (err) {
        console.error(`Error in getting user applications: ${err}`);
        next(err);
    }
});

/**
 * @description: Adds a user's job application to the database
 * @method: POST /api/applications
 * @param: JSON of {userID, jobID, status, location}
 * @returns: HTTP 201 and JSON object of {success: true, applicationID, userID, jobID, status, location, datetime}
 */
router.post("/", async function (req, res, next) {
    try {
        const { userID, jobID, status, location } = req.body;
        const datetime = new Date();
        const applicationID = await appModel.createApp({ userID, jobID, status, location, datetime });
        const response = { success: true, applicationID, userID, jobID, status, location, datetime };
        return res.status(200).json(response);
    } catch (err) {
        console.error(`Error in creating new application: ${err}`);
        next(err);
    }
});

// Add update status endpoint

export default router;
