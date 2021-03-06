import { Contact } from "./Contact";

export interface Application {
    applicationID : string;
    companyName : string;
    datetime : Date;
    jobPostingURL : string;
    location: string;
    position: string;
    status: string;
    notes: string;
    contacts : Contact[];
}

