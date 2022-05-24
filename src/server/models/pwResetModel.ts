import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../config/db";
import { PWReset } from "../types/pwReset";

export default {
    async saveResetRequest(emailAddress: string, userID: number, hashedResetID: string, datetime: Date) {
        const sql = `
        INSERT INTO PasswordResets
        (emailAddress, userID, hashedResetID, datetime)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        hashedResetID = ?, datetime = ?;
        `;
        const vals = [emailAddress, userID, hashedResetID, datetime, hashedResetID, datetime];
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        return result.insertId;
    },

    async getResetRequest(emailAddress: string) {
        const sql = `SELECT * FROM PasswordResets WHERE emailAddress = ?`;
        const vals = [emailAddress];
        const [result, fields] = <[RowDataPacket[], FieldPacket[]]>await db.promise().query(sql, vals);
        if (result.length === 0) {
            return null;
        } else if (result.length > 1) {
            return null;
        } else {
            return result[0] as PWReset;
        }
    },

    async deleteResetRequest(emailAddress: string) {
        const sql = "DELETE FROM PasswordResets WHERE emailAddress = ?;";
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, [emailAddress]);
        return result.affectedRows === 1;
    },
};
