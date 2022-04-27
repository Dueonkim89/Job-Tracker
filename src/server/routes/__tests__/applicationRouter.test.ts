import request from "supertest";
import "../../config/global";

const server = global.__SERVER__;

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
            datetime: "2022-01-01T05:00:00.000Z",
        },
        {
            applicationID: 2,
            companyID: 1,
            jobPostingURL: "https://www.amazon.jobs/en/jobs/981888/chip-design-engineer",
            position: "Chip Design Engineer",
            userID: 1,
            status: "Applied",
            location: "Tel Aviv, Israel",
            datetime: "2022-01-02T05:00:00.000Z",
        },
    ];
    const result = await request(server).get("/api/applications?userID=1").send();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expected);
});

test("[Empty] Getting user applications", async () => {
    const result = await request(server).get("/api/applications?userID=200").send();
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
    const result = await request(server).post("/api/applications").send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.applicationID).toEqual(6);
    expect(result.body.success).toEqual(true);
});

test("[Valid] Updating a user status", async () => {
    const payload = {
        applicationID: 1,
        status: "Interview Again",
    };
    const result = await request(server).post("/api/applications/status").send(payload);
    expect(result.statusCode).toEqual(201);
    expect(result.body.success).toEqual(true);
});
