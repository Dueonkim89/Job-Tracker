import { FieldPacket, RowDataPacket } from "mysql2";
import db from "./db";
import { JobFields } from "./jobModel";

// Converts JS date object into a string format for MySQL: '2022-04-24 20:52:48'
function convertDateTime(datetime: Date) {
    const [date, timestamp] = datetime.toISOString().split("T");
    const [time, fracseconds] = timestamp.split(".");
    return `${date} ${time}`;
}

export interface AppFields {
    applicationID?: number;
    userID: number;
    jobID: number;
    status: string;
    location: string;
    datetime: Date;
}

export interface AppJobFields extends AppFields, JobFields {
    applicationID: number;
    jobID: number;
}

/**
 * @returns all applications and corresponding job info for the given userID
 */
export async function getUserApps(userID: number) {
    const sql = `
    SELECT apps.*, jobs.* FROM Applications AS apps
    JOIN Jobs AS jobs ON apps.jobID = jobs.jobID
    WHERE apps.userID = ?
    `;
    const [rows, fields] = <[RowDataPacket[], FieldPacket[]]>await db.query(sql, [userID]);
    if (Array.isArray(rows) && rows.length > 0) {
        return rows as AppJobFields[];
    } else {
        return null;
    }
}

/**
 * Inserts a new application into the database
 * @returns the applicationID
 */
export async function createApp(p: AppFields) {
    const sql = `
    INSERT INTO Applications
    (userID, jobID, status, location, datetime)
    VALUES (?, ?, ?, ?, ?);
    SELECT last_insert_id();
    `;
    const vals = [p.userID, p.jobID, p.status, p.location, convertDateTime(p.datetime)];
    const [rows, fields] = <[RowDataPacket[], FieldPacket[]]>await db.query(sql, vals);
    return rows[0].last_insert_id as number;
}

/**
 * Updates the status of the given application
 */
export async function updateAppStatus(applicationID: number, status: string) {
    const sql = `
    UPDATE Applications
    SET status = ?
    WHERE applicationID = ?;
    `;
    const vals = [status, applicationID];
    await db.query(sql, vals);
    return true;
}
