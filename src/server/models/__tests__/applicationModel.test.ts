import * as appModel from "../applicationModel";

test("testing #1", async () => {
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

// const sum = (a: number, b: number) => a + b;

// test("adds 1 + 2 to equal 3", () => {
//     expect(sum(1, 2)).toBe(3);
// });
