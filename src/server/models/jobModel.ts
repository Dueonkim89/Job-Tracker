import { RowDataPacket } from "mysql2";
import db from "./db";

export interface JobFields {
    jobID?: number;
    companyID: number;
    jobPostingURL: string;
    position: string;
}

export async function createJob(p: JobFields) {
    const sql = `
    INSERT INTO Jobs
    (companyID, jobPostingURL, position)
    VALUES (?, ?, ?)
    `;
    try {
        const vals = [p.companyID, p.jobPostingURL, p.position];
        await db.query(sql, vals);
        return true;
    } catch (err: any) {
        if (err?.code === "ER_DUP_ENTRY" && err?.sqlMessage?.includes("jobPostingURL")) {
            return false;
        } else {
            throw err;
        }
    }
}

export async function getJobByURL(jobPostingURL: string) {
    const sql = "SELECT * FROM `Jobs` WHERE jobPostingURL = ?";
    const [rows, fields] = await db.query(sql, [jobPostingURL]);
    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as JobFields;
    } else {
        return null;
    }
}

export async function getJobByID(jobID: number) {
    const sql = "SELECT * FROM `Jobs` WHERE jobID = ?";
    const [rows, fields] = await db.query(sql, [jobID]);
    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as JobFields;
    } else {
        return null;
    }
}
