import express from "express";
import passport from "passport";
import scraper from "../scraper/scrapers";
const router = express.Router();

export default router;

/**
 * @description: Attemps to scrape a jobPostingURL and return its application data fields
 * @method: GET /api/scrape?url={url}
 * @returns: HTTP 200 and JSON of {company, location, title}
 * or HTTP 400 and JSON of {success: false, message: "reason for error"}
 */
router.get("/", passport.authenticate("jwt", { session: false }), async function (req, res, next) {
    const url = req.query.url;
    try {
        if (typeof url !== "string") {
            return res.status(400).json({ success: false, message: "Invalid url" });
        }
        const result = await scraper(new URL(url));
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(400).json({ success: false, message: "Scraping not available." });
    } catch (err) {
        console.error(`Other error in scraping url:`);
        console.error({ url });
        next(err);
    }
});
