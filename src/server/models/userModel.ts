import { RowDataPacket } from "mysql2";
import db from "./db";

interface UserFields {
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    emailAddress: string;
    passwordHash: string;
}

// TBU - finished this function - add additional parameters
export async function createUser(p: UserFields) {
    const sql = `
    INSERT INTO User
    (first_name, last_name, username, phone_number, email_address, passwordHash)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const vals = [p.firstName, p.lastName, p.username, p.phoneNumber, p.emailAddress, p.passwordHash];
    await db.query(sql, vals);
    return true;
}

export async function getAll() {
    const sql = "SELECT * FROM `user`";
    const [rows, fields] = await db.query(sql);
    return rows;
}

function userOrNull(rows: RowDataPacket[]) {
    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as UserFields;
    } else {
        return null;
    }
}

export async function getUserByID(userID: string) {
    const sql = "SELECT * FROM `user` WHERE userID = ?";
    const [rows, fields] = await db.query(sql, [userID]);
    return userOrNull(rows as RowDataPacket[]);
}

export async function getUserByUsername(username: string) {
    const sql = "SELECT * FROM `user` WHERE username = ?";
    const [rows, fields] = await db.query(sql, [username]);
    return userOrNull(rows as RowDataPacket[]);
}
