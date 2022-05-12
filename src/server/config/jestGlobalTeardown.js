module.exports = async (globalConfig, projectConfig) => {
    const pool = require("./db");
    pool.default.end();
    const setupDB = require("./setupDB");
    await setupDB();
};
