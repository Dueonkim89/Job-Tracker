import db from "./db";

const user = {
    // TBU - finished this function - add additional parameters
    async create(params: any) {
        const { firstName, lastName } = params;
        const sql = "INSERT INTO `users` (first_name, last_name) VALUES (?, ?)";
        try {
            const [rows, fields] = await db.query(sql, [firstName, lastName]);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async getAll() {
        const sql = "SELECT * FROM `users`";
        try {
            const [rows, fields] = await db.query(sql);
            return [true, rows];
        } catch (err) {
            console.log(err);
            return [false, null];
        }
    },
};

export default user;
