import express from "express";
import passport from "passport";
import appModel from "../models/applicationModel";
import skillModel from "../models/skillModel";
import { ApplicationSkillFields, Skill, UserSkillFields } from "../types/skill";
import { validateAndParseStringID, validateAuthorization } from "../types/validators";
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
    } catch (err: any) {
        err.sourceMessage = `Error in getting all skills:`;
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
    const requestorID = req.user?.userID as number;
    const { userID } = req.query;
    try {
        const parsedUserID = validateAndParseStringID(userID);
        validateAuthorization(requestorID, parsedUserID);
        const rows = await skillModel.getUserSkills(parsedUserID);
        res.status(200).send(rows);
    } catch (err: any) {
        err.sourceMessage = `Error in getting user skills`;
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
    const requestorID = req.user?.userID as number;
    const { applicationID } = req.query;
    try {
        const parsedApplicationID = validateAndParseStringID(applicationID);
        const { userID } = await appModel.getAppByID(parsedApplicationID);
        validateAuthorization(requestorID, userID);
        const rows = await skillModel.getApplicationSkills(parsedApplicationID);
        res.status(200).send(rows);
    } catch (err: any) {
        err.sourceMessage = `Error in getting application skills`;
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
        const skill: Skill = new Skill({ name });
        skill.validateAndAssertContains(["name"]);
        const skillID = await skillModel.createSkill({ name });
        res.status(201).send({ success: true, skillID, name });
    } catch (err: any) {
        err.sourceMessage = `Error in creating new skill`;
        next(err);
    }
});

/**
 * @description: Adds a skill to a user
 * @method: POST /api/skills/user
 * @param: JSON of {userID, skillID, rating}
 * @returns: HTTP 201 and JSON of {success: true}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/user", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const requestorID = req.user?.userID as number;
    const { userID, skillID, rating } = req.body;
    try {
        const skill: Skill = new Skill({ userID, skillID, rating });
        skill.validateAndAssertContains(["userID", "skillID", "rating"]);
        validateAuthorization(requestorID, skill.fields.userID);
        await skillModel.createUserSkill(skill.fields as UserSkillFields);
        res.status(201).send({ success: true });
    } catch (err: any) {
        err.sourceMessage = `Error in creating new skill`;
        next(err);
    }
});

/**
 * @description: Adds a skill to an application
 * @method: POST /api/skills/application
 * @param: JSON of {applicationID, skillID} to add a single skillID
 *  OR: { applicationID, skillIDs: number[] } to add the entire array of skillIDs
 * @returns: HTTP 201 and JSON of {success: true, applicationID, skillID, name}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/application", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const requestorID = req.user?.userID as number;
    const { applicationID, skillID, skillIDs }: { applicationID: any; skillID: any; skillIDs: any[] } = req.body;
    const skill: Skill = new Skill({ applicationID });
    const partialSuccess: number[] = []; // sent if error occurs midway through; skillIDs which succeeded
    try {
        skill.validateAndAssertContains(["applicationID"]);
        const { userID } = await appModel.getAppByID(skill.fields.applicationID);
        validateAuthorization(requestorID, userID);
        if (skillID !== undefined) {
            await skillModel.createApplicationSkill({ applicationID, skillID });
            partialSuccess.push(skillID);
        }
        if (skillIDs !== undefined) {
            for (const skillID of skillIDs) {
                const skill: Skill = new Skill({ skillID });
                skill.validateAndAssertContains(["skillID"]);
                await skillModel.createApplicationSkill({ applicationID, skillID });
                partialSuccess.push(skillID);
            }
        }
        res.status(201).send({ success: true, applicationID, skillID });
    } catch (err: any) {
        err.partialSuccess = partialSuccess;
        err.sourceMessage = `Error in creating new skill`;
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
    const requestorID = req.user?.userID as number;
    const { userID, skillID, rating } = req.body;
    try {
        const skill: Skill = new Skill({ userID, skillID, rating });
        skill.validateAndAssertContains(["userID", "skillID", "rating"]);
        validateAuthorization(requestorID, skill.fields.userID);
        const didUpdate = await skillModel.updateUserSkillRating(userID, skillID, rating);
        if (!didUpdate) {
            return res.status(404).json({ success: false, message: "No matching row found for that userID/skillID" });
        }
        res.status(200).send({ success: true, userID, skillID, rating });
    } catch (err: any) {
        err.sourceMessage = `Error in updating user skill rating`;
        next(err);
    }
});

export default router;
