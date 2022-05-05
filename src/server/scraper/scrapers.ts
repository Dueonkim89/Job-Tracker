import axios from "axios";
import { titleCase } from "title-case";

interface ScrapedAppInfo {
    company: string | null;
    location: string | null;
    title: string | null;
}

const makeAppInfo = (fields: any): ScrapedAppInfo => ({
    company: fields?.company || null,
    location: fields?.location || null,
    title: fields?.title || null,
});

export async function greenhouse(url: URL) {
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
