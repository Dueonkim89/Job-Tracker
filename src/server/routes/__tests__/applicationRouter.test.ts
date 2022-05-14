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
    const result = await request(server).get("/api/applications?userID=1").set("Authorization", token1).send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});

test("[Invalid] Getting user apps other than self", async () => {
    const result = await request(server).get("/api/applications?userID=2").set("Authorization", token1).send();
    expect(result.statusCode).toEqual(401);
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
    const result = await request(server).post("/api/applications").set("Authorization", token2).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.applicationID).toBeGreaterThan(5);
    expect(result.body.success).toEqual(true);
});

test("[Valid] Adding an app contact", async () => {
    const payload = {
        applicationID: 4,
        firstName: "testfirst",
        lastName: "testlast",
        emailAddress: "test@email.com",
        phoneNumber: "111-111-1295",
        role: "testrole",
    };
    const result = await request(server).post("/api/applications/contact").set("Authorization", token3).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
    expect(result.body.contactID).toBeGreaterThan(4);
});

test("[Valid] Deleting an app contact", async () => {
    const result = await request(server)
        .delete("/api/applications/contact?contactID=3")
        .set("Authorization", token2)
        .send();
    expect(result.statusCode).toEqual(200);
    expect(result.body.success).toEqual(true);
});

test("[Valid] Updating an app contact #1", async () => {
    const payload = { contactID: 4, firstName: "Z" };
    const expected = {
        contactID: 4,
        applicationID: 5,
        firstName: "Z", // previously DeAndre
        lastName: "Delta",
        emailAddress: "HiringManager@clouderaemail.com",
        phoneNumber: "666-666-6666",
        role: "Hiring Manager",
    };
    const result = await request(server).put("/api/applications/contact").set("Authorization", token3).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
    const updatedResult = await request(server)
        .get("/api/applications/contact?contactID=4")
        .set("Authorization", token3)
        .send();
    expect(updatedResult.statusCode).toEqual(200);
    expect(updatedResult.body).toEqual(expected);
});

test("[Valid] Updating an app status", async () => {
    const payload = {
        applicationID: 5,
        status: "Interview Again",
    };
    let result = await request(server).put("/api/applications").set("Authorization", token3).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
    result = await request(server).get("/api/applications?userID=3").set("Authorization", token3).send(payload);
    expect(result.statusCode).toEqual(200);
    expect(result.body[1].status).toEqual("Interview Again");
    expect(result.body[1].location).toEqual("Remote");
});

test("[Valid] Updating an app notes", async () => {
    const payload = {
        applicationID: 5,
        notes: "Great stuff",
    };
    let result = await request(server).put("/api/applications").set("Authorization", token3).send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
    result = await request(server).get("/api/applications?userID=3").set("Authorization", token3).send(payload);
    expect(result.statusCode).toEqual(200);
    expect(result.body[1].notes).toEqual("Great stuff");
    expect(result.body[1].location).toEqual("Remote");
});
