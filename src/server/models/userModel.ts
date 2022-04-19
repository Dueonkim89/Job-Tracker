import db from "./db";

// TBU - finished this function - add additional parameters
export async function createUser(params: any) {
    const { fullName } = params;
    const sql = "INSERT INTO `user` (full_name) VALUES (?)";
    const [rows, fields] = await db.query(sql, [fullName]);
}

export async function getAll() {
    const sql = "SELECT * FROM `user`";
    const [rows, fields] = await db.query(sql);
    return rows;
}

export async function getUser(userID: string) {
    const sql = "SELECT * FROM `user` WHERE user_id = ?";
    const [rows, fields] = await db.query(sql, [userID]);
    return rows;
}
