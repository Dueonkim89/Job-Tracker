import express from "express";
import passport from "passport";
import * as skillModel from "../models/skillModel";
const router = express.Router();

/**
 * @description: Returns all skill names in the database
 * @method: GET /api/skills
 * @returns: HTTP 200 and all rows of data, which is an array of {skillID, name}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/", async function (req, res, next) {
    try {
        const rows = await skillModel.getAllSkills();
        res.status(200).send(rows);
    } catch (err) {
        console.error(`Error in getting all skills:`);
        next(err);
    }
});

/**
 * @description: Returns all of a user's skills
 * @method: GET /api/skills/user?userID={userID}
 * @returns: HTTP 200 and all rows of data
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/user", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { userID } = req.query;
    try {
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
        console.error(`Error in getting user skills:`);
        console.error({ userID });
        next(err);
    }
});

/**
 * @description: Returns all of an application's skills
 * @method: GET /api/skills/application?applicationID={applicationID}
 * @returns: HTTP 200 and all rows of data
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/application", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { applicationID } = req.query;
    try {
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
        console.error(`Error in getting application skills:`);
        console.error({ applicationID });
        next(err);
    }
});

/**
 * @description: Add a new skill name to the database
 * @method: POST /api/skills
 * @param: JSON of {name}
 * @returns: HTTP 201 and JSON of {success: true, skillID, name}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/", async function (req, res, next) {
    const { name } = req.body;
    try {
        if (typeof name !== "string") {
            return res.status(400).json({ success: false, message: "Invalid name: not a string" });
        }
        const skillID = await skillModel.createSkill({ name });
        res.status(201).send({ success: true, skillID, name });
    } catch (err) {
        console.error(`Error in creating new skill:`);
        console.error({ name });
        next(err);
    }
});

/**
 * @description: Adds a skill to a user
 * @method: POST /api/skills/user
 * @param: JSON of {userID, skillID, name, rating}
 * @returns: HTTP 201 and JSON of {success: true, userID, skillID, name, rating}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/user", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { userID, skillID, name, rating } = req.body;
    try {
        if (typeof userID !== "number") {
            return res.status(400).json({ success: false, message: "Invalid userID: not a number" });
        }
        if (typeof skillID !== "number") {
            return res.status(400).json({ success: false, message: "Invalid skillID: not a number" });
        }
        if (typeof name !== "string") {
            return res.status(400).json({ success: false, message: "Invalid name: not a string" });
        }
        if (typeof rating !== "number") {
            return res.status(400).json({ success: false, message: "Invalid rating: not a number" });
        }
        await skillModel.createUserSkill({ userID, skillID, name, rating });
        res.status(201).send({ success: true, userID, skillID, name, rating });
    } catch (err) {
        console.error(`Error in creating new skill:`);
        console.error({ userID, skillID, name, rating });
        next(err);
    }
});

/**
 * @description: Adds a skill to an application
 * @method: POST /api/skills/application
 * @param: JSON of {applicationID, skillID, name}
 * @returns: HTTP 201 and JSON of {success: true, applicationID, skillID, name}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/application", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { applicationID, skillID, name } = req.body;
    try {
        if (typeof applicationID !== "number") {
            return res.status(400).json({ success: false, message: "Invalid userID: not a number" });
        }
        if (typeof skillID !== "number") {
            return res.status(400).json({ success: false, message: "Invalid skillID: not a number" });
        }
        if (typeof name !== "string") {
            return res.status(400).json({ success: false, message: "Invalid name: not a string" });
        }
        await skillModel.createApplicationSkill({ applicationID, skillID, name });
        res.status(201).send({ success: true, applicationID, skillID, name });
    } catch (err) {
        console.error(`Error in creating new skill:`);
        console.error({ applicationID, skillID, name });
        next(err);
    }
});

/**
 * @description: Updates a user's skill rating
 * @method: PATCH /api/skills/user
 * @param: JSON of {userID, skillID, rating}
 * @returns: HTTP 201 and JSON of {success: true, userID, skillID, rating}
 * or HTTP 204 and JSON of {success: false, message: "reason for error"}
 */
router.patch("/user", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { userID, skillID, rating } = req.body;
    try {
        if (typeof userID !== "number" || userID < 1) {
            return res.status(400).json({ success: false, message: "Invalid userID: not a valid number" });
        }
        if (typeof skillID !== "number" || skillID < 1) {
            return res.status(400).json({ success: false, message: "Invalid skillID: not a valid number" });
        }
        if (typeof rating !== "number") {
            return res.status(400).json({ success: false, message: "Invalid rating: not a number" });
        }
        const didUpdate = await skillModel.updateUserSkillRating(userID, skillID, rating);
        if (!didUpdate) {
            return res.status(404).json({ success: false, message: "No matching row found for that userID/skillID" });
        }
        res.status(200).send({ success: true, userID, skillID, rating });
    } catch (err) {
        console.error(`Error in updating user skill rating:`);
        console.error({ userID, skillID, rating });
        next(err);
    }
});

export default router;
