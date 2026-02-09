import "server-only";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import * as schema from "@/drizzle/schema";

const globalForDb = globalThis as typeof globalThis & {
  _db?: ReturnType<typeof drizzle>;
};

function getDb() {
  if (!globalForDb._db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }
    globalForDb._db = drizzle({
      connection: connectionString,
      schema,
      mode: "default",
    });
  }
  return globalForDb._db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});

export async function pingDb() {
  const dbInstance = getDb();
  await dbInstance.execute(sql`select 1`);
}
