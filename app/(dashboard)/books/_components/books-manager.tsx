"use client";

import { useMemo, useState } from "react";

type BookRow = {
  id: number;
  title: string;
  wordCount: number;
  coverUrl: string;
  bookId: string;
  tags: string[];
};

type BooksManagerProps = {
  rows: BookRow[];
  onCreate: (formData: FormData) => Promise<void>;
  onUpdate: (formData: FormData) => Promise<void>;
  onDelete: (formData: FormData) => Promise<void>;
};

export default function BooksManager({
  rows,
  onCreate,
  onUpdate,
  onDelete,
}: BooksManagerProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<BookRow | null>(null);
  const [uploading, setUploading] = useState(false);

  const totalWords = useMemo(
    () => rows.reduce((sum, row) => sum + row.wordCount, 0),
    [rows],
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "总词书", value: String(rows.length), change: "已发布" },
          { label: "总词条", value: totalWords.toLocaleString(), change: "持续更新" },
          { label: "最近上新", value: rows[0]?.title ?? "暂无", change: "最新词书" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-black/10 bg-white/80 p-5 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.35)]"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#9a6b2f]">
              {item.label}
            </p>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-semibold text-[#1d1f22]">
                {item.value}
              </p>
              <span className="text-xs text-[#5a5f67]">{item.change}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#1c2026]">词书管理</h2>
            <p className="text-sm text-[#5a5f67]">
              管理词书的核心信息与封面配置。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="h-10 rounded-full bg-[#1d1f22] px-4 text-xs font-semibold text-white shadow-lg shadow-black/15"
            >
              新建词书
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
          <div className="grid grid-cols-[0.6fr_1.4fr_0.6fr_1fr_0.8fr] bg-[#f5efe6] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b5b45]">
            <span>封面</span>
            <span>标题</span>
            <span>词条数</span>
            <span>Book ID</span>
            <span>操作</span>
          </div>
          <div className="divide-y divide-black/5 bg-white">
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[0.6fr_1.4fr_0.6fr_1fr_0.8fr] items-center gap-2 px-4 py-4 text-sm"
              >
                <div className="flex items-center gap-3">
                  {row.coverUrl ? (
                    <img
                      src={row.coverUrl}
                      alt={row.title}
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-black/10"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3eee7] text-xs font-semibold text-[#7a7f87]">
                      无图
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[#1d1f22]">{row.title}</p>
                  <p className="text-xs text-[#7a7f87]">
                    标签：{row.tags.join("，") || "未设置"}
                  </p>
                </div>
                <span className="text-[#4b5058]">{row.wordCount}</span>
                <span className="text-[#4b5058]">{row.bookId}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(row)}
                    className="h-9 rounded-full border border-black/10 px-3 text-xs font-semibold text-[#1d1f22]"
                  >
                    编辑
                  </button>
                  <form
                    action={onDelete}
                    onSubmit={(event) => {
                      if (!window.confirm("确认删除该词书及其全部单词？")) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="bookId" value={row.bookId} />
                    <button
                      type="submit"
                      className="h-9 rounded-full border border-rose-200 px-3 text-xs font-semibold text-rose-600"
                    >
                      删除
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {createOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1d1f22]">
                新建单词书
              </h3>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-full border border-black/10 px-3 py-1 text-xs text-[#4b5058]"
              >
                关闭
              </button>
            </div>
            <form action={onCreate} className="mt-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2f343d]">
                  标题
                </label>
                <input
                  name="title"
                  className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm"
                  placeholder="例如：核心高频词书"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2f343d]">
                    单词数量
                  </label>
                  <input
                    name="wordCount"
                    type="number"
                    min="0"
                    className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm"
                    placeholder="例如：2400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2f343d]">
                    Book ID
                  </label>
                  <input
                    name="bookId"
                    className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm"
                    placeholder="例如：Level4luan_1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2f343d]">
                  封面 URL
                </label>
                <input
                  name="coverUrl"
                  className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm"
                  placeholder="https://"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2f343d]">
                  标签（逗号分割）
                </label>
                <input
                  name="tags"
                  className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm"
                  placeholder="四级, 高频, 30天"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="h-10 rounded-full border border-black/10 px-4 text-xs font-semibold text-[#1d1f22]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-full bg-[#1d1f22] px-4 text-xs font-semibold text-white shadow-lg shadow-black/15"
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {selected ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1d1f22]">
                编辑单词书
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
                  标题
                </label>
                <input
                  name="title"
                  defaultValue={selected.title}
                  className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2f343d]">
                    单词数量
                  </label>
                  <input
                    name="wordCount"
                    type="number"
                    min="0"
                    defaultValue={selected.wordCount}
                    className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2f343d]">
                    Book ID
                  </label>
                  <input
                    name="bookId"
                    defaultValue={selected.bookId}
                    className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2f343d]">
                  封面 URL
                </label>
                <input
                  name="coverUrl"
                  defaultValue={selected.coverUrl}
                  className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2f343d]">
                  标签（逗号分割）
                </label>
                <input
                  name="tags"
                  defaultValue={selected.tags.join(", ")}
                  className="h-10 w-full rounded-xl border border-black/10 px-4 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <label className="relative inline-flex items-center">
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="sr-only"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      if (uploading) return;

                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("bookId", selected.bookId);

                      setUploading(true);
                      const res = await fetch("/api/words/upload", {
                        method: "POST",
                        body: formData,
                      });
                      setUploading(false);
                      event.target.value = "";

                      if (res.ok) {
                        alert("上传完成");
                      } else {
                        const payload = await res.json().catch(() => null);
                        alert(payload?.message ?? "上传失败");
                      }
                    }}
                  />
                  <span className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 px-4 text-xs font-semibold text-[#1d1f22]">
                    {uploading ? "上传中..." : "上传单词"}
                  </span>
                </label>
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
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
