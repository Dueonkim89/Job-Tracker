import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "./db";

export interface SkillFields {
    skillID?: number;
    name: string;
}

export interface UserSkillFields extends SkillFields {
    skillID: number;
    userID: number;
    rating: number;
}

export interface ApplicationSkillFields extends SkillFields {
    skillID: number;
    applicationID: number;
}

export async function createSkill(p: SkillFields) {
    const sql = `
    INSERT INTO Skills
    (name)
    VALUES (?);
    `;
    const vals = [p.name];
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.query(sql, vals);
    return result.insertId;
}

export async function getAllSkills() {
    const sql = "SELECT * FROM `Skills` ORDER BY name ASC";
    const [rows, fields] = await db.query(sql);
    return rows as SkillFields[];
}

export async function getUserSkills(userID: number) {
    const sql = `
    SELECT s.*, us.* FROM Skills AS s
    JOIN UserSkills AS us ON s.skillID = us.skillID
    WHERE us.userID = ?
    `;
    const vals = [userID];
    const [rows, fields] = await db.query(sql, vals);
    return rows as UserSkillFields[];
}

export async function getApplicationSkills(applicationID: number) {
    const sql = `
    SELECT s.*, appS.* FROM Skills AS s
    JOIN ApplicationSkills AS appS ON s.skillID = appS.skillID
    WHERE appS.applicationID = ?
    `;
    const vals = [applicationID];
    const [rows, fields] = await db.query(sql, vals);
    return rows as ApplicationSkillFields[];
}
