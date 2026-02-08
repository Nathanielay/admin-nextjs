import Link from "next/link";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { adminUsers } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { createSession, hasAdmins } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

async function handleSignIn(formData: FormData) {
  "use server";
  const anyAdmin = await hasAdmins();
  if (!anyAdmin) {
    redirect("/signup");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect("/signin?error=1");
  }

  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (!user) {
    redirect("/signin?error=2");
  }

  const valid = verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (!valid) {
    redirect("/signin?error=2");
  }

  await createSession(user.id);
  redirect("/books");
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: { registered?: string; error?: string; email?: string };
}) {
  const anyAdmin = await hasAdmins();
  if (!anyAdmin) {
    redirect("/signup");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#7f8693]">
          管理员登录
        </p>
        <h2 className="text-3xl font-semibold text-[#1c2026]">
          欢迎回来
        </h2>
        <p className="text-sm leading-6 text-[#5a5f67]">
          使用管理员账号进入后台，查看词书与账号管理视图。
        </p>
      </div>

      {searchParams?.registered === "1" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          注册成功，请使用账号登录。
        </div>
      ) : null}

      {searchParams?.error === "1" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          请输入邮箱和密码后再登录。
        </div>
      ) : null}

      {searchParams?.error === "2" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          邮箱或密码错误，请重试。
        </div>
      ) : null}

      <form action={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2f343d]" htmlFor="email">
            邮箱
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="admin@lexiboard.io"
            defaultValue={searchParams?.email ?? ""}
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
            placeholder="输入你的密码"
            className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm shadow-sm outline-none transition focus:border-[#1d1f22] focus:ring-2 focus:ring-[#d5cab8]"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#5a5f67]">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-black/20" />
            7天内保持登录
          </label>
          <button type="button" className="text-[#1f4d4a] hover:text-[#143634]">
            忘记密码
          </button>
        </div>

        <button
          type="submit"
          className="h-11 w-full rounded-xl bg-[#1c2026] text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-black"
        >
          登录管理后台
        </button>
      </form>

      <div className="flex items-center justify-between text-xs text-[#5a5f67]">
        <span>还没有管理员账号？</span>
        <Link className="font-semibold text-[#1f4d4a]" href="/signup">
          去注册
        </Link>
      </div>
    </div>
  );
}
