import {
  datetime,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const adminUsers = mysqlTable("admin-users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  passwordSalt: varchar("password_salt", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["system", "admin"]).notNull(),
  status: mysqlEnum("status", ["active", "disabled"])
    .notNull()
    .default("active"),
  createdAt: datetime("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime("updated_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const adminSessions = mysqlTable("admin-session", {
  id: int("id").primaryKey().autoincrement(),
  adminUserId: int("admin_user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: datetime("expires_at", { mode: "date" }).notNull(),
  createdAt: datetime("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const books = mysqlTable("books", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 200 }).notNull(),
  wordCount: int("word_count").notNull(),
  coverUrl: varchar("cover_url", { length: 500 }).notNull(),
  bookId: varchar("book_id", { length: 120 }).notNull().unique(),
  tags: json("tags").notNull(),
  createdAt: datetime("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime("updated_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const words = mysqlTable("words", {
  id: int("id").primaryKey().autoincrement(),
  wordRank: int("word_rank").notNull(),
  headWord: varchar("head_word", { length: 120 }).notNull(),
  wordId: varchar("word_id", { length: 120 }).notNull().unique(),
  bookId: varchar("book_id", { length: 120 }).notNull(),
  content: json("content").notNull(),
  createdAt: datetime("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
