import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Buat connection pool
const poolConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // kosongkan jika tidak pakai password
  database: "role_management",
});

export const db = drizzle(poolConnection, { schema, mode: "default" });

// Function untuk test koneksi
export async function testConnection() {
  try {
    const connection = await poolConnection.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}