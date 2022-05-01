import * as appModel from "../applicationModel";

test("Get user 1 apps", async () => {
    const result = await appModel.getUserApps(1);
    result.sort((a, b) => (a.applicationID as number) - (b.applicationID as number));
    const expected = [
        {
            applicationID: 1,
            companyID: 1,
            jobPostingURL: "https://www.amazon.jobs/en/jobs/996246/senior-software-dev-engineer",
            position: "Senior Software Dev Engineer",
            userID: 1,
            status: "Phone Screen",
            location: "Seattle, WA",
            datetime: new Date("2022-01-01T00:00:00.000Z"),
        },
        {
            applicationID: 2,
            companyID: 1,
            jobPostingURL: "https://www.amazon.jobs/en/jobs/981888/chip-design-engineer",
            position: "Chip Design Engineer",
            userID: 1,
            status: "Applied",
            location: "Tel Aviv, Israel",
            datetime: new Date("2022-01-02T00:00:00.000Z"),
        },
    ];
    expect(result).toEqual(expected);
});

test("Get non-existant user apps", async () => {
    const result = await appModel.getUserApps(100);
    expect(result).toEqual([]);
});

test("Create new user app", async () => {
    const payload = {
        companyID: 1,
        jobPostingURL: "https://www.test.com",
        position: "Test Position",
        userID: 2,
        status: "pending",
        location: "remote",
        datetime: new Date(),
    };
    const result = await appModel.createApp(payload);
    expect(result).toBeGreaterThan(5);
});

test("Update valid user app status", async () => {
    const result = await appModel.updateAppStatus(4, "Interview");
    expect(result).toBe(true);
});

test("Update non-existant user app status", async () => {
    const result = await appModel.updateAppStatus(100, "Interview");
    expect(result).toBe(false);
});
