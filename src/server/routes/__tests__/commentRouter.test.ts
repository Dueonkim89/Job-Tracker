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
test("[Valid] Getting company comments", async () => {
    const result = await request(server).get("/api/comments?companyID=1").set("Authorization", token).send();
    const expected = [
        {
            commentID: 1,
            companyID: 1,
            userID: 1,
            title: "Great Company",
            text: "Really loved my chat with the hiring manager!",
            datetime: "2022-01-01T00:00:00.000Z",
        },
    ];
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});

test("[Valid] Creating new company comment", async () => {
    const payload = {
        companyID: 3,
        userID: 3,
        title: "Not a great company",
        text: "Did not like my chat!",
    };
    const result = await request(server).post("/api/comments").set("Authorization", token).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.commentID).toBeGreaterThan(3);
});
