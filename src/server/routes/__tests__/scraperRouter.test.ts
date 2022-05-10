// Boilerplate code
import http from "http";
import request from "supertest";

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
    const { app } = require("../../index");
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
    const url = "https://www.linkedin.com/jobs/view/3060946308";
    const expected = {
        success: true,
        company: "Vanguard",
        location: "Wayne, Pennsylvania, United States",
        title: "Software Engineer - AWS",
    };
    const result = await request(server).get(`/api/scrape?url=${url}`).set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});

test("[Linkedin] Vanguard URL Type 2", async () => {
    const url = "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=3060946308";
    const expected = {
        success: true,
        company: "Vanguard",
        location: "Wayne, Pennsylvania, United States",
        title: "Software Engineer - AWS",
    };
    const result = await request(server).get(`/api/scrape?url=${url}`).set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});
