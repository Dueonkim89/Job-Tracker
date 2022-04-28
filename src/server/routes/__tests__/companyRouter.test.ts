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
test("[Valid] Adding a new company", async () => {
    const payload = {
        name: "Test Company 2",
        industry: "Pharma",
        websiteURL: "www.test.com",
    };
    const result = await request(server).post("/api/companies").send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.companyID).toBeGreaterThan(3);
    expect(result.body.success).toEqual(true);
});

test("[Valid] Searching for a company", async () => {
    const expected = [{ companyID: 1, industry: "Technology", name: "Amazon", websiteURL: "www.amazon.com" }];
    const result = await request(server).get("/api/companies/search?name=Amaz").set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});