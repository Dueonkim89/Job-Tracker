import * as appModel from "../applicationModel";

test("Get user 1 apps", async () => {
    const result = await appModel.getUserApps(1);
    const expected = [
        {
            applicationID: 1,
            companyID: 1,
            datetime: new Date("2022-01-01T05:00:00.000Z"),
            jobID: 1,
            jobPostingURL: "https://www.amazon.jobs/en/jobs/996246/senior-software-dev-engineer",
            location: "Seattle, WA",
            position: "Senior Software Dev Engineer",
            status: "Phone Screen",
            userID: 1,
        },
        {
            applicationID: 2,
            companyID: 1,
            datetime: new Date("2022-01-02T05:00:00.000Z"),
            jobID: 2,
            jobPostingURL: "https://www.amazon.jobs/en/jobs/981888/chip-design-engineer",
            location: "Tel Aviv, Israel",
            position: "Chip Design Engineer",
            status: "Applied",
            userID: 1,
        },
    ];
    expect(result).toStrictEqual(expected);
});

test("Get non-existant user apps", async () => {
    const result = await appModel.getUserApps(100);
    expect(result).toStrictEqual([]);
});

test("Create new user app", async () => {
    const payload = {
        userID: 2,
        jobID: 3,
        status: "pending",
        location: "remote",
        datetime: new Date(),
    };
    const result = await appModel.createApp(payload);
    expect(result).toEqual(6);
});

test("Update valid user app status", async () => {
    const result = await appModel.updateAppStatus(4, "Interview");
    expect(result).toBe(true);
});

test("Update non-existant user app status", async () => {
    const result = await appModel.updateAppStatus(100, "Interview");
    expect(result).toBe(false);
});
