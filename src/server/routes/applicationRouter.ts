import express from "express";
import { getUser } from "../models/userModel";
import * as application from "../models/applicationModel";
const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
        const { userID } = req.query;
        if (typeof userID !== "string") {
            res.status(400).send("Invalid User ID");
            return;
        }
        const userFields = await getUser(userID);
        if (Array.isArray(userFields) && userFields.length === 0) {
            res.status(404).send("User ID not found.");
            return;
        }
        const rows = await application.getUserApplications(userID);
        res.send(rows);
    } catch (err) {
        console.error(`Error in getUserApplications(): ${err}`);
        next(err);
    }
});

export default router;
