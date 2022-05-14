import { BaseValidator, Validators } from "./validators";

export interface SkillFields {
    skillID?: number;
    name: string;
}

export interface UserSkillFields extends SkillFields {
    skillID: number;
    userID: number;
    rating: number;
}

export interface ApplicationSkillFields extends SkillFields {
    skillID: number;
    applicationID: number;
}

export class Skill extends BaseValidator<SkillFields & UserSkillFields & ApplicationSkillFields> {
    constructor(input: any) {
        const { skillID, name, userID, rating, applicationID } = input;
        super({ skillID, name, userID, rating, applicationID });
    }

    // TODO - what is the rating limit? is there a name length limit?
    validators: Validators = {
        skillID: (v: any) => typeof v === "number",
        applicationID: (v: any) => typeof v === "number",
        userID: (v: any) => typeof v === "number",
        name: (v: any) => typeof v === "string",
        rating: (v: any) => typeof v === "number",
    };
}
