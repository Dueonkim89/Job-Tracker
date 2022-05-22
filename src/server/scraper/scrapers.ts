import axios from "axios";
import { titleCase } from "title-case";
import * as cheerio from "cheerio";
import fs from "fs";

// use this for debugging the html response:
// fs.writeFileSync("temp.html", response.data)

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
        } else if (host.includes("lever.co")) {
            return await lever(url);
        } else if (host.includes("myworkdayjobs.com")) {
            return await workday(url);
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
    const parseTagline = (tagline: string) => {
        const [company, other1] = tagline.split(" hiring ");
        const [title, other2] = other1.split(" in ");
        const [location, _] = other2.split(" | ");
        return { company, title, location };
    };

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
    // once job posting expires, the data can no longer be scraped without authentication
    const isRedirect = $("meta[name=pageKey]").attr("content") === "d_jobs_guest_search";
    if (isRedirect) throw new Error("LinkedIn job posting expired.");
    // otherwise the twitter meta data has the necessary information
    const tagline = $("meta[name=twitter:title]").attr("content");
    if (typeof tagline === "string") {
        return makeAppInfo(parseTagline(tagline));
    } else {
        throw new Error("No Twitter tagline present in Linkedin HTML.");
    }
}

async function lever(url: URL) {
    // URL: https://jobs.lever.co/atlassian/620921f2-c09c-4d3e-8bd2-f8781fbcc276
    // API URL: https://api.lever.co/v0/postings/atlassian/620921f2-c09c-4d3e-8bd2-f8781fbcc276
    const apiURL = `https://api.lever.co/v0/postings${url.pathname}`;
    const response = await axios.get(apiURL, { responseType: "json" });
    if (response.status < 200 || response.status >= 300) {
        throw Error(`Invalid response code: ${response.status} ${response.statusText}`);
    }
    const { data } = response;
    const location = data?.categories?.location;
    const title = data?.text;
    const company = titleCase(url.pathname.split("/")[1]);
    return makeAppInfo({ company, location, title });
}

async function workday(url: URL) {
    // URL: https://autodesk.wd1.myworkdayjobs.com/en-US/Ext/job/Oregon-USA---Remote/Software-Engineer_22WD58982-2
    // API: https://autodesk.wd1.myworkdayjobs.com/wday/cxs/autodesk/Ext/job/Oregon-USA---Remote/Software-Engineer_22WD58982-2
    const subdomain = url.host.split(".")[0];
    const tail = url.pathname.slice(url.pathname.indexOf("/job/"));
    const apiURL = `https://${subdomain}.wd1.myworkdayjobs.com/wday/cxs/${subdomain}/Ext${tail}`;
    const response = await axios.get(apiURL, { responseType: "json", headers: { accept: "application/json" } });
    if (response.status < 200 || response.status >= 300) {
        throw Error(`Invalid response code: ${response.status} ${response.statusText}`);
    }
    const { data } = response;
    const title = data?.jobPostingInfo?.title;
    const location = data?.jobPostingInfo?.location;
    const company = data?.hiringOrganization?.name;
    return makeAppInfo({ company, location, title });
}
