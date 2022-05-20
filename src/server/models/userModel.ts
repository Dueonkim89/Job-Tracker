import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../config/db";
import { ReturnedUserFields, UserFields } from "../types/user";

function userOrNull(rows: RowDataPacket[]) {
    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as ReturnedUserFields;
    } else {
        return null;
    }
}

export default {
    async createUser(p: UserFields) {
        const sql = `
        INSERT INTO Users
        (firstName, lastName, username, phoneNumber, emailAddress, passwordHash)
        VALUES (?, ?, ?, ?, ?, ?);
        `;
        const vals = [p.firstName, p.lastName, p.username, p.phoneNumber, p.emailAddress, p.passwordHash];
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        return result.insertId;
    },

    async getAllUsers() {
        const sql = "SELECT * FROM `Users`";
        const [rows, fields] = await db.promise().query(sql);
        return rows as ReturnedUserFields[];
    },

    async getUserByID(userID: number) {
        const sql = "SELECT * FROM `Users` WHERE userID = ?";
        const [rows, fields] = await db.promise().query(sql, [userID]);
        return userOrNull(rows as RowDataPacket[]);
    },

    async getUserByUsername(username: string) {
        const sql = "SELECT * FROM `Users` WHERE username = ?";
        const [rows, fields] = await db.promise().query(sql, [username]);
        return userOrNull(rows as RowDataPacket[]);
    },

    async getUserByEmailAddress(emailAddress: string) {
        const sql = "SELECT * FROM `Users` WHERE emailAddress = ?";
        const [rows, fields] = await db.promise().query(sql, [emailAddress]);
        return userOrNull(rows as RowDataPacket[]);
    },
};
