import mysql from "mysql2"
import dotenv from "dotenv";

dotenv.config()

export const pool = mysql.createPool({
    host: process.env.DB_HOST,    // Replace with your MySQL server's hostname or IP address
    user: process.env.DB_USER,     // Replace with your MySQL username
    password: process.env.DB_PASS, // Replace with your MySQL password
    database: process.env.DB_NAME,    // Replace with your database name
  });

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed: ' + err.message);
    } else {
      console.log('Connected to the database');
      connection.release(); // Release the connection back to the pool
    }
  });