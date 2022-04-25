import mysql from "mysql2";
import fs from "fs";
import path from "path";
import { environment, LOCAL } from "../../../FLAGS";

// create the connection to database
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

export const chosenDBConfig = environment === LOCAL ? localDBconfig : azureDBconfig;

// Update to azureDBconfig to connect to azure DB
export const pool = mysql.createPool(chosenDBConfig);

export default pool.promise();
