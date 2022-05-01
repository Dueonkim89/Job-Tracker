import * as commentModel from "../commentModel";

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
        },
    ];
    expect(result).toEqual(expected);
});

test("Create a new comment", async () => {
    const payload = {
        companyID: 1,
        userID: 1,
        title: "Not a great company",
        text: "Did not like my chat!",
    };
    const result = await commentModel.createComment(payload);
    expect(result).toBeGreaterThan(3);
});
