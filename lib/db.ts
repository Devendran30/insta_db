import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "03072002",
  database: process.env.DB_NAME || "instagram_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;