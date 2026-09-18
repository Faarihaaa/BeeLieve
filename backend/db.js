const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "beelieve",
  password: "302215",
  port: 5432,
});

pool.on("connect", () => {
  console.log("🐝 BeeLieve connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("PostgreSQL error:", err);
});

module.exports = pool;