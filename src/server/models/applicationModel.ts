import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "./db";

// Converts JS date object into a string format for MySQL: '2022-04-24 20:52:48'
function convertDateTime(datetime: Date) {
    const [date, timestamp] = datetime.toISOString().split("T");
    const [time, fracseconds] = timestamp.split(".");
    return `${date} ${time}`;
}

export interface AppFields {
    applicationID?: number;
    companyID: number;
    jobPostingURL: string;
    position: string;
    userID: number;
    status: string;
    location: string;
    datetime: Date;
}

/**
 * @returns all applications for the given userID
 */
export async function getUserApps(userID: number) {
    const sql = `SELECT * FROM Applications WHERE Applications.userID = ?`;
    const [rows, fields] = <[RowDataPacket[], FieldPacket[]]>await db.query(sql, [userID]);
    return rows as AppFields[];
}

/**
 * Inserts a new application into the database
 * @returns the applicationID
 */
export async function createApp(p: AppFields) {
    const sql = `
    INSERT INTO Applications
    (companyID, jobPostingURL, position, userID, status, location, datetime)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const vals = [p.companyID, p.jobPostingURL, p.position, p.userID, p.status, p.location, p.datetime];
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.query(sql, vals);
    return result.insertId;
}

/**
 * Updates the status of the given application
 * @returns true if the update was successful, else false (e.g. applicationID doesn't exist)
 */
export async function updateAppStatus(applicationID: number, status: string) {
    const sql = `
    UPDATE Applications
    SET status = ?
    WHERE applicationID = ?;
    `;
    const vals = [status, applicationID];
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.query(sql, vals);
    return result.affectedRows > 0;
}
