import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { AppFields, ReturnedAppFields, ContactFields, ContactAndAppFields } from "../types/application";
import db from "../config/db";

export default {
    /**
     * @returns the application corresponding to given applicationID
     */
    async getAppByID(applicationID: number) {
        const sql = "SELECT * FROM Applications WHERE applicationID = ?";
        const [result, fields] = <[RowDataPacket, FieldPacket[]]>await db.promise().query(sql, [applicationID]);
        return result[0] as AppFields;
    },

    /**
     * @returns all applications for the given userID
     */
    async getUserApps(userID: number) {
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
        return rows as ReturnedAppFields[];
    },

    /**
     * Inserts a new application into the database
     * @returns the applicationID
     */
    async createApp(p: AppFields) {
        const sql = `
        INSERT INTO Applications
        (companyID, jobPostingURL, position, userID, status, location, notes, datetime)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const vals = [p.companyID, p.jobPostingURL, p.position, p.userID, p.status, p.location, p.notes, p.datetime];
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        return result.insertId;
    },

    /**
     * Deletes an application from the database
     * @returns true or false
     */
    async deleteApp(applicationID: number) {
        const sql = "DELETE FROM Applications WHERE applicationID = ?;";
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, [applicationID]);
        return result.affectedRows === 1;
    },

    /**
     * Updates the notes section of the given application
     * @returns true if the update was successful, else false (e.g. applicationID doesn't exist)
     */
    async updateApp(p: Partial<ContactFields>) {
        let sql = "UPDATE Applications SET ? WHERE applicationID = ?";
        const updates = Object.fromEntries(Object.entries(p).filter(([key, val]) => val !== undefined));
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>(
            await db.promise().query(sql, [updates, p.applicationID])
        );
        return result.affectedRows === 1;
    },

    /**
     * Returns contact by contactID
     */
    async getContactByID(contactID: number) {
        const sql = "SELECT * FROM ApplicationContacts WHERE contactID = ?";
        const [result, fields] = <[RowDataPacket, FieldPacket[]]>await db.promise().query(sql, [contactID]);
        return result[0] as ContactFields;
    },

    /**
     * Returns contact by contactID
     */
    async getContactAndAppByID(contactID: number) {
        const sql = `
        SELECT * FROM ApplicationContacts AS cont 
        JOIN Applications AS app ON cont.applicationID = app.applicationID
        WHERE contactID = ?
        `;
        const [result, fields] = <[RowDataPacket, FieldPacket[]]>await db.promise().query(sql, [contactID]);
        return result[0] as ContactAndAppFields;
    },

    /**
     * Creates a new contact for an application
     * @returns the contactID if successful
     */
    async createContact(p: ContactFields) {
        const sql = `
        INSERT INTO ApplicationContacts
        (applicationID, firstName, lastName, emailAddress, phoneNumber, role)
        VALUES (?, ?, ?, ?, ?, ?);
        `;
        const vals = [p.applicationID, p.firstName, p.lastName, p.emailAddress, p.phoneNumber, p.role];
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        return result.insertId;
    },

    /**
     * Updates an existing contact for an application
     * @returns the contactID if successful
     */
    async updateContact(p: Partial<ContactFields>) {
        let sql = "UPDATE ApplicationContacts SET ? WHERE contactID = ?";
        const updates = Object.fromEntries(Object.entries(p).filter(([key, val]) => val !== undefined));
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>(
            await db.promise().query(sql, [updates, p.contactID])
        );
        return result.affectedRows === 1;
    },

    /**
     * Deletes the contact with given contactID
     * @returns true upon succcess
     */
    async deleteContact(contactID: number) {
        const sql = "DELETE FROM ApplicationContacts WHERE contactID = ?;";
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, [contactID]);
        return result.affectedRows === 1;
    },
};
