export interface CompanyFields {
    companyID?: number;
    name: string;
    industry: string;
    websiteURL: string;
}

export const companyValidators = {
    companyID: (v: any) => typeof v === "number",
    name: (v: any) => typeof v === "string",
    industry: (v: any) => typeof v === "string",
    websiteURL: (v: any) => typeof v === "string",
};
