import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../config/db";

export default {
    async saveResetID(resetID: string, userID: number, emailAddress: string, datetime: Date) {
        const sql = `
        INSERT INTO PasswordResets
        (resetID, userID, emailAddress, datetime)
        VALUES (?, ?, ?, ?);
        `;
        const vals = [resetID, userID, emailAddress, datetime];
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        return result.insertId;
    },
};
