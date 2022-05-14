import { BaseValidator, Validators } from "./validators";

export interface CompanyFields {
    companyID?: number;
    name: string;
    industry?: string | null;
    websiteURL?: string | null;
}

export class Company extends BaseValidator<CompanyFields> {
    constructor(input: any) {
        const { companyID, name, industry, websiteURL } = input;
        super({ companyID, name, industry, websiteURL });
    }

    validators: Validators<CompanyFields> = {
        companyID: (v: any) => typeof v === "number",
        name: (v: any) => typeof v === "string",
        industry: (v: any) => typeof v === "string",
        websiteURL: (v: any) => typeof v === "string",
    };
}
