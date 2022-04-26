import * as companyModel from "../companyModel";

test("Get company by ID", async () => {
    const result = await companyModel.getCompanyByID(1);
    const expected = { companyID: 1, industry: "Technology", name: "Amazon", websiteURL: "www.amazon.com" };
    expect(result).toStrictEqual(expected);
});

test("Get company by ID: invalid ID", async () => {
    const result = await companyModel.getCompanyByID(100);
    const expected = null;
    expect(result).toStrictEqual(expected);
});

test("Get company by name", async () => {
    const result = await companyModel.getCompanyByName("Amazon");
    const expected = { companyID: 1, industry: "Technology", name: "Amazon", websiteURL: "www.amazon.com" };
    expect(result).toStrictEqual(expected);
});

test("Get company by name: invalid name", async () => {
    const result = await companyModel.getCompanyByName("sdfasfsfsfs");
    const expected = null;
    expect(result).toStrictEqual(expected);
});

test("Search companies by name: many results", async () => {
    const result = await companyModel.searchCompaniesByName("");
    const expected = [
        { companyID: 1, industry: "Technology", name: "Amazon", websiteURL: "www.amazon.com" },
        { companyID: 2, industry: "Technology", name: "Blackbaud", websiteURL: "www.blackbaud.com" },
        { companyID: 3, industry: "Technology", name: "Cloudera", websiteURL: "www.cloudera.com" },
    ];
    expect(result).toStrictEqual(expected);
});

test("Search companies by name: single result", async () => {
    const result = await companyModel.searchCompaniesByName("ama");
    const expected = [{ companyID: 1, industry: "Technology", name: "Amazon", websiteURL: "www.amazon.com" }];
    expect(result).toStrictEqual(expected);
});

test("Search companies by name: no results", async () => {
    const result = await companyModel.searchCompaniesByName("sfsfwfw");
    expect(result).toStrictEqual([]);
});

test("Create company", async () => {
    const payload = { industry: "Technology", name: "Test", websiteURL: "www.test.com" };
    const result = await companyModel.createCompany(payload);
    expect(result).toEqual(4);
});
