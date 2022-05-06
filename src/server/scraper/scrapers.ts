import axios from "axios";
import { titleCase } from "title-case";
import * as cheerio from "cheerio";

interface ScrapedAppInfo {
    success: boolean;
    company: string | null;
    location: string | null;
    title: string | null;
}

export default async function scrape(url: URL) {
    const host = url.host.toLowerCase();
    try {
        if (host.includes("greenhouse.io")) {
            return await greenhouse(url);
        } else if (host.includes("linkedin.com")) {
            return await linkedin(url);
        } else {
            console.info(`No scraper available: ${url.toString()}`);
            return { success: false, message: "No scraper available for that URL." };
        }
    } catch (err) {
        console.error(`Error scraping webpage: ${url.toString()}`);
        console.error(err);
        return { success: false, message: "Error scraping that webpage." };
    }
}

const makeAppInfo = (fields: any): ScrapedAppInfo => ({
    success: true,
    company: fields?.company || null,
    location: fields?.location || null,
    title: fields?.title || null,
});

async function greenhouse(url: URL) {
    // example URL: https://boards.greenhouse.io/notion/jobs/5032410003?utm_campaign=google_jobs_apply
    const pathparts = url.pathname.split("/");
    if (pathparts.length < 4) {
        throw Error(`Invalid URL: path not sufficient length: ${url.pathname}`);
    }
    const company = pathparts[1];
    const postID = pathparts[3];
    const apiURL = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs/${postID}`;
    const response = await axios.get(apiURL, { responseType: "json" });
    if (response.status < 200 || response.status >= 300) {
        throw Error(`Invalid response code: ${response.status} ${response.statusText}`);
    }
    const { data } = response;
    const location = data?.location?.name;
    const title = data?.title;
    return makeAppInfo({ company: titleCase(company), location, title });
}

async function linkedin(url: URL) {
    // modify the URL to the correct form
    if (url.searchParams.get("currentJobId")) {
        // example URL 1: https://www.linkedin.com/jobs/collections/recommended/?currentJobId=3063580347
        url = new URL(`https://www.linkedin.com/jobs/view/${url.searchParams.get("currentJobId")}`);
    } else if (url.pathname.search(/jobs\/view\/[0-9]+/) < 0) {
        // example URL 2: https://www.linkedin.com/jobs/view/3063580347
        throw new Error("Invalid URL");
    }
    // get and parse the HTML
    const response = await axios.get(url.toString(), { responseType: "text" });
    const $ = cheerio.load(response.data);
    const tagline = $("meta[name=twitter:title]").attr("content");
    if (typeof tagline === "string") {
        return makeAppInfo(parseTagline(tagline));
    } else {
        throw new Error("No Twitter tagline present in Linkedin HTML.");
    }
}

function parseTagline(tagline: string) {
    const [company, other1] = tagline.split(" hiring ");
    const [title, other2] = other1.split(" in ");
    const [location, _] = other2.split(" | ");
    return { company, title, location };
}
