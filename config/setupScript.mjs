import "dotenv/config";
import mysql from "mysql2";
import fs from "fs";
import path from "path";

const certDir = path.join(process.cwd(), "certs", "DigiCertGlobalRootCA.crt.pem");

const localDBconfig = {
    host: process.env.LOCAL_DB_HOST,
    user: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASS,
    database: process.env.LOCAL_DB_DATABASE,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const azureDBconfig = {
    host: process.env.AZURE_DB_HOST,
    user: process.env.AZURE_DB_USER,
    password: process.env.AZURE_DB_PASS,
    database: process.env.AZURE_DB_DATABASE,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        ca: `${fs.readFileSync(certDir)}`,
    },
};

const chosenDB = process.argv[2];

const chosenDBConfig = chosenDB === "LOCAL" ? localDBconfig : azureDBconfig;

async function setUpDB() {
    const createTableSQL = fs.readFileSync(path.join(process.cwd(), "sql", "create-tables.sql")).toString();
    const populateTableSQL = fs.readFileSync(path.join(process.cwd(), "sql", "populate-tables.sql")).toString();
    // need to allow multiple statements in connection configuration
    const connection = mysql.createConnection({ ...chosenDBConfig, multipleStatements: true });
    await connection.promise().query(createTableSQL, []);
    await connection.promise().query(populateTableSQL, []);
    connection.end();
}

console.log("Attempting to set up the " + chosenDB + " database.");
await setUpDB();
console.log("Success.");
