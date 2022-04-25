const db = require("../models/db");
const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");

async function setUpDB() {
    const createTableSQL = fs.readFileSync(path.join(process.cwd(), "sql", "create-tables.sql")).toString();
    const populateTableSQL = fs.readFileSync(path.join(process.cwd(), "sql", "populate-tables.sql")).toString();
    // need to allow multiple statements in connection configuration
    const connection = mysql.createConnection({ ...db.chosenDBConfig, multipleStatements: true });
    await connection.promise().query(createTableSQL, []);
    await connection.promise().query(populateTableSQL, []);
    connection.destroy();
}

module.exports = setUpDB;
