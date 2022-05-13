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

// TODO - regex validation for phone and email
export const commentValidators = {
    commentID: (v: any) => typeof v === "number",
    userID: (v: any) => typeof v === "number",
    companyID: (v: any) => typeof v === "number",
    title: (v: any) => typeof v === "string",
    text: (v: any) => typeof v === "string",
    datetime: (v: any) => v instanceof Date,
};
