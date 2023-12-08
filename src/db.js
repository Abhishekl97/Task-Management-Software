const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "task_management",
    port: 5432,
    password: "Omkaryeole@10",
});

module.exports = pool;