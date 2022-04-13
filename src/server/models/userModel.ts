import db from "./db";

const user = {
    // TBU - finished this function - add additional parameters
    async create(params: any) {
        const { fullName } = params;
        const sql = "INSERT INTO `user` (full_name) VALUES (?)";
        const [rows, fields] = await db.query(sql, [fullName]);
    },
    async getAll() {
        const sql = "SELECT * FROM `user`";
        const [rows, fields] = await db.query(sql);
        return rows;
    },
};

export default user;
