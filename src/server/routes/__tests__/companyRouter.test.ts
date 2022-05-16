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
    expect(result.body).toEqual(expected);
    expect(result.statusCode).toEqual(200);
});

test("[Valid] Getting a company by ID", async () => {
    const expected = {
        success: true,
        companyID: 1,
        industry: "Technology",
        name: "Amazon",
        websiteURL: "www.amazon.com",
    };
    const result = await request(server).get("/api/companies?companyID=1").set("Authorization", token).send();
    expect(result.body).toEqual(expected);
    expect(result.statusCode).toEqual(200);
});

test("[Invalid] Getting a company by ID: no match", async () => {
    const expected = { success: false, message: "companyID not found" };
    const result = await request(server).get("/api/companies?companyID=100").set("Authorization", token).send();
    expect(result.body).toEqual(expected);
    expect(result.statusCode).toEqual(400);
});
