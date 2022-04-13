import mysql from "mysql2";

// create the connection to database
const db = mysql
    .createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASS,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    })
    .promise();

export default db;
