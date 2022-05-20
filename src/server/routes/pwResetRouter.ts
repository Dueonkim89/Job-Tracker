import express from "express";
import userModel from "../models/userModel";
import { validateAuthorization, validateAndParseStringID, ValidationError } from "../types/validators";

const router = express.Router();
export default router;

router.post("/send-email", async function (req, res, next) {
    const { emailAddress } = req.body;
    try {
        // ensure email is found in the database
        const user = userModel.getUserByEmailAddress(emailAddress);
        if (!user) throw new ValidationError("Email address not found.");
        // TODO - send an email to the users
    } catch (err: any) {
        err.sourceMessage = `Error in sending password reset email.`;
    }
});
