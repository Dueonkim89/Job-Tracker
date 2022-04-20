import mysql from "mysql2";
import fs from "fs";
import path from "path";
import { environment, LOCAL } from "../../../FLAGS";

// create the connection to database
const certDir = path.join(process.cwd(), "certs", "DigiCertGlobalRootCA.crt.pem");

const localDBconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const azureDBconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        ca: `${fs.readFileSync(certDir)}`,
    },
};

// Update to azureDBconfig to connect to azure DB
const db = mysql.createPool(environment === LOCAL ? localDBconfig : azureDBconfig).promise();

export default db;
