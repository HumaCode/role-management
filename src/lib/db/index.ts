import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Parse DATABASE_URL
function parseDatabaseUrl(url: string) {
  try {
    // Format: mysql://user:password@host:port/database
    const match = url.match(/mysql:\/\/([^:]+):([^@]*)@([^:]+):(\d+)\/(.+)/);
    
    if (!match) {
      throw new Error("Invalid DATABASE_URL format");
    }

    return {
      host: match[3],
      user: match[1],
      password: match[2],
      database: match[5],
      port: parseInt(match[4]),
    };
  } catch (error) {
    console.error("Error parsing DATABASE_URL:", error);
    throw error;
  }
}

// Get database config from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const dbConfig = parseDatabaseUrl(databaseUrl);

// Create connection pool
const poolConnection = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });

// Function untuk test koneksi
export async function testConnection() {
  try {
    const connection = await poolConnection.getConnection();
    // console.log("✅ Database connected successfully!");
    // console.log(`📊 Database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    // console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Export pool untuk keperluan lain jika diperlukan
export { poolConnection };