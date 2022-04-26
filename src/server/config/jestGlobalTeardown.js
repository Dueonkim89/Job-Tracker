module.exports = async function (globalConfig, projectConfig) {
    const setUpDB = require("./setupDB");
    await setUpDB();
};
