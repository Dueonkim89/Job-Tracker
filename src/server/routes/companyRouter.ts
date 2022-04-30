import express from "express";
import passport from "passport";
import * as companyModel from "../models/companyModel";
const router = express.Router();

/**
 * @description: Adds a company to the database
 * @method: POST /api/companies
 * @param: JSON of {name, industry, websiteURL}
 * @returns: HTTP 201 and JSON of {success: true, companyID, name, industry, websiteURL}
 */
router.post("/", async function (req, res, next) {
    const { name, industry, websiteURL } = req.body;
    try {
        const companyID = await companyModel.createCompany({ name, industry, websiteURL });
        const response = { success: true, companyID, name, industry, websiteURL };
        return res.status(201).json(response);
    } catch (err) {
        console.error(`Error in creating new company:`);
        console.error({ name, industry, websiteURL });
        next(err);
    }
});

/**
 * @description: Searches and returns an array of companies with given name prefix
 * for example if the name prefix is "Go" it would match "Google", "Goodyear", etc.
 * if name prefix is empty, it will return ALL companies
 * @method: GET /api/companies/search?name={name}
 * @returns: HTTP 200 and JSON of CompanyFields[] (see companyModel for CompanyFields interface)
 */
router.get("/search", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { name } = req.query;
    try {
        if (typeof name !== "string") {
            return res.status(400).json({ success: false, message: "Invalid name" });
        }
        const companies = await companyModel.searchCompaniesByName(name);
        return res.status(200).json(companies);
    } catch (err) {
        console.error(`Error in searching for company:`);
        console.error({ name });
        next(err);
    }
});

export default router;
