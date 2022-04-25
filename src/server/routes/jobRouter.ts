import express from "express";
import * as jobModel from "../models/jobModel";
const router = express.Router();

/**
 * @description: Adds a job posting to the database
 * @method: POST /api/jobs
 * @param: JSON of {companyID, jobPostingURL, position}
 * @returns: HTTP 201 and JSON of {success: true, duplicate: [true | false], jobID, companyID, jobPostingURL, position}
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

/**
 * @description: Gets the job with the given URL
 * @method: GET /api/jobs?jobPostingURL={url}
 * @returns: HTTP 200 and JSON of {found: true, ...JobFields} if found, otherwise {found: false}
 */
router.get("/", async function (req, res, next) {
    try {
        const { jobPostingURL } = req.query;
        if (typeof jobPostingURL !== "string" || jobPostingURL.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid url" });
        }
        const fields = await jobModel.getJobByURL(jobPostingURL);
        if (!fields) {
            return res.status(200).json({ found: false });
        } else {
            return res.status(200).json({ found: true, ...fields });
        }
    } catch (err) {
        console.error(`Error in creating new job: ${err}`);
        next(err);
    }
});

export default router;
