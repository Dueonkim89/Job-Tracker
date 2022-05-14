// Boilerplate code
import http from "http";
import request from "supertest";
import { app } from "../../index";

let server: http.Server;
let token1: string;
let token2: string;
let token3: string;

const logInGetToken = async (username: string) => {
    const body = {
        username: username,
        password: username,
    };
    const result = await request(server).post("/api/users/login").send(body);
    if (!result.body.success) {
        throw Error("Log In / Get Token failed");
    }
    return result.body.token;
};

beforeAll((done) => {
    server = app.listen(async () => {
        const token1_promise = logInGetToken("ally1");
        const token2_promise = logInGetToken("bryson2");
        const token3_promise = logInGetToken("carlos3");
        token1 = await token1_promise;
        token2 = await token2_promise;
        token3 = await token3_promise;
        return done();
    });
});

afterAll((done) => {
    server.close(() => done());
});

// Tests start here

// TODO - test that a user cannot update skills other than their own?

test("[Valid] Getting all skills", async () => {
    const expected = [
        { name: "Java", skillID: 1 },
        { name: "Go", skillID: 8 },
    ];
    const result = await request(server).get("/api/skills").send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toContainEqual(expected[0]);
    expect(result.body).toContainEqual(expected[1]);
});

test("[Valid] Getting all user skills", async () => {
    const expected = [
        { userID: 1, name: "Java", skillID: 1, rating: 5 },
        { userID: 1, name: "C++", skillID: 2, rating: 3 },
    ];
    const result = await request(server).get("/api/skills/user?userID=1").set("Authorization", token1).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toContainEqual(expected[0]);
    expect(result.body).toContainEqual(expected[1]);
});

test("[Invalid] Trying to get another user skills", async () => {
    const result = await request(server).get("/api/skills/user?userID=1").set("Authorization", token3).send();
    expect(result.statusCode).toEqual(401);
});

test("[Valid] Getting all application skills", async () => {
    const expected = [
        { applicationID: 1, name: "Java", skillID: 1 },
        { applicationID: 1, name: "C++", skillID: 2 },
    ];
    const result = await request(server)
        .get("/api/skills/application?applicationID=1")
        .set("Authorization", token1)
        .send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toContainEqual(expected[0]);
    expect(result.body).toContainEqual(expected[1]);
});

test("[Valid] Adding a new skill", async () => {
    const payload = { name: "NEW SKILL" };
    const result = await request(server).post("/api/skills").send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.skillID).toBeGreaterThan(9);
    expect(result.body.success).toEqual(true);
});

test("[Valid] Adding a new skill to a user", async () => {
    const payload = { userID: 1, skillID: 7, name: "Python", rating: 5 };
    const result = await request(server).post("/api/skills/user").set("Authorization", token1).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
});

test("[Invalid] Attempting to add a skill to another user", async () => {
    const payload = { userID: 1, skillID: 7, name: "Python", rating: 5 };
    const result = await request(server).post("/api/skills/user").set("Authorization", token3).send(payload);
    expect(result.statusCode).toEqual(401);
});

test("[Valid] Adding a new skill to an application", async () => {
    const payload = { applicationID: 1, skillID: 7, name: "Python" };
    const result = await request(server).post("/api/skills/application").set("Authorization", token1).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
});

test("[Invalid] Attempting to add a new skill to another user's application", async () => {
    const payload = { applicationID: 1, skillID: 7, name: "Python" };
    const result = await request(server).post("/api/skills/application").set("Authorization", token3).send(payload);
    expect(result.statusCode).toEqual(401);
});

test("[Valid] Updating a user's skill rating", async () => {
    const payload = { userID: 2, skillID: 5, rating: 4 };
    const result = await request(server).patch("/api/skills/user").set("Authorization", token2).send(payload);
    expect(result.statusCode).toEqual(200);
    expect(result.body.success).toEqual(true);
});
