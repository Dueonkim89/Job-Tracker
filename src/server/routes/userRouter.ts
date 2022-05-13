import express from "express";
import * as bcrypt from "bcrypt";
import userModel from "../models/userModel";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import { validateUser, ValidationError } from "../types/validators";
const router = express.Router();
const saltRounds = 10;

/**
 * @description: Creates (registers) a new user
 * @method: POST /api/users
 * @param: JSON of {firstName, lastName, username, phoneNumber, emailAddress, password}
 * @returns: HTTP 201 upon success and JSON of {success: true, userID, message, token}
 * or HTTP 400 and JSON of {success: false, reason: "duplicate", field: "username"}
 * or HTTP 400 and JSON of {success: false, message: "other reason for error"}
 */
router.post("/", async function (req, res, next) {
    const { firstName, lastName, username, phoneNumber, emailAddress, password } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const fields = { firstName, lastName, username, phoneNumber, emailAddress, passwordHash };
        validateUser(fields, ["firstName", "lastName", "username", "emailAddress", "passwordHash"]);
        const userID = await userModel.createUser(fields);
        if (!userID || typeof userID !== "number") {
            throw Error("Invalid user creation: create user did not return userID");
        }
        const accessToken = jwt.sign({ id: userID }, process.env.JWT_SECRET as jwt.Secret, {
            expiresIn: "1h",
        });
        const response = {
            success: true,
            userID: userID,
            message: "user sucessfully created and login sucessfully",
            token: "Bearer " + accessToken,
        };
        return res.status(201).json(response);
    } catch (err: any) {
        if (err?.code === "ER_DUP_ENTRY" && err?.sqlMessage?.includes("username")) {
            return res.status(400).json({ success: false, reason: "duplicate", field: "username" });
        }
        if (err instanceof ValidationError) return res.status(400).json({ success: false, message: err.message });
        console.error(`Error in creating user:`);
        console.error({ firstName, lastName, username, phoneNumber, emailAddress }); // purposely excluding password
        next(err);
    }
});

/**
 * @description: Logs in an existing user
 * @method: POST /api/users/login
 * @param: JSON object of {username, password}
 * @returns: HTTP 200 upon success and JSON of {success: true, userID, message, token}
 */
router.post("/login", async function (req, res, next) {
    const { username, password } = req.body;
    try {
        const user = await userModel.getUserByUsername(username);
        if (!user) {
            res.status(400).json({ success: false, message: "Didn't find a user matching that username." });
            return;
        }
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (isValidPassword) {
            const accessToken = jwt.sign({ id: user.userID }, process.env.JWT_SECRET as jwt.Secret, {
                expiresIn: "1h",
            });
            return res.status(200).json({
                success: true,
                userID: user.userID,
                message: "login sucessfully",
                token: "Bearer " + accessToken,
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid Password or Username" });
            return;
        }
    } catch (err) {
        console.error(`Error in logging in user:`);
        console.error({ username }); // purposely excluding password
        next(err);
    }
});

/**
 * haven't tested this feature, will test once the logout tab has been created on the client side.
 */
router.get("/logout", async function (req, res) {
    req.logout();
    localStorage.clear();
    res.json({
        message: "user successfully logged out",
        status: "success",
    });
    res.redirect("/login");
});
/**
 * This will be the router that will be rendered if the user has passed the login authetication
 * to test this, run user /users/login and enter user creditials, copy the access token that will
 * be return, run a GET request on Postman and in the body select Authenticatation, value is the key
 */
router.get("/protected", passport.authenticate("jwt", { session: false }), async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "User has been authenticated and is authorized",
    });
});

export default router;
