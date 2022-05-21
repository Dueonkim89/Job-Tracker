import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../config/db";

export default {
    async saveResetID(resetID: string, emailAddress: string, datetime: Date) {
        const sql = `
        INSERT INTO PasswordResets
        (resetID, emailAddress, datetime)
        VALUES (?, ?, ?);
        `;
        const vals = [resetID, emailAddress, datetime];
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        return result.insertId;
    },
};
