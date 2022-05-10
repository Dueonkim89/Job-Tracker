import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "./db";

export interface AppFields {
    applicationID?: number;
    companyID: number;
    jobPostingURL: string;
    position: string;
    userID: number;
    status: string;
    location: string;
    notes: string;
    datetime: Date;
}

export interface ContactFields {
    contactID?: number;
    applicationID: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    role: string;
}

interface AppReturnedFields extends AppFields {
    applicationID: number;
    companyName: string;
    contacts: ContactFields[] | null;
}

/**
 * @returns all applications for the given userID
 */
export async function getUserApps(userID: number) {
    const sql = `
    SELECT app.applicationID, app.companyID, app.jobPostingURL, app.position, 
        app.userID, app.status, app.location, app.notes, comp.name AS companyName,
        convert_tz(app.\`datetime\`, '+00:00', @@session.time_zone) AS datetime,
        cnct.contacts AS contacts
    FROM Applications AS app
    LEFT JOIN 
        (SELECT applicationID,
        JSON_ARRAYAGG(JSON_OBJECT('contactID', contactID, 'firstName', firstName, 'lastName', lastName, 
            'emailAddress', emailAddress, 'phoneNumber', phoneNumber, 'role', role)) AS contacts
        FROM ApplicationContacts
        GROUP BY applicationID) AS cnct
        ON app.applicationID = cnct.applicationID
    LEFT JOIN Companies AS comp 
        ON app.companyID = comp.companyID
    WHERE app.userID = ?;
    `;
    const [rows, fields] = <[RowDataPacket[], FieldPacket[]]>await db.promise().query(sql, [userID]);
    return rows as AppReturnedFields[];
}

/**
 * Inserts a new application into the database
 * @returns the applicationID
 */
export async function createApp(p: AppFields) {
    const sql = `
    INSERT INTO Applications
    (companyID, jobPostingURL, position, userID, status, location, notes, datetime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const vals = [p.companyID, p.jobPostingURL, p.position, p.userID, p.status, p.location, p.notes, p.datetime];
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
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
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
    return result.affectedRows > 0;
}

/**
 * Creates a new contact for an application
 * @returns the contactID if successful
 */
export async function createContact(p: ContactFields) {
    const sql = `
    INSERT INTO ApplicationContacts
    (applicationID, firstName, lastName, emailAddress, phoneNumber, role)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const vals = [p.applicationID, p.firstName, p.lastName, p.emailAddress, p.phoneNumber, p.role];
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
    return result.insertId;
}
