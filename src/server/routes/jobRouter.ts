import express from "express";
import * as jobModel from "../models/jobModel";
const router = express.Router();

/**
 * @description: Adds a job posting to the database
 * @method: POST /api/jobs
 * @param: JSON of {companyID, jobPostingURL, position}
 * @returns: HTTP 201 and JSON object of {success: true, duplicate: [true | false], jobID, companyID, jobPostingURL, position}
 * NOTE: if a job with the given URL already exists in the database, duplicate will be true, otherwise false
 */
router.post("/", async function (req, res, next) {
    try {
        const { companyID, jobPostingURL, position } = req.body;
        const isUnique = await jobModel.createJob({ companyID, jobPostingURL, position });
        const jobFields = await jobModel.getJobByURL(jobPostingURL);
        const response = { success: true, duplicate: !isUnique, ...jobFields };
        return res.status(201).json(response);
    } catch (err) {
        console.error(`Error in creating new job: ${err}`);
        next(err);
    }
});

export default router;
