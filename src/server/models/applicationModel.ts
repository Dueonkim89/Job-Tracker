import db from "./db";

export async function getUserApplications(userID: string) {
    const sql = `
    SELECT app.*, user_app.status FROM User_Applications AS user_app
    JOIN Application AS app ON user_app.application_id = app.application_id
    WHERE user_app.user_id = ?
    `;
    const [rows, fields] = await db.query(sql, [userID]);
    return rows;
}
