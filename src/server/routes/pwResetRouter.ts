import express from "express";
import userModel from "../models/userModel";
import { ValidationError } from "../types/validators";
import sendgrid from "@sendgrid/mail";
import { randomUUID } from "crypto";
import pwResetModel from "../models/pwResetModel";
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
        const user = await userModel.getUserByEmailAddress(emailAddress);
        if (!user) throw new ValidationError("Email address not found.");
        const resetID = await saveResetRequest(emailAddress); // create and save a unique resetID for the request
        await sendResetEmail(resetID, emailAddress); // send the email to the user
        res.status(200).send({ success: true });
    } catch (err: any) {
        err.sourceMessage = `Error in sending password reset email`;
        next(err);
    }
});

async function saveResetRequest(emailAddress: string) {
    while (true) {
        try {
            const resetID = randomUUID();
            await pwResetModel.saveResetID(resetID, emailAddress, new Date());
            return resetID;
        } catch (err: any) {
            if (err?.code === "ER_DUP_ENTRY") {
                continue;
            } else {
                throw err;
            }
        }
    }
}

async function sendResetEmail(resetID: string, emailAddress: string) {
    // using SendGrid Library: https://github.com/sendgrid/sendgrid-nodejs
    const resetURL = `https://jobtrackerapplication.azurewebsites.net/change-password/${resetID}`;
    const emailText =
        `Hello! We received a request to reset your password. ` +
        `If this request was from you, please visit the below link. \n` +
        `DO NOT share this URL with anyone else. \n\n` +
        `${resetURL}`;
    const emailHTML =
        `<div>Hello! We received a request to reset your password. ` +
        `If this request was from you, please visit the below link.</div>` +
        `<div><strong>DO NOT</strong> share this URL with anyone else.</div>` +
        `<br>` +
        `<div><a href=${resetURL}>${resetURL}</a></div>`;
    const msg: sendgrid.MailDataRequired = {
        to: "bairdjo@oregonstate.edu", // TODO: change to emailAddress
        from: "jobtrackerapplication@gmail.com",
        subject: "Password Reset Request",
        text: emailText,
        html: emailHTML,
    };
    await sendgrid.send(msg);
}
