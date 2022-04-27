import * as skillModel from "../skillModel";

test("Get user 2 skills", async () => {
    const result = await skillModel.getUserSkills(2);
    const expected = [
        { name: "Microsoft Azure", rating: 5, skillID: 5, userID: 2 },
        { name: "AWS", rating: 4, skillID: 6, userID: 2 },
    ];
    expect(result).toEqual(expected);
});

test("Get application 1 skills", async () => {
    const result = await skillModel.getApplicationSkills(1);
    const expected = [
        { applicationID: 1, name: "Java", skillID: 1 },
        { applicationID: 1, name: "C++", skillID: 2 },
    ];
    expect(result).toEqual(expected);
});

test("Get all skills", async () => {
    const result = await skillModel.getAllSkills();
    result.sort((a, b) => (a.skillID as number) - (b.skillID as number));
    const expected = [
        {
            name: "Java",
            skillID: 1,
        },
        {
            name: "C++",
            skillID: 2,
        },
        {
            name: "C",
            skillID: 3,
        },
        {
            name: "Verilog",
            skillID: 4,
        },
        {
            name: "Microsoft Azure",
            skillID: 5,
        },
        {
            name: "AWS",
            skillID: 6,
        },
        {
            name: "Python",
            skillID: 7,
        },
        {
            name: "Go",
            skillID: 8,
        },
        {
            name: "Hadoop",
            skillID: 9,
        },
    ];
    expect(result).toEqual(expected);
});

test("Create new skill", async () => {
    const payload = { name: "Scala" };
    const result = await skillModel.createSkill(payload);
    expect(result).toEqual(10);
});

test("Create new user skill", async () => {
    const payload = { userID: 1, skillID: 9, name: "Hadoop", rating: 5 };
    const result = await skillModel.createUserSkill(payload);
    expect(result).toEqual(true);
});

test("Create new application skill", async () => {
    const payload = { applicationID: 1, skillID: 9, name: "Hadoop" };
    const result = await skillModel.createApplicationSkill(payload);
    expect(result).toEqual(true);
});