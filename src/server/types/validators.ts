import { appValidators, contactValidators } from "./application";
import { commentValidators } from "./comment";
import { companyValidators } from "./company";
import { skillValidators } from "./skill";
import { userValidators } from "./user";

// Source: https://javascript.info/custom-errors
// https://www.dannyguo.com/blog/how-to-fix-instanceof-not-working-for-custom-errors-in-typescript/
export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthError";
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}

export function parseStringID(id: any): number {
    if (typeof id !== "string") {
        throw new ValidationError("ID is not a string datatype.");
    }
    const parsedID = parseInt(id);
    if (isNaN(parsedID)) {
        throw new ValidationError("ID can not be converted to a number.");
    }
    return parsedID;
}

interface Validators {
    [key: string]: (val: any) => boolean;
}

interface Input {
    [key: string]: any;
}

function validatorCurry(validators: Validators) {
    return function (input: Input, requiredKeys: string[]) {
        // if a key is required, ensure it is present in the input
        const inputKeys = Object.keys(input);
        for (const requiredKey of requiredKeys) {
            if (
                !inputKeys.includes(requiredKey) ||
                typeof input[requiredKey] === "undefined" ||
                input[requiredKey] === null
            ) {
                throw new ValidationError(`Missing: ${requiredKey}`);
            }
        }
        // for all keys, ensure if that they are present, their types are as specified
        for (const key in input) {
            const val = input[key];
            if (typeof val === "undefined" || val === null) {
                continue;
            } else if (!(key in validators) || !validators[key](val)) {
                throw new ValidationError(`Invalid: ${key}`);
            }
        }
        return;
    };
}

export const validateApp = validatorCurry(appValidators);
export const validateContact = validatorCurry(contactValidators);
export const validateCompany = validatorCurry(companyValidators);
export const validateSkill = validatorCurry(skillValidators);
export const validateUser = validatorCurry(userValidators);
export const validateComment = validatorCurry(commentValidators);

export function checkReqAuth(reqID: number, userID: number) {
    if (reqID !== userID) {
        throw new AuthError("User does not have access to that resource");
    }
}
