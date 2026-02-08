import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";

import { adminUsers } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { requireSystemAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import AdminUsersTable from "./_components/admin-users-table";

async function handleCreateAdmin(formData: FormData) {
  "use server";
  await requireSystemAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "admin") as
    | "system"
    | "admin";
  const password = String(formData.get("password") ?? "").trim();

  if (!name || !email || !password) {
    return;
  }

  const [existing] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (existing) {
    return;
  }

  const { hash, salt } = hashPassword(password);
  await db.insert(adminUsers).values({
    name,
    email,
    passwordHash: hash,
    passwordSalt: salt,
    role,
    status: "active",
  });

  revalidatePath("/admin-users");
}

async function handleUpdateAdmin(formData: FormData) {
  "use server";
  const currentUser = await requireSystemAdmin();

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "admin") as
    | "system"
    | "admin";
  const status = String(formData.get("status") ?? "active") as
    | "active"
    | "disabled";

  if (!id || !name) {
    return;
  }

  if (id === currentUser.id) {
    await db
      .update(adminUsers)
      .set({ name, updatedAt: new Date() })
      .where(eq(adminUsers.id, id));
  } else {
    await db
      .update(adminUsers)
      .set({ name, role, status, updatedAt: new Date() })
      .where(eq(adminUsers.id, id));
  }
  revalidatePath("/admin-users");
}

export default async function AdminUsersPage() {
  const currentUser = await requireSystemAdmin();
  let rows = [];
  try {
    rows = await db
      .select()
      .from(adminUsers)
      .orderBy(adminUsers.createdAt);
  } catch (error) {
    console.error("Failed to load admin-users:", error);
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-900">
        管理员数据加载失败，请确认数据库迁移已执行并检查连接配置。
      </div>
    );
  }
  const systemCount = rows.filter((row) => row.role === "system").length;
  const adminCount = rows.length - systemCount;
  const activeCount = rows.filter((row) => row.status === "active").length;
  const normalized = rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString().slice(0, 10),
  }));

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#1c2026]">
              管理员管理
            </h2>
            <p className="text-sm text-[#5a5f67]">
              统一设置管理员角色、权限与登录状态。
            </p>
          </div>
          <div className="rounded-full border border-black/10 bg-[#f6f1ea] px-4 py-2 text-xs font-semibold text-[#1d1f22]">
            系统管理员可新增与编辑账号
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "管理员总数", value: String(rows.length) },
            { label: "系统管理员", value: String(systemCount) },
            { label: "启用中", value: String(activeCount) },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[20px] border border-black/10 bg-[#f9f5ef] p-4"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[#9a6b2f]">
                {item.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-[#1d1f22]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-black/10 bg-[#f7f2ea] px-4 py-3 text-xs text-[#5a5f67]">
          普通管理员数量：{adminCount}，停用人数：
          {rows.length - activeCount}
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
          <form action={handleCreateAdmin} className="grid gap-3 md:grid-cols-6">
            <input
              name="name"
              placeholder="姓名"
              className="h-10 rounded-full border border-black/10 px-4 text-sm"
            />
            <input
              name="email"
              type="email"
              placeholder="邮箱"
              className="h-10 rounded-full border border-black/10 px-4 text-sm md:col-span-2"
            />
            <input
              name="password"
              type="password"
              placeholder="初始密码"
              className="h-10 rounded-full border border-black/10 px-4 text-sm"
            />
            <select
              name="role"
              className="h-10 rounded-full border border-black/10 px-4 text-sm"
              defaultValue="admin"
            >
              <option value="admin">普通管理员</option>
              <option value="system">系统管理员</option>
            </select>
            <button className="h-10 rounded-full bg-[#1d1f22] px-4 text-xs font-semibold text-white shadow-lg shadow-black/15">
              新增管理员
            </button>
          </form>
        </div>

        <AdminUsersTable
          rows={normalized}
          currentUserId={currentUser.id}
          onUpdate={handleUpdateAdmin}
        />
      </section>
    </div>
  );
}
