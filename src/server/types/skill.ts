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

// TODO - what is the rating limit? is there a name length limit?
export const skillValidators = {
    skillID: (v: any) => typeof v === "number",
    applicationID: (v: any) => typeof v === "number",
    userID: (v: any) => typeof v === "number",
    name: (v: any) => typeof v === "string",
    rating: (v: any) => typeof v === "number",
};
