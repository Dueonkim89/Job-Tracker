import express from "express";
import userModel from "../models/userModel";
import { validateAuthorization, validateAndParseStringID, ValidationError } from "../types/validators";
import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

const router = express.Router();
export default router;

//

/**
 * @description: Sends a reset password email to the user
 * @method: POST /api/pw-reset/send-email
 * @param: JSON of { emailAddress }
 * @returns: HTTP 200 and ...
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/send-email", async function (req, res, next) {
    const { emailAddress } = req.body;
    try {
        // ensure email is found in the database
        const user = userModel.getUserByEmailAddress(emailAddress);
        if (!user) throw new ValidationError("Email address not found.");
        // using SendGrid Library: https://github.com/sendgrid/sendgrid-nodejs
        const msg = {
            to: "bairdjo@oregonstate.edu", // Change to your recipient
            from: "jobtrackerapplication@gmail.com", // Change to your verified sender
            subject: "Sending with SendGrid is Fun",
            text: "and easy to do anywhere, even with Node.js",
            html: "<strong>and easy to do anywhere, even with Node.js</strong>",
        };
        await sendgrid.send(msg);
    } catch (err: any) {
        err.sourceMessage = `Error in sending password reset email.`;
        next(err);
    }
});
