import { CompanyFields } from "./company";
import { BaseValidator, Validators } from "./validators";

export interface CommentFields {
    commentID?: number;
    userID: number;
    companyID: number;
    title: string;
    text: string;
    datetime: Date;
}

export interface ReturnedCommentFields extends CommentFields {
    commentID: number;
}

export class CompanyComment extends BaseValidator<CommentFields> {
    constructor(input: any) {
        const { commentID, userID, companyID, title, text, datetime } = input;
        super({ commentID, userID, companyID, title, text, datetime });
    }

    validators: Validators<CommentFields> = {
        commentID: (v: any) => typeof v === "number",
        userID: (v: any) => typeof v === "number",
        companyID: (v: any) => typeof v === "number",
        title: (v: any) => typeof v === "string",
        text: (v: any) => typeof v === "string",
        datetime: (v: any) => v instanceof Date,
    };
}
