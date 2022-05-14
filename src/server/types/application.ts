import { BaseValidator, Validators } from "./validators";

export interface AppFields {
    applicationID?: number;
    companyID: number;
    userID: number;
    jobPostingURL: string;
    position: string;
    status: string;
    location?: string | null;
    notes?: string | null;
    datetime: Date;
}

export interface ContactFields {
    contactID?: number;
    applicationID: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
    emailAddress?: string | null;
    role?: string | null;
}

export interface ContactAndAppFields extends ContactFields, AppFields {
    applicationID: number;
}

export interface ReturnedAppFields extends AppFields {
    applicationID: number;
    companyName: string;
    contacts: ContactFields[] | null;
}

// https://www.typescriptlang.org/docs/handbook/2/classes.html#this-types
// https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members
export class Application extends BaseValidator<AppFields> {
    constructor(input: any) {
        const { applicationID, companyID, jobPostingURL, position, userID, status, location, notes } = input;
        const datetime = input.datetime === undefined ? new Date() : input.datetime;
        super({ applicationID, companyID, jobPostingURL, position, userID, status, location, notes, datetime });
    }

    validators: Validators<AppFields> = {
        applicationID: (v: any) => typeof v === "number",
        companyID: (v: any) => typeof v === "number",
        jobPostingURL: (v: any) => typeof v === "string",
        position: (v: any) => typeof v === "string",
        userID: (v: any) => typeof v === "number",
        status: (v: any) => typeof v === "string",
        location: (v: any) => typeof v === "string",
        notes: (v: any) => typeof v === "string",
        datetime: (v: any) => v instanceof Date,
    };
}

export class Contact extends BaseValidator<ContactFields> {
    constructor(input: any) {
        const { contactID, applicationID, firstName, lastName, phoneNumber, emailAddress, role } = input;
        super({ contactID, applicationID, firstName, lastName, phoneNumber, emailAddress, role });
    }

    validators: Validators<ContactFields> = {
        contactID: (v: any) => typeof v === "number",
        applicationID: (v: any) => typeof v === "number",
        firstName: (v: any) => typeof v === "string",
        lastName: (v: any) => typeof v === "string",
        phoneNumber: (v: any) => typeof v === "string",
        emailAddress: (v: any) => typeof v === "string",
        role: (v: any) => typeof v === "string",
    };
}
