import request from "supertest";
import "../../config/global";

const server = global.__SERVER__;

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
    const expected = {
        success: true,
        userID: 4,
        ...body,
    };
    delete expected.password;
    const result = await request(server).post("/api/users").send(body);
    expect(result.body).toStrictEqual(expected);
});
