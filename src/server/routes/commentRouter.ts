import express from "express";
import passport from "passport";
import commentModel from "../models/commentModel";
import { parseStringID, validateComment, ValidationError } from "../types/validators";
const router = express.Router();

export default router;

/**
 * @description: Returns all of a companys's comments
 * @method: GET /api/comments?companyID={companyID}
 * @returns: HTTP 200 and all CompanyComments (as an array of objects)
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { companyID } = req.query;
    try {
        const parsedCompanyID = parseStringID(companyID);
        const rows = await commentModel.getCompanyComments(parsedCompanyID);
        res.status(200).json(rows);
    } catch (err) {
        if (err instanceof ValidationError) return res.status(400).json({ success: false, message: err.message });
        console.error(`Error in getting company comments:`);
        console.error({ companyID });
        next(err);
    }
});

/**
 * @description: Adds a user's company comment to the database
 * @method: POST /api/comments
 * @param: JSON of {userID, companyID, title, text}
 * @returns: HTTP 201 and JSON of {success: true, commentID, datetime}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.post("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { userID, companyID, title, text } = req.body;
    const datetime = new Date();
    const fields = { userID, companyID, title, text, datetime };
    try {
        validateComment(fields, ["userID", "companyID", "title", "text", "datetime"]);
        const commentID = await commentModel.createComment(fields);
        const response = { success: true, commentID, datetime };
        return res.status(201).json(response);
    } catch (err) {
        if (err instanceof ValidationError) return res.status(400).json({ success: false, message: err.message });
        console.error(`Error in creating new company comment:`);
        console.error({ userID, companyID, title, text, datetime });
        next(err);
    }
});
