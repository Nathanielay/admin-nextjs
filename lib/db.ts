import "server-only";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/drizzle/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const globalForDb = globalThis as typeof globalThis & {
  _mysqlPool?: mysql.Pool;
};

const pool =
  globalForDb._mysqlPool ??
  mysql.createPool({
    uri: connectionString,
    connectionLimit: 10,
  });

if (!globalForDb._mysqlPool) {
  globalForDb._mysqlPool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
