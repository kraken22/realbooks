require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
    host: "medical-surveys.com",
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: "realbooks"
});

const query = async (sql, params) => {
    return pool.query(sql, params);
};

module.exports = { query };
