import express from "express";
import * as bcrypt from "bcrypt";
import * as user from "../models/userModel";
import * as jwt from "jsonwebtoken";
import passport from "passport";
const router = express.Router();
const saltRounds = 10;

/**
 * @description: Creates / registers a new user
 * @method: POST /users
 * @param: JSON object of {firstName, lastName, username, phoneNumber, emailAddress, password}
 * @returns: HTTP 201 upon success
 */
router.post("/", async function (req, res, next) {
    const { firstName, lastName, username, phoneNumber, emailAddress, password } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);
        await user.createUser({firstName, lastName, username, phoneNumber, emailAddress, passwordHash});
        res.status(201).send("Successfully created user.");
    } catch (err) {
        console.error(`Error in creating user: ${err}`);
        next(err);
    }
});

/**
 * @description: Logs in an existing user
 * @method: POST /users/login
 * @param: JSON object of {username, password}
 * @returns: HTTP 200 upon success and JSON object of {token: thisWillBeAnAcessToken}
 */
router.post("/login", async function (req, res, next) {
    const { username, password } = req.body;
    try {
        const userFields = await user.getUserByUsername(username);
        if (!userFields) {
            res.status(400).json({ error: "Didn't find a user matching that username." });
            return;
        }
        const isValidPassword = await bcrypt.compare(password, userFields.passwordHash);
        if (isValidPassword) {
            // TODO - probably need some sort of session token logic here
            const accessToken = jwt.sign({ id: userFields.user_id }, 'd5bb8b56620cc82ee7d0ebda543f26414e8547051469fe642a64100b918767c5ef5494efe3659742853f83d425562098ca450abbc8d38f3f5dfcc2aceb22b78a', {
                expiresIn: "1h"
            })
            res.status(200).json({
                success: true,
                userID: userFields.user_id,
                message: "login sucessfully",
                token: "Bearer " + accessToken,
            });
            return;
        } else {
            res.status(400).json({ error: "Invalid Password or Username" });
            return;
        }
    } catch (err) {
        console.error(`Error in logging in user: ${err}`);
        next(err);
    }
});

router.get('/protected', passport.authenticate('jwt', {session : false}), async(req, res) => {
    return res.status(200).json({
        success: true,
        message: 'User has been authenticated and is authorized'
    })
});
export default router;
