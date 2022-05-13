import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../config/db";
import { ApplicationSkillFields, SkillFields, UserSkillFields } from "../types/skill";

export default {
    async createSkill(p: SkillFields) {
        const sql = `
        INSERT INTO Skills
        (name)
        VALUES (?);
        `;
        const vals = [p.name];
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        return result.insertId;
    },

    async createUserSkill(p: UserSkillFields) {
        const sql = `
        INSERT INTO UserSkills
        (userID, skillID, rating)
        VALUES (?, ?, ?);
        `;
        const vals = [p.userID, p.skillID, p.rating];
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        return true;
    },

    async createApplicationSkill(p: ApplicationSkillFields) {
        const sql = `
        INSERT INTO ApplicationSkills
        (applicationID, skillID)
        VALUES (?, ?);
        `;
        const vals = [p.applicationID, p.skillID];
        const [result, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        return true;
    },

    async getAllSkills() {
        const sql = "SELECT * FROM `Skills` ORDER BY name ASC";
        const [rows, fields] = await db.promise().query(sql);
        return rows as SkillFields[];
    },

    async getUserSkills(userID: number) {
        const sql = `
        SELECT s.*, us.* FROM Skills AS s
        JOIN UserSkills AS us ON s.skillID = us.skillID
        WHERE us.userID = ?
        `;
        const vals = [userID];
        const [rows, fields] = await db.promise().query(sql, vals);
        return rows as UserSkillFields[];
    },

    async getApplicationSkills(applicationID: number) {
        const sql = `
        SELECT s.*, appS.* FROM Skills AS s
        JOIN ApplicationSkills AS appS ON s.skillID = appS.skillID
        WHERE appS.applicationID = ?
        `;
        const vals = [applicationID];
        const [rows, fields] = await db.promise().query(sql, vals);
        return rows as ApplicationSkillFields[];
    },

    async updateUserSkillRating(userID: number, skillID: number, rating: number) {
        const sql = `
        UPDATE UserSkills
        SET rating = ?
        WHERE userID = ? AND skillID = ?
        `;
        const vals = [rating, userID, skillID];
        const [rows, fields] = <[ResultSetHeader, FieldPacket[]]>await db.promise().query(sql, vals);
        if (rows.affectedRows > 1) {
            console.error("User skill rating update: multiple rows matched");
            throw Error("Error in User skill rating update");
        }
        return rows.affectedRows === 1;
    },
};
