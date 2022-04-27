import * as userModel from "../userModel";

test("Get user by ID", async () => {
    const result = await userModel.getUserByID(1);
    const expected = {
        emailAddress: "ally1@email.com",
        firstName: "Ally",
        lastName: "Alpha",
        passwordHash: "$2b$10$iR7a0nydA2ylmNsVHw77DONjNglrP9CDYiyrbPuogG7lw4Zmuacne",
        phoneNumber: "111-111-1111",
        userID: 1,
        username: "ally1",
    };
    expect(result).toEqual(expected);
});

test("Get user by ID: no entry", async () => {
    const result = await userModel.getUserByID(100);
    expect(result).toEqual(null);
});

test("Get user by username", async () => {
    const result = await userModel.getUserByUsername("ally1");
    const expected = {
        emailAddress: "ally1@email.com",
        firstName: "Ally",
        lastName: "Alpha",
        passwordHash: "$2b$10$iR7a0nydA2ylmNsVHw77DONjNglrP9CDYiyrbPuogG7lw4Zmuacne",
        phoneNumber: "111-111-1111",
        userID: 1,
        username: "ally1",
    };
    expect(result).toEqual(expected);
});

test("Get user by username: no entry", async () => {
    const result = await userModel.getUserByUsername("svsafsd");
    expect(result).toEqual(null);
});

test("Create user", async () => {
    const payload = {
        emailAddress: "test@email.com",
        firstName: "TestF",
        lastName: "TestL",
        passwordHash: "$2b$10$iR7a0nydA2ylmNsVHw77DONjNglrP9CDYiyrbPuogG7lw4Zmuacne",
        phoneNumber: "999-999-1234",
        username: "test1",
    };
    const result = await userModel.createUser(payload);
    expect(result).toEqual(4);
});
