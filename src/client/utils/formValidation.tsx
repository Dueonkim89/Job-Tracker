function validStringData(userData: string) : boolean {
    return !userData ? false : true;
}

function validIntData(userData: number) : boolean {
    return !userData ? false : true;
}

function validPassword(password: string) : boolean {
    // regex from https://stackoverflow.com/questions/5859632/regular-expression-for-password-validation
    // Tests for: at least 1 upper case and lower case letter, 1 number, length 8  - 32 characters.
    return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(password);
}

export {validStringData, validIntData, validPassword}