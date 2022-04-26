import express from "express";
import * as skillModel from "../models/skillModel";
const router = express.Router();

/**
 * @description: Returns all of a user's skills
 * @method: GET /api/skills/user?userID={userID}
 * @returns: HTTP 200 and all rows of data
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/user", async function (req, res, next) {
    try {
        const { userID } = req.query;
        if (typeof userID !== "string") {
            return res.status(400).json({ success: false, message: "Invalid User ID" });
        }
        const parsedUserID = parseInt(userID);
        if (isNaN(parsedUserID)) {
            return res.status(400).json({ success: false, message: "Invalid User ID" });
        }
        const rows = await skillModel.getUserSkills(parsedUserID);
        res.status(200).send(rows);
    } catch (err) {
        console.error(`Error in getting user skills: ${err}`);
        next(err);
    }
});

/**
 * @description: Returns all of an application's skills
 * @method: GET /api/skills/application?applicationID={applicationID}
 * @returns: HTTP 200 and all rows of data
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/user", async function (req, res, next) {
    try {
        const { applicationID } = req.query;
        if (typeof applicationID !== "string") {
            return res.status(400).json({ success: false, message: "Invalid Application ID" });
        }
        const parsedApplicationID = parseInt(applicationID);
        if (isNaN(parsedApplicationID)) {
            return res.status(400).json({ success: false, message: "Invalid Application ID" });
        }
        const rows = await skillModel.getApplicationSkills(parsedApplicationID);
        res.status(200).send(rows);
    } catch (err) {
        console.error(`Error in getting application skills: ${err}`);
        next(err);
    }
});

export default router;
