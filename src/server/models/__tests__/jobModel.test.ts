import * as jobModel from "../jobModel";

test("Get job by ID", async () => {
    const result = await jobModel.getJobByID(1);
    const expected = {
        jobID: 1,
        companyID: 1,
        jobPostingURL: "https://www.amazon.jobs/en/jobs/996246/senior-software-dev-engineer",
        position: "Senior Software Dev Engineer",
    };
    expect(result).toStrictEqual(expected);
});

test("Get job by URL", async () => {
    const result = await jobModel.getJobByURL("https://www.amazon.jobs/en/jobs/996246/senior-software-dev-engineer");
    const expected = {
        jobID: 1,
        companyID: 1,
        jobPostingURL: "https://www.amazon.jobs/en/jobs/996246/senior-software-dev-engineer",
        position: "Senior Software Dev Engineer",
    };
    expect(result).toStrictEqual(expected);
});

test("Create job - valid entry", async () => {
    const payload = {
        companyID: 1,
        jobPostingURL: "https://www.test.com",
        position: "Test Position",
    };
    const result = await jobModel.createJob(payload);
    expect(result).toStrictEqual(true);
});

test("Create job - duplicate entry", async () => {
    const payload = {
        companyID: 1,
        jobPostingURL: "https://www.amazon.jobs/en/jobs/996246/senior-software-dev-engineer",
        position: "Senior Software Dev Engineer",
    };
    const result = await jobModel.createJob(payload);
    expect(result).toStrictEqual(false);
});
