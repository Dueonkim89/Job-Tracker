import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "./db";

export interface CommentFields {
    commentID?: number;
    userID: number;
    companyID: number;
    title: string;
    text: string;
}

interface AllCommentFields extends CommentFields {
    commentID: number;
}

/**
 * @returns all comments for the given companyID
 */
export async function getCompanyComments(companyID: number) {
    const sql = `SELECT * FROM CompanyComments WHERE companyID = ?`;
    const [rows, fields] = <[RowDataPacket[], FieldPacket[]]>await db.promise().query(sql, [companyID]);
    return rows as AllCommentFields[];
}

/**
 * Inserts a new comment into the database
 * @returns the commentID
 */
export async function createComment(p: CommentFields) {
    const sql = `
    INSERT INTO CompanyComments
    (userID, companyID, title, text)
    VALUES (?, ?, ?, ?);
    `;
    const vals = [p.userID, p.companyID, p.title, p.text];
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
    return result.insertId;
}
