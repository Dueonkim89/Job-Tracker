import * as skillModel from "../skillModel";

test("Get user 1 skills", async () => {
    const result = await skillModel.getUserSkills(1);
    const expected = [
        { userID: 1, name: "Java", skillID: 1, rating: 5 },
        { userID: 1, name: "C++", skillID: 2, rating: 3 },
    ];
    expect(result).toContainEqual(expected[0]);
    expect(result).toContainEqual(expected[1]);
});

test("Get application 1 skills", async () => {
    const result = await skillModel.getApplicationSkills(1);
    result.sort((a, b) => (a.skillID as number) - (b.skillID as number));
    const expected = [
        { applicationID: 1, name: "Java", skillID: 1 },
        { applicationID: 1, name: "C++", skillID: 2 },
    ];
    expect(result.slice(0, 2)).toEqual(expected);
});

test("Get all skills", async () => {
    const result = await skillModel.getAllSkills();
    const expected = [
        { name: "Java", skillID: 1 },
        { name: "Go", skillID: 8 },
    ];
    expect(result).toContainEqual(expected[0]);
    expect(result).toContainEqual(expected[1]);
});

test("Create new skill", async () => {
    const payload = { name: "Scala" };
    const result = await skillModel.createSkill(payload);
    expect(result).toBeGreaterThan(9);
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

test("Update user skill rating", async () => {
    const result = await skillModel.updateUserSkillRating(2, 6, 5);
    expect(result).toEqual(true);
});
