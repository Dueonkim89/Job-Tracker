module.exports = async (globalConfig, projectConfig) => {
    require("dotenv").config();
    const pool = require("../models/db");
    const setupDB = require("./setupDB");
    await setupDB();
};
