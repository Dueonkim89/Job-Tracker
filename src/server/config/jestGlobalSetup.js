module.exports = async (globalConfig, projectConfig) => {
    require("dotenv").config();
    const setupDB = require("./setupDB");
    await setupDB();
};
