const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: `${process.env.POSTGRES_USERNAME}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  host: "localhost",
  database: "mytodolist",
  port: 5432,
});

module.exports = { pool };
