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

test("[Valid] user login", async () => {
    const expected = {
        success: true,
        userID: 1,
        message: "login sucessfully",
    };
    const body = {
        username: "ally1",
        password: "ally1",
    };
    const result = await request(server).post("/api/users/login").send(body);
    const { success, userID, message, token } = result.body;
    expect(result.statusCode).toEqual(200);
    expect({ success, userID, message }).toStrictEqual(expected);
    expect(token).toContain("Bearer");
});

test("[Invalid] user login, wrong password", async () => {
    const expected = {
        success: false,
        message: "Invalid Password or Username",
    };
    const body = {
        username: "ally1",
        password: "a",
    };
    const result = await request(server).post("/api/users/login").send(body);
    const { success, message } = result.body;
    expect(result.statusCode).toEqual(400);
    expect({ success, message }).toStrictEqual(expected);
});

test("[Invalid] user login, no matching user", async () => {
    const expected = {
        success: false,
        message: "Didn't find a user matching that username.",
    };
    const body = {
        username: "ZZZZ",
        password: "a",
    };
    const result = await request(server).post("/api/users/login").send(body);
    const { success, message } = result.body;
    expect(result.statusCode).toEqual(400);
    expect({ success, message }).toStrictEqual(expected);
});

test("[Valid] user registration", async () => {
    const body = {
        firstName: "test",
        lastName: "test",
        username: "test",
        password: "test" as string | undefined,
        phoneNumber: "123-456-9999",
        emailAddress: "test@test.com",
    };
    const result = await request(server).post("/api/users").send(body);
    expect(result.statusCode).toEqual(201);
    expect(result.body.userID).toBeGreaterThan(3);
});
