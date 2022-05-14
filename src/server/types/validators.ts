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

export interface Validators {
    [key: string]: (val: any) => boolean;
}

interface Input {
    [key: string]: any;
}

export type RequiredKeys<T, K extends keyof T> = Exclude<T, K> & Required<Pick<T, K>>;

export abstract class BaseValidator<T> {
    fields: Readonly<Partial<T>>;
    abstract validators: { [Property in keyof T as string]: (val: any) => boolean };

    constructor(fields: Partial<T>) {
        this.fields = fields;
    }

    validateAndAssertContains<Key extends keyof T>(
        keys: Key[]
    ): asserts this is this & { fields: RequiredKeys<Partial<T>, Key> } {
        // ensure that required keys are present
        for (const key of keys) {
            if (this.fields[key] === undefined) throw new ValidationError(`Missing: ${key}`);
        }
        // for any keys that are  present, ensure their inputs are valid
        for (const key in this.fields) {
            const val = this.fields[key];
            if (val !== undefined) {
                if (!(key in this.validators) || !this.validators[key](val))
                    throw new ValidationError(`Invalid input: ${key}`);
            }
        }
    }
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

export const validateCompany = validatorCurry(companyValidators);
export const validateSkill = validatorCurry(skillValidators);
export const validateUser = validatorCurry(userValidators);
export const validateComment = validatorCurry(commentValidators);

export function checkReqAuth(reqID: number, userID: number) {
    if (reqID !== userID) {
        throw new AuthError("User does not have access to that resource");
    }
}
