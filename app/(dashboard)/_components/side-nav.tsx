"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/books", label: "单词书管理", meta: "Books" },
  { href: "/admin-users", label: "管理员管理", meta: "Admins", system: true },
];

export default function SideNav({
  email,
  role,
}: {
  email: string;
  role: "system" | "admin";
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#a58b63]">
            LexiBoard
          </p>
          <p className="text-xl font-semibold text-[#1d1f22]">管理控制台</p>
        </div>

        <nav className="space-y-2">
          {navItems
            .filter((item) => (item.system ? role === "system" : true))
            .map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                  isActive
                    ? "border-[#1d1f22] bg-[#1d1f22] text-white shadow-lg shadow-black/15"
                    : "border-black/10 bg-white/70 text-[#3a3f45] hover:border-black/30"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-xs uppercase tracking-[0.2em] ${
                    isActive ? "text-white/70" : "text-[#9a9fa7]"
                  }`}
                >
                  {item.meta}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 rounded-2xl border border-black/10 bg-white/70 p-4 text-xs text-[#5d636c]">
        <div>
          <p className="font-medium text-[#1d1f22]">系统提示</p>
          <p className="mt-2 leading-5">
            本周已有 4 个词书进入审批队列，请及时处理。
          </p>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-[11px]">
          <span className="truncate text-[#1d1f22]">{email}</span>
          <button
            type="button"
            onClick={async () => {
              if (window.confirm("确定要退出登录吗？")) {
                await fetch("/api/signout", { method: "POST" });
                router.push("/signin");
              }
            }}
            className="rounded-lg border border-black/10 bg-[#1d1f22] px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white"
            title="退出登录"
          >
            <span className="sr-only">退出登录</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
