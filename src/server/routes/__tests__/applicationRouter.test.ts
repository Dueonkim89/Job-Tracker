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
test("[Valid] Getting user applications", async () => {
    const expected = [
        {
            applicationID: 1,
            companyID: 1,
            jobPostingURL: "https://www.amazon.jobs/en/jobs/996246/senior-software-dev-engineer",
            position: "Senior Software Dev Engineer",
            userID: 1,
            status: "Phone Screen",
            location: "Seattle, WA",
            notes: "here are my notes",
            datetime: "2022-01-01T00:00:00.000Z",
            companyName: "Amazon",
            contacts: [
                {
                    contactID: 1,
                    firstName: "Amanda",
                    lastName: "Alpha",
                    emailAddress: "HiringManager@amazonemail.com",
                    phoneNumber: "444-444-4444",
                    role: "Hiring Manager 1",
                },
                {
                    contactID: 2,
                    firstName: "Barry",
                    lastName: "Beta",
                    emailAddress: "HiringManager2@amazonemail.com",
                    phoneNumber: "444-444-5555",
                    role: "Hiring Manager 2",
                },
            ],
        },
        {
            applicationID: 2,
            companyID: 1,
            jobPostingURL: "https://www.amazon.jobs/en/jobs/981888/chip-design-engineer",
            position: "Chip Design Engineer",
            userID: 1,
            status: "Applied",
            location: "Tel Aviv, Israel",
            notes: "here are my notes",
            datetime: "2022-01-02T00:00:00.000Z",
            companyName: "Amazon",
            contacts: null,
        },
    ];
    const result = await request(server).get("/api/applications?userID=1").set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});

test("[Empty] Getting user applications", async () => {
    const result = await request(server).get("/api/applications?userID=200").set("Authorization", token).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual([]);
});

test("[Valid] Adding a user application", async () => {
    const payload = {
        companyID: 1,
        jobPostingURL: "https://www.test.com",
        position: "Test Position",
        userID: 2,
        status: "pending",
        location: "remote",
    };
    const result = await request(server).post("/api/applications").set("Authorization", token).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.applicationID).toBeGreaterThan(5);
    expect(result.body.success).toEqual(true);
});

test("[Valid] Updating a user status", async () => {
    const payload = {
        applicationID: 5,
        status: "Interview Again",
    };
    const result = await request(server).post("/api/applications/status").set("Authorization", token).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
});
