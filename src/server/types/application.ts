export interface AppFields {
    applicationID?: number;
    companyID: number;
    jobPostingURL: string;
    position: string;
    userID: number;
    status: string;
    location: string;
    notes: string;
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
