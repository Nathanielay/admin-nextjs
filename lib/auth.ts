import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, sql } from "drizzle-orm";
import crypto from "crypto";

import { db } from "@/lib/db";
import { adminSessions, adminUsers } from "@/drizzle/schema";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "system" | "admin";
};

export async function hasAdmins() {
  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(adminUsers);
    return (row?.count ?? 0) > 0;
  } catch (error) {
    console.error("Failed to query admin-users table:", error);
    return false;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return null;
  }

  const now = new Date();
  const rows = await db
    .select({
      id: adminUsers.id,
      name: adminUsers.name,
      email: adminUsers.email,
      role: adminUsers.role,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.adminUserId, adminUsers.id))
    .where(and(eq(adminSessions.token, token), gt(adminSessions.expiresAt, now)))
    .limit(1);

  return rows[0] ?? null;
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin");
  }
  return user;
}

export async function requireSystemAdmin() {
  const user = await requireAuth();
  if (user.role !== "system") {
    redirect("/books");
  }
  return user;
}

export async function createSession(adminUserId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.insert(adminSessions).values({
    adminUserId,
    token,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }

  cookieStore.delete("admin_session");
}
