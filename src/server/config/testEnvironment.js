const NodeEnvironment = require("jest-environment-node");
require("dotenv").config();
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const { app } = require("../index");
const { environment, LOCAL } = require("../../../FLAGS");

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

const chosenDBConfig = environment === LOCAL ? localDBconfig : azureDBconfig;

async function setUpDB() {
    const createTableSQL = fs.readFileSync(path.join(process.cwd(), "sql", "create-tables.sql")).toString();
    const populateTableSQL = fs.readFileSync(path.join(process.cwd(), "sql", "populate-tables.sql")).toString();
    // need to allow multiple statements in connection configuration
    const connection = mysql.createConnection({ ...chosenDBConfig, multipleStatements: true });
    await connection.promise().query(createTableSQL, []);
    await connection.promise().query(populateTableSQL, []);
    connection.end();
}

class TestEnvironment extends NodeEnvironment {
    constructor(config, context) {
        super(config, context);
    }

    async setup() {
        await super.setup();
        await setUpDB();
        this.global.__SERVER__ = app.listen(5001);
        // this.global.__DB__ = mysql.createPool(chosenDBConfig);
    }

    async teardown() {
        // this.global.__DB__.end();
        this.global.__SERVER__.close();
        await super.teardown();
    }

    getVmContext() {
        return super.getVmContext();
    }
}

module.exports = TestEnvironment;
