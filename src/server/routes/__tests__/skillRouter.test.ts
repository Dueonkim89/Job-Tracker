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
test("[Valid] Adding a new skill", async () => {
    const payload = { name: "NEW SKILL" };
    const result = await request(server).post("/api/skills").send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.skillID).toBeGreaterThan(9);
    expect(result.body.success).toEqual(true);
});

// TODO - test that a user cannot update skills other than their own?
test("[Valid] Adding a new skill to a user", async () => {
    const payload = { userID: 1, skillID: 7, name: "Python", rating: 5 };
    const result = await request(server).post("/api/skills/user").set("Authorization", token).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
});

// TODO - test that a user cannot update skills other than their own?
test("[Valid] Adding a new skill to an application", async () => {
    const payload = { applicationID: 1, skillID: 7, name: "Python" };
    const result = await request(server).post("/api/skills/application").set("Authorization", token).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
});
