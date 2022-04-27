import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
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
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
    return result.insertId;
}

export async function createUserSkill(p: UserSkillFields) {
    const sql = `
    INSERT INTO UserSkills
    (userID, skillID, rating)
    VALUES (?, ?, ?);
    `;
    const vals = [p.userID, p.skillID, p.rating];
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
    return true;
}

export async function createApplicationSkill(p: ApplicationSkillFields) {
    const sql = `
    INSERT INTO ApplicationSkills
    (applicationID, skillID)
    VALUES (?, ?);
    `;
    const vals = [p.applicationID, p.skillID];
    const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
    return true;
}

export async function getAllSkills() {
    const sql = "SELECT * FROM `Skills` ORDER BY name ASC";
    const [rows, fields] = await db.promise().query(sql);
    return rows as SkillFields[];
}

export async function getUserSkills(userID: number) {
    const sql = `
    SELECT s.*, us.* FROM Skills AS s
    JOIN UserSkills AS us ON s.skillID = us.skillID
    WHERE us.userID = ?
    `;
    const vals = [userID];
    const [rows, fields] = await db.promise().query(sql, vals);
    return rows as UserSkillFields[];
}

export async function getApplicationSkills(applicationID: number) {
    const sql = `
    SELECT s.*, appS.* FROM Skills AS s
    JOIN ApplicationSkills AS appS ON s.skillID = appS.skillID
    WHERE appS.applicationID = ?
    `;
    const vals = [applicationID];
    const [rows, fields] = await db.promise().query(sql, vals);
    return rows as ApplicationSkillFields[];
}
