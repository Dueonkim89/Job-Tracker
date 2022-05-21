export function isValidURL(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

export function isValidPhone(phoneNumber: string): boolean {
    // neeeds to be like: "123-456-7890"
    return /[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(phoneNumber);
}

export function isValidEmail(emailAddress: string): boolean {
    // Copied from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#validation
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        emailAddress
    );
}
