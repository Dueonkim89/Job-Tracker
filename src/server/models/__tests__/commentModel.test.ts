import commentModel from "../commentModel";

test("Get company 1 comments", async () => {
    const result = await commentModel.getCompanyComments(1);
    result.sort((a, b) => a.commentID - b.commentID);
    const expected = [
        {
            commentID: 1,
            companyID: 1,
            userID: 1,
            title: "Great Company",
            text: "Really loved my chat with the hiring manager!",
            datetime: new Date("2022-01-01T00:00:00.000Z"),
        },
    ];
    expect(result).toEqual(expected);
});

test("Get non-existant company comments", async () => {
    const result = await commentModel.getCompanyComments(100);
    result.sort((a, b) => a.commentID - b.commentID);
    expect(result).toEqual([]);
});

test("Create a new comment", async () => {
    const payload = {
        companyID: 3,
        userID: 3,
        title: "Not a great company",
        text: "Did not like my chat!",
        datetime: new Date("2022-01-04T00:00:00.000Z"),
    };
    const result = await commentModel.createComment(payload);
    expect(result).toBeGreaterThan(3);
});
