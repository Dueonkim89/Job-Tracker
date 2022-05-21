import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../config/db";
import { PWReset } from "../types/pwReset";

export default {
    async saveResetRequest(resetID: string, userID: number, emailAddress: string, datetime: Date) {
        const sql = `
        INSERT INTO PasswordResets
        (resetID, userID, emailAddress, datetime)
        VALUES (?, ?, ?, ?);
        `;
        const vals = [resetID, userID, emailAddress, datetime];
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        return result.insertId;
    },

    async getResetRequest(resetID: string) {
        const sql = `SELECT * FROM PasswordResets WHERE resetID = ?`;
        const vals = [resetID];
        const [result, fields] = <[RowDataPacket[], FieldPacket[]]>await db.promise().query(sql, vals);
        if (result.length === 0) {
            return null;
        } else if (result.length > 1) {
            return null;
        } else {
            return result[0] as PWReset;
        }
    },
};
