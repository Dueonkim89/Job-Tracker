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
    const url = "https://boards.greenhouse.io/notion/jobs/5032410003?utm_campaign=google_jobs_apply";
    const expected = {
        company: "Notion",
        location: "New York, New York, United States",
        title: "Software Engineer, Early Career",
    };
    const result = await request(server).get(`/api/scrape?url=${url}`).set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});
