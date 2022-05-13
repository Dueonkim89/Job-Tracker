export interface UserFields {
    userID?: number;
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string | null;
    emailAddress: string;
    passwordHash: string;
}

export interface ReturnedUserFields extends UserFields {
    userID: number;
}

// TODO - regex validation for phone and email, username as well
export const userValidators = {
    userID: (v: any) => typeof v === "number",
    firstName: (v: any) => typeof v === "string",
    lastName: (v: any) => typeof v === "string",
    username: (v: any) => typeof v === "string",
    phoneNumber: (v: any) => typeof v === "string",
    emailAddress: (v: any) => typeof v === "string",
    passwordHash: (v: any) => typeof v === "string",
};
