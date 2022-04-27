import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "./db";

export interface CompanyFields {
    companyID?: number;
    name: string;
    industry: string;
    websiteURL: string;
}

function companyOrNull(rows: RowDataPacket[]) {
    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as CompanyFields;
    } else {
        return null;
    }
}

export async function getCompanyByID(companyID: number) {
    const sql = "SELECT * FROM `Companies` WHERE companyID = ?";
    const [rows, fields] = await db.promise().query(sql, [companyID]);
    return companyOrNull(rows as RowDataPacket[]);
}

export async function getCompanyByName(companyName: string) {
    const sql = "SELECT * FROM `Companies` WHERE name = ?";
    const [rows, fields] = await db.promise().query(sql, [companyName]);
    return companyOrNull(rows as RowDataPacket[]);
}

export async function searchCompaniesByName(companyName: string) {
    companyName = `${companyName}%`;
    const sql = "SELECT * FROM `Companies` WHERE name LIKE ?";
    const [rows, fields] = await db.promise().query(sql, [companyName]);
    return rows as CompanyFields[];
}

export async function createCompany(p: CompanyFields) {
    const sql = `
    INSERT INTO Companies
    (name, industry, websiteURL)
    VALUES (?, ?, ?);
    `;
    const vals = [p.name, p.industry, p.websiteURL];
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
    return result.insertId;
}
