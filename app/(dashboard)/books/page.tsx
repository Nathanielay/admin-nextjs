import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";

import { books, words } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import BooksManager from "./_components/books-manager";

async function handleCreateBook(formData: FormData) {
  "use server";
  await requireAuth();

  const title = String(formData.get("title") ?? "").trim();
  const wordCount = Number(formData.get("wordCount") ?? 0);
  const coverUrl = String(formData.get("coverUrl") ?? "").trim();
  const bookId = String(formData.get("bookId") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();

  if (!title || !bookId) {
    return;
  }

  const tags = tagsRaw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  await db.insert(books).values({
    title,
    wordCount,
    coverUrl,
    bookId,
    tags,
  });

  revalidatePath("/books");
}

async function handleUpdateBook(formData: FormData) {
  "use server";
  await requireAuth();

  const id = Number(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const wordCount = Number(formData.get("wordCount") ?? 0);
  const coverUrl = String(formData.get("coverUrl") ?? "").trim();
  const bookId = String(formData.get("bookId") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();

  if (!id || !title || !bookId) {
    return;
  }

  const tags = tagsRaw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  await db
    .update(books)
    .set({ title, wordCount, coverUrl, bookId, tags, updatedAt: new Date() })
    .where(eq(books.id, id));

  revalidatePath("/books");
}

async function handleDeleteBook(formData: FormData) {
  "use server";
  await requireAuth();

  const bookId = String(formData.get("bookId") ?? "").trim();
  if (!bookId) {
    return;
  }

  await db.delete(words).where(eq(words.bookId, bookId));
  await db.delete(books).where(eq(books.bookId, bookId));
  revalidatePath("/books");
}

export default async function BooksPage() {
  await requireAuth();
  let rows = [];
  try {
    rows = await db.select().from(books).orderBy(books.createdAt);
  } catch (error) {
    console.error("Failed to load books:", error);
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-900">
        词书数据加载失败，请确认数据库迁移已执行并检查连接配置。
      </div>
    );
  }
  const normalized = rows.map((row) => ({
    id: row.id,
    title: row.title,
    wordCount: row.wordCount,
    coverUrl: row.coverUrl,
    bookId: row.bookId,
    tags: Array.isArray(row.tags) ? row.tags : [],
  }));

  return (
    <BooksManager
      rows={normalized}
      onCreate={handleCreateBook}
      onUpdate={handleUpdateBook}
      onDelete={handleDeleteBook}
    />
  );
}
