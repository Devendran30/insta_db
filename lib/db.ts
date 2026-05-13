import mysql from "mysql2/promise"; // Mistake fixed: Use promise-based wrapper

const db = mysql.createPool({       // Mistake fixed: Use createPool for Next.js
  host: "localhost",
  user: "root",
  password: "03072002",
  database: "instagram_db",
});

export default db;                  // Mistake fixed: Use ES6 export