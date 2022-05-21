import { BaseValidator, Validators } from "./validators";
import { isValidEmail, isValidPhone } from "../../global/inputValidators";

export interface UserFields {
    userID?: number;
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber?: string | null;
    emailAddress: string;
    passwordHash: string;
}

export interface ReturnedUserFields extends UserFields {
    userID: number;
}

export class User extends BaseValidator<UserFields> {
    constructor(input: any) {
        const { userID, firstName, lastName, username, phoneNumber, emailAddress, passwordHash } = input;
        super({ userID, firstName, lastName, username, phoneNumber, emailAddress, passwordHash });
    }

    // TODO - regex validation for phone and email, username as well
    validators: Validators<UserFields> = {
        userID: (v: any) => typeof v === "number",
        firstName: (v: any) => typeof v === "string",
        lastName: (v: any) => typeof v === "string",
        username: (v: any) => typeof v === "string",
        phoneNumber: (v: any) => typeof v === "string" && isValidPhone(v),
        emailAddress: (v: any) => typeof v === "string" && isValidEmail(v),
        passwordHash: (v: any) => typeof v === "string",
    };
}
