import Link from "next/link";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { adminUsers } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { hasAdmins } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

async function handleSignUp(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const confirm = String(formData.get("confirm") ?? "").trim();

  const anyAdmin = await hasAdmins();
  if (anyAdmin) {
    redirect("/signin");
  }

  if (!name || !email || !password || !confirm) {
    redirect("/signup?error=1");
  }

  if (password !== confirm) {
    redirect("/signup?error=2");
  }

  const [existing] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (existing) {
    redirect("/signup?error=3");
  }

  const { hash, salt } = hashPassword(password);
  await db.insert(adminUsers).values({
    name,
    email,
    passwordHash: hash,
    passwordSalt: salt,
    role: "system",
  });

  redirect(`/signin?registered=1&email=${encodeURIComponent(email)}`);
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const anyAdmin = await hasAdmins();
  if (anyAdmin) {
    redirect("/signin");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#7f8693]">
          系统管理员注册
        </p>
        <h2 className="text-3xl font-semibold text-[#1c2026]">创建管理员账号</h2>
        <p className="text-sm leading-6 text-[#5a5f67]">
          仅限系统管理员创建账号，用于后台审批与配置管理。
        </p>
      </div>

      {searchParams?.error === "1" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          请完整填写注册信息。
        </div>
      ) : null}

      {searchParams?.error === "2" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          两次输入的密码不一致。
        </div>
      ) : null}

      {searchParams?.error === "3" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          邮箱已存在，请更换邮箱。
        </div>
      ) : null}

      <form action={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2f343d]" htmlFor="name">
            姓名
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="输入姓名"
            className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm shadow-sm outline-none transition focus:border-[#1d1f22] focus:ring-2 focus:ring-[#d5cab8]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2f343d]" htmlFor="email">
            邮箱
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="admin@lexiboard.io"
            className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm shadow-sm outline-none transition focus:border-[#1d1f22] focus:ring-2 focus:ring-[#d5cab8]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2f343d]" htmlFor="password">
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="至少8位，包含数字与字母"
            className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm shadow-sm outline-none transition focus:border-[#1d1f22] focus:ring-2 focus:ring-[#d5cab8]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2f343d]" htmlFor="confirm">
            确认密码
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            placeholder="再次输入密码"
            className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm shadow-sm outline-none transition focus:border-[#1d1f22] focus:ring-2 focus:ring-[#d5cab8]"
          />
        </div>

        <button
          type="submit"
          className="h-11 w-full rounded-xl bg-[#1c2026] text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-black"
        >
          完成注册
        </button>
      </form>

      <div className="flex items-center justify-between text-xs text-[#5a5f67]">
        <span>已有管理员账号？</span>
        <Link className="font-semibold text-[#1f4d4a]" href="/signin">
          去登录
        </Link>
      </div>
    </div>
  );
}
