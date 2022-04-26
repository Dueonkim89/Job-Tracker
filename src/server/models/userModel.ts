import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "./db";

export interface UserFields {
    userID?: number;
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    emailAddress: string;
    passwordHash: string;
}

function userOrNull(rows: RowDataPacket[]) {
    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as UserFields;
    } else {
        return null;
    }
}

export async function createUser(p: UserFields) {
    const sql = `
    INSERT INTO Users
    (firstName, lastName, username, phoneNumber, emailAddress, passwordHash)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const vals = [p.firstName, p.lastName, p.username, p.phoneNumber, p.emailAddress, p.passwordHash];
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.query(sql, vals);
    return result.insertId;
}

export async function getAllUsers() {
    const sql = "SELECT * FROM `Users`";
    const [rows, fields] = await db.query(sql);
    return rows;
}

export async function getUserByID(userID: number) {
    const sql = "SELECT * FROM `Users` WHERE userID = ?";
    const [rows, fields] = await db.query(sql, [userID]);
    return userOrNull(rows as RowDataPacket[]);
}

export async function getUserByUsername(username: string) {
    const sql = "SELECT * FROM `Users` WHERE username = ?";
    const [rows, fields] = await db.query(sql, [username]);
    return userOrNull(rows as RowDataPacket[]);
}
