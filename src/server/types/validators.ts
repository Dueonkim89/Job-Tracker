import { AppFields, appValidators, contactValidators } from "./application";
import { CompanyFields, companyValidators } from "./company";

// Source: https://javascript.info/custom-errors
export class ValidationError extends Error {
    constructor(message: string) {
        super(message); // (1)
        this.name = "ValidationError";
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
        return true;
    };
}

export const validateApp = validatorCurry(appValidators);
export const validateContact = validatorCurry(contactValidators);
export const validateCompany = validatorCurry(companyValidators);
