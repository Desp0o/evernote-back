import mysql from "mysql2"
import dotenv from "dotenv";

dotenv.config()

export const pool = mysql.createPool({
    host: process.env.DB_HOST,    
    user: process.env.DB_USER,     
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME,   
  });

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed: ' + err.message);
    } else {
      console.log('Connected to the database');
      connection.release(); 
    }
  });