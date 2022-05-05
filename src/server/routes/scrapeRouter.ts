import express from "express";
import passport from "passport";
import * as scrapers from "../scraper/scrapers";
const router = express.Router();

export default router;

/**
 * @description: Attemps to scrape a jobPostingURL and return its application data fields
 * @method: GET /api/scrape?url={url}
 * @returns: HTTP 200 and JSON of {company, location, title}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const rawURL = req.query.url;
    try {
        if (typeof rawURL !== "string") {
            return res.status(400).json({ success: false, message: "Invalid url" });
        }
        const url = new URL(rawURL);
        if (url.host.toLowerCase().includes("greenhouse")) {
            const result = await scrapers.greenhouse(url);
            return res.status(200).json(result);
        }
        return res.status(400).json({ success: false, message: "Scraping is not available for that job board yet." });
    } catch (err) {
        console.error(`Error in parsing url:`);
        console.error({ rawURL });
        next(err);
    }
});
