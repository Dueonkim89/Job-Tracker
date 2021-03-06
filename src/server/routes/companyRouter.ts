import express from "express";
import passport from "passport";
import companyModel from "../models/companyModel";
import { Company } from "../types/company";
import { validateAndParseStringID } from "../types/validators";
const router = express.Router();

/**
 * @description: Get a company by ID
 * @method: GET /api/companies?companyID={companyID}
 * @returns: HTTP 200 and JSON of {success: true, companyID, name, industry, websiteURL}
 */
router.get("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { companyID } = req.query;
    try {
        const parsedID = validateAndParseStringID(companyID);
        const data = await companyModel.getCompanyByID(parsedID);
        if (data === null) {
            return res.status(400).json({ success: false, message: "companyID not found" });
        }
        const response = { success: true, ...data };
        return res.status(200).json(response);
    } catch (err: any) {
        err.sourceMessage = `Error in gett company by id`;
        next(err);
    }
});

/**
 * @description: Adds a company to the database
 * @method: POST /api/companies
 * @param: JSON of {name, industry, websiteURL}
 * @returns: HTTP 201 and JSON of {success: true, companyID}
 */
router.post("/", async function (req, res, next) {
    const { name, industry, websiteURL } = req.body;
    try {
        const company: Company = new Company({ name, industry, websiteURL });
        company.validateAndAssertContains(["name"]);
        const companyID = await companyModel.createCompany(company.fields);
        const response = { success: true, companyID };
        return res.status(201).json(response);
    } catch (err: any) {
        err.sourceMessage = `Error in creating new company`;
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
    } catch (err: any) {
        err.sourceMessage = `Error in searching for company`;
        next(err);
    }
});

export default router;
