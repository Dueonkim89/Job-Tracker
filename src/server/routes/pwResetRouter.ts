import express from "express";
import userModel from "../models/userModel";
import { ValidationError } from "../types/validators";
import sendgrid from "@sendgrid/mail";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import pwResetModel from "../models/pwResetModel";
import { PW_SALT_ROUNDS } from "./userRouter";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

const router = express.Router();
export default router;

/**
 * @description: Sends a reset password email to the user
 * @method: POST /api/pw-reset/send-email
 * @param: JSON of { emailAddress }
 * @returns: HTTP 200 and {success: true}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/send-email", async function (req, res, next) {
    const { emailAddress } = req.body;
    try {
        // ensure email is found in the database
        const user = await userModel.getUserByEmailAddress(emailAddress);
        if (!user) return res.status(400).json({ success: false, field: "email", message: "Email not found." });
        // TODO - should I SALT the resetID before saving in the database?
        //    otherwise an attacker who gains DB access could intercept all incoming reset requests
        const resetID = await saveResetRequest(user.userID, emailAddress); // create and save a unique resetID for the request
        await sendResetEmail(resetID, emailAddress); // send the email to the user
        res.status(200).send({ success: true });
    } catch (err: any) {
        err.sourceMessage = `Error in sending password reset email`;
        next(err);
    }
});

/**
 * @description: Changes the user's password to the new password
 * @method: POST /api/pw-reset/send-email
 * @param: JSON of {resetID, emailAddress, newPassword}
 * @returns: HTTP 200 and {success: true} or HTTP 400 and JSON of [see below]
 */
router.post("/change", async function (req, res, next) {
    const { resetID, emailAddress, newPassword } = req.body;
    try {
        // TODO - validate the inputs
        // TODO - return failure if more than [5] attempts are made within the last 15 minutes for the given emailAddress
        // TODO - delete the database row after successful reset
        const pwReset = await pwResetModel.getResetRequest(resetID);
        if (pwReset === null) {
            return res.status(400).json({ success: false, field: "resetID", message: "Invalid resetID" });
        }
        if (pwReset.emailAddress !== emailAddress) {
            return res.status(400).json({ success: false, field: "emailAddress", message: "Invalid emailAddress" });
        }
        const expirationTime = new Date(pwReset.datetime.getTime() + 900000); // add 15 minutes
        if (new Date() > expirationTime) {
            return res.status(400).json({ success: false, field: "datetime", message: "Request expired" });
        }
        const passwordHash = await bcrypt.hash(newPassword, PW_SALT_ROUNDS);
        const didUpdate = await userModel.updateUser(pwReset.userID, { passwordHash });
        if (!didUpdate) {
            return res.status(400).json({ success: false, field: "userID", message: "User ID didn't match" });
        }
        return res.status(200).json({ success: true });
    } catch (err: any) {
        err.sourceMessage = `Error in resetting password`;
        next(err);
    }
});

/**
 * Saves the necessary info to the database and
 */
async function saveResetRequest(userID: number, emailAddress: string) {
    while (true) {
        try {
            const resetID = randomUUID();
            await pwResetModel.saveResetRequest(resetID, userID, emailAddress, new Date());
            return resetID;
        } catch (err: any) {
            if (err?.code === "ER_DUP_ENTRY") {
                continue; // in the event of a hash collision, try a new hash value
            } else {
                throw err; // if a different err occurs, percolate the err up
            }
        }
    }
}

/**
 * Sends the password reset email to the given user
 */
async function sendResetEmail(resetID: string, emailAddress: string) {
    // using SendGrid Library: https://github.com/sendgrid/sendgrid-nodejs
    const resetURL = `https://jobtrackerapplication.azurewebsites.net/change_password?id=${resetID}`;
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
