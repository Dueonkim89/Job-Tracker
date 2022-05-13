import express from "express";
import passport from "passport";
import companyModel from "../models/companyModel";
import { parseStringID, validateCompany, ValidationError } from "../types/validators";
const router = express.Router();

/**
 * @description: Get a company by ID
 * @method: GET /api/companies?companyID={companyID}
 * @returns: HTTP 200 and JSON of {success: true, companyID, name, industry, websiteURL}
 */
router.get("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const { companyID } = req.query;
    try {
        const parsedID = parseStringID(companyID);
        const data = await companyModel.getCompanyByID(parsedID);
        if (data === null) {
            return res.status(400).json({ success: false, message: "companyID not found" });
        }
        const response = { success: true, ...data };
        return res.status(200).json(response);
    } catch (err) {
        if (err instanceof ValidationError) return res.status(400).json({ success: false, message: err.message });
        console.error(`Error in gett company by id:`);
        console.error({ companyID });
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
    const fields = { name, industry, websiteURL };
    try {
        validateCompany(fields, ["name"]);
        const companyID = await companyModel.createCompany({ name, industry, websiteURL });
        const response = { success: true, companyID };
        return res.status(201).json(response);
    } catch (err) {
        if (err instanceof ValidationError) return res.status(400).json({ success: false, message: err.message });
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
        if (err instanceof ValidationError) return res.status(400).json({ success: false, message: err.message });
        console.error(`Error in searching for company:`);
        console.error({ name });
        next(err);
    }
});

export default router;
