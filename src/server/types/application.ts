export interface AppFields {
    applicationID?: number;
    companyID: number;
    userID: number;
    jobPostingURL: string;
    position: string;
    status: string;
    location: string | null;
    notes: string | null;
    datetime: Date;
}

export interface ContactFields {
    contactID?: number;
    applicationID: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    role: string;
}

export interface ContactAndAppFields extends ContactFields, AppFields {
    applicationID: number;
}

export interface ReturnedAppFields extends AppFields {
    applicationID: number;
    companyName: string;
    contacts: ContactFields[] | null;
}

export const appValidators = {
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

// TODO - regex validation for phone and email
export const contactValidators = {
    contactID: (v: any) => typeof v === "number",
    applicationID: (v: any) => typeof v === "number",
    firstName: (v: any) => typeof v === "string",
    lastName: (v: any) => typeof v === "string",
    phoneNumber: (v: any) => typeof v === "string",
    emailAddress: (v: any) => typeof v === "string",
    role: (v: any) => typeof v === "string",
};
