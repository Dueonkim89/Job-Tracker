module.exports = async (globalConfig, projectConfig) => {
    require("dotenv").config();
    const pool = require("./db");
    const setupDB = require("./setupDB");
    await setupDB();
};
