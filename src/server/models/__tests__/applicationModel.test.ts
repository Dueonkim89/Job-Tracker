import appModel from "../applicationModel";

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
            notes: "here are my notes",
            datetime: new Date("2022-01-01T00:00:00.000Z"),
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
            datetime: new Date("2022-01-02T00:00:00.000Z"),
            companyName: "Amazon",
            contacts: null,
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
        notes: "Notes here!",
        datetime: new Date(),
    };
    const result = await appModel.createApp(payload);
    expect(result).toBeGreaterThan(5);
});

test("Create new app contact", async () => {
    const payload = {
        applicationID: 4,
        firstName: "testfirst",
        lastName: "testlast",
        emailAddress: "test@email.com",
        phoneNumber: "111-111-1293",
        role: "testrole",
    };
    const result = await appModel.createContact(payload);
    expect(result).toBeGreaterThan(4);
});
