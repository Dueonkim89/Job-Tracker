module.exports = async function (globalConfig, projectConfig) {
    require("dotenv").config();
    const setUpDB = require("./setupDB");
    await setUpDB();
};
