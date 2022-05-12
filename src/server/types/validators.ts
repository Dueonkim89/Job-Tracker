import { appValidators } from "./application";

export function parseStringID(id: any): number | null {
    if (typeof id !== "string") {
        return null;
    }
    const parsedID = parseInt(id);
    if (isNaN(parsedID)) {
        return null;
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
                return { isValid: false, message: `Missing: ${requiredKey}` };
            }
        }
        // for all keys, ensure if that they are present, their types are as specified
        const validatedFields = {} as any;
        for (const key in input) {
            const val = input[key];
            if (typeof val === "undefined" || val === null) {
                continue;
            } else if (!(key in validators) || !validators[key](val)) {
                return { isValid: false, message: `Invalid: ${key}` };
            } else {
                validatedFields[key] = val;
            }
        }
        return { isValid: true, fields: validatedFields };
    };
}

export const validateApp = validatorCurry(appValidators);
