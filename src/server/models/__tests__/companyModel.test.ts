import * as companyModel from "../companyModel";

test("Get company by ID", async () => {
    const result = await companyModel.getCompanyByID(1);
    const expected = { companyID: 1, industry: "Technology", name: "Amazon", websiteURL: "www.amazon.com" };
    expect(result).toStrictEqual(expected);
});
