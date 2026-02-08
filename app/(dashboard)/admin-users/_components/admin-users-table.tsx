"use client";

import { useMemo, useState } from "react";

type AdminRow = {
  id: number;
  name: string;
  email: string;
  role: "system" | "admin";
  status: "active" | "disabled";
  createdAt: string;
};

type AdminUsersTableProps = {
  rows: AdminRow[];
  currentUserId: number;
  onUpdate: (formData: FormData) => Promise<void>;
};

export default function AdminUsersTable({
  rows,
  currentUserId,
  onUpdate,
}: AdminUsersTableProps) {
  const [selected, setSelected] = useState<AdminRow | null>(null);
  const modalTitle = useMemo(() => {
    if (!selected) return "";
    return selected.id === currentUserId ? "编辑我的资料" : "编辑管理员";
  }, [selected, currentUserId]);

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
        <div className="grid grid-cols-[1.1fr_0.9fr_1.2fr_0.8fr_0.8fr_0.6fr] bg-[#f5efe6] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b5b45]">
          <span>姓名</span>
          <span>角色</span>
          <span>邮箱</span>
          <span>状态</span>
          <span>创建时间</span>
          <span>操作</span>
        </div>
        <div className="divide-y divide-black/5 bg-white">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1.1fr_0.9fr_1.2fr_0.8fr_0.8fr_0.6fr] items-center gap-2 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-[#1d1f22]">{row.name}</p>
                <p className="text-xs text-[#7a7f87]">
                  {row.id === currentUserId ? "当前登录" : "成员"}
                </p>
              </div>
              <span className="text-[#4b5058]">
                {row.role === "system" ? "系统管理员" : "普通管理员"}
              </span>
              <span className="text-[#4b5058]">{row.email}</span>
              <span
                className={`text-xs font-semibold ${
                  row.status === "active" ? "text-[#1f4d4a]" : "text-[#9a6b2f]"
                }`}
              >
                {row.status === "active" ? "启用" : "停用"}
              </span>
              <span className="text-[#4b5058]">{row.createdAt}</span>
              <button
                type="button"
                onClick={() => setSelected(row)}
                className="h-9 rounded-full border border-black/10 px-3 text-xs font-semibold text-[#1d1f22]"
              >
                编辑
              </button>
            </div>
          ))}
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1d1f22]">
                {modalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full border border-black/10 px-3 py-1 text-xs text-[#4b5058]"
              >
                关闭
              </button>
            </div>

            <form action={onUpdate} className="mt-5 space-y-4">
              <input type="hidden" name="id" value={selected.id} />
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2f343d]">
                  姓名
                </label>
                <input
                  name="name"
                  defaultValue={selected.name}
                  className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2f343d]">
                  邮箱
                </label>
                <input
                  value={selected.email}
                  readOnly
                  className="h-10 w-full rounded-xl border border-black/10 bg-[#f8f4ef] px-4 text-sm text-[#4b5058]"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2f343d]">
                    角色
                  </label>
                  <select
                    name="role"
                    defaultValue={selected.role}
                    disabled={selected.id === currentUserId}
                    className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm disabled:bg-[#f3efea]"
                  >
                    <option value="admin">普通管理员</option>
                    <option value="system">系统管理员</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2f343d]">
                    状态
                  </label>
                  <select
                    name="status"
                    defaultValue={selected.status}
                    disabled={selected.id === currentUserId}
                    className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm disabled:bg-[#f3efea]"
                  >
                    <option value="active">启用</option>
                    <option value="disabled">停用</option>
                  </select>
                </div>
              </div>

              {selected.id === currentUserId ? (
                <p className="text-xs text-[#9a6b2f]">
                  系统管理员不能修改自己的角色或状态。
                </p>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="h-10 rounded-full border border-black/10 px-4 text-xs font-semibold text-[#1d1f22]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-full bg-[#1d1f22] px-4 text-xs font-semibold text-white shadow-lg shadow-black/15"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
