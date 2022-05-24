import { BaseValidator, ValidationError, Validators } from "./validators";

export type SkillFields = {
    skillID?: number;
    name: string;
};

export type UserSkillFields = {
    skillID: number;
    userID: number;
    rating: number;
};

export type ApplicationSkillFields = {
    skillID: number;
    applicationID: number;
};

export class Skill extends BaseValidator<SkillFields & UserSkillFields & ApplicationSkillFields> {
    constructor(input: any) {
        const { skillID, name, userID, rating, applicationID } = input;
        super({ skillID, name, userID, rating, applicationID });
    }

    validators: Validators<SkillFields & UserSkillFields & ApplicationSkillFields> = {
        skillID: (v: any) => typeof v === "number",
        applicationID: (v: any) => typeof v === "number",
        userID: (v: any) => typeof v === "number",
        name: (v: any) => typeof v === "string",
        rating: (v: any) => typeof v === "number" && [0, 1, 2, 3, 4, 5].includes(v),
    };
}
