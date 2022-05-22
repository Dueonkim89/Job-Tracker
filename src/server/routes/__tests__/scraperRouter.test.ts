// Boilerplate code
import http from "http";
import request from "supertest";
import { app } from "../../index";

let server: http.Server;
let token: string;

const logInGetToken = async () => {
    const body = {
        username: "ally1",
        password: "ally1",
    };
    const result = await request(server).post("/api/users/login").send(body);
    if (!result.body.success) {
        throw Error("Log In / Get Token failed");
    }
    return result.body.token;
};

beforeAll((done) => {
    server = app.listen(async () => {
        token = await logInGetToken();
        return done();
    });
});

afterAll((done) => {
    server.close(() => done());
});

// Tests start here
test("[Greenhouse] Notion URL", async () => {
    const url = "https://boards.greenhouse.io/notion/jobs/4779256003";
    const expected = {
        success: true,
        company: "Notion",
        location: "New York, New York, United States",
        title: "Software Engineer, Fullstack",
    };
    const result = await request(server).get(`/api/scrape?url=${url}`).set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
    // TODO - get a new notion URL
    // expect(true).toEqual(true);
});

test("[Linkedin] Vanguard URL Type 1", async () => {
    const url = "https://www.linkedin.com/jobs/view/2975166798";
    const expected = {
        success: true,
        company: "Databricks",
        location: "Philadelphia, Pennsylvania, United States",
        title: "Full Stack Software Engineer, IT﻿",
    };
    const result = await request(server).get(`/api/scrape?url=${url}`).set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});

test("[Linkedin] Vanguard URL Type 2", async () => {
    const url = "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=2975166798";
    const expected = {
        success: true,
        company: "Databricks",
        location: "Philadelphia, Pennsylvania, United States",
        title: "Full Stack Software Engineer, IT﻿",
    };
    const result = await request(server).get(`/api/scrape?url=${url}`).set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});

test("[Lever] Atlassian URL", async () => {
    const url = "https://jobs.lever.co/atlassian/b581c923-c49d-41e0-be15-e6c7cfe011c1";
    const expected = {
        success: true,
        company: "Atlassian",
        location: "Mountain View, United States",
        title: "Data Scientist, Product Analytics",
    };
    const result = await request(server).get(`/api/scrape?url=${url}`).set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});

test("[Workday] Autodesk URL", async () => {
    const url =
        "https://autodesk.wd1.myworkdayjobs.com/en-US/Ext/job/Oregon-USA---Remote/Software-Engineer_22WD58982-2";
    const expected = {
        success: true,
        company: "Autodesk Inc.",
        location: "Oregon, USA - Remote",
        title: "Software Engineer, Remote - US & Canada",
    };
    const result = await request(server).get(`/api/scrape?url=${url}`).set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});

test("[Workday] Salesforce URL", async () => {
    const url =
        "https://salesforce.wd1.myworkdayjobs.com/en-US/External_Career_Site/job/Washington---Bellevue/Backend-Software-Development-Engineer--All-Levels----Marketing-Cloud_JR139261";
    const expected = {
        success: true,
        company: "100-SFDC Inc.",
        location: "Washington - Bellevue",
        title: "Backend Software Development Engineer (All Levels) - C360 Data, Engagement & Search Engineering",
    };
    const result = await request(server).get(`/api/scrape?url=${url}`).set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});

test("[Workday] Slack URL", async () => {
    const url =
        "https://salesforce.wd1.myworkdayjobs.com/en-US/Slack/job/Texas---Remote/Senior-Engineering-Manager--Security-Operations_JR134985";
    const expected = {
        success: true,
        company: "100-SFDC Inc.",
        location: "Texas - Remote",
        title: "Senior Engineering Manager, Security Operations",
    };
    const result = await request(server).get(`/api/scrape?url=${url}`).set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});
