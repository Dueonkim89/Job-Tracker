const { pool } = require("../models/db");

afterAll((done) => {
    pool.end();
    done();
});
