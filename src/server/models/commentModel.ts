import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../config/db";

export interface CommentFields {
    commentID?: number;
    userID: number;
    companyID: number;
    title: string;
    text: string;
    datetime: Date;
}

interface ReturnedCommentFields extends CommentFields {
    commentID: number;
}

export default {
    /**
     * @returns all comments for the given companyID
     */
    async getCompanyComments(companyID: number) {
        const sql = `
        SELECT commentID, userID, companyID, title, text, 
        convert_tz(\`datetime\`, '+00:00', @@session.time_zone) AS datetime
        FROM CompanyComments WHERE companyID = ?
        `;
        const [rows, fields] = <[RowDataPacket[], FieldPacket[]]>await db.promise().query(sql, [companyID]);
        return rows as ReturnedCommentFields[];
    },

    /**
     * Inserts a new comment into the database
     * @returns the commentID
     */
    async createComment(p: CommentFields) {
        const sql = `
        INSERT INTO CompanyComments
        (userID, companyID, title, text, datetime)
        VALUES (?, ?, ?, ?, ?);
        `;
        const vals = [p.userID, p.companyID, p.title, p.text, p.datetime];
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        return result.insertId;
    },
};
