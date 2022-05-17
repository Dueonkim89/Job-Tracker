import express from "express";
import passport from "passport";
import commentModel from "../models/commentModel";
import { CompanyComment } from "../types/comment";
import { validateAndParseStringID } from "../types/validators";
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
        const parsedCompanyID = validateAndParseStringID(companyID);
        const rows = await commentModel.getCompanyComments(parsedCompanyID);
        res.status(200).json(rows);
    } catch (err: any) {
        err.sourceMessage = `Error in getting company comments`;
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
    try {
        const datetime = new Date();
        const comment: CompanyComment = new CompanyComment({ userID, companyID, title, text, datetime });
        comment.validateAndAssertContains(["userID", "companyID", "title", "text", "datetime"]);
        const commentID = await commentModel.createComment(comment.fields);
        const response = { success: true, commentID, datetime };
        return res.status(201).json(response);
    } catch (err: any) {
        err.sourceMessage = `Error in creating new company comment`;
        next(err);
    }
});
