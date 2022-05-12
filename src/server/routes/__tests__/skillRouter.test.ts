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
    const result = await request(server).get("/api/skills/user?userID=1").set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toContainEqual(expected[0]);
    expect(result.body).toContainEqual(expected[1]);
});

test("[Valid] Getting all application skills", async () => {
    const expected = [
        { applicationID: 1, name: "Java", skillID: 1 },
        { applicationID: 1, name: "C++", skillID: 2 },
    ];
    const result = await request(server)
        .get("/api/skills/application?applicationID=1")
        .set("Authorization", token)
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
    const result = await request(server).post("/api/skills/user").set("Authorization", token).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
});

test("[Valid] Adding a new skill to an application", async () => {
    const payload = { applicationID: 1, skillID: 7, name: "Python" };
    const result = await request(server).post("/api/skills/application").set("Authorization", token).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
});

test("[Valid] Updating a user's skill rating", async () => {
    const payload = { userID: 2, skillID: 5, rating: 4 };
    const result = await request(server).patch("/api/skills/user").set("Authorization", token).send(payload);
    expect(result.statusCode).toEqual(200);
    expect(result.body.success).toEqual(true);
});
