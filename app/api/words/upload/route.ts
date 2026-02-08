import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { words } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const BATCH_SIZE = 500;

export async function POST(request: Request) {
  await requireAuth();

  const formData = await request.formData();
  const file = formData.get("file");
  const overrideBookId = String(formData.get("bookId") ?? "").trim();

  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "缺少上传文件" }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.split(/\r?\n/);

  let batch: Array<{
    wordRank: number;
    headWord: string;
    wordId: string;
    bookId: string;
    content: unknown;
  }> = [];
  let inserted = 0;

  async function flush() {
    if (!batch.length) return;

    for (const item of batch) {
      await db
        .insert(words)
        .values(item)
        .onDuplicateKeyUpdate({
          set: {
            wordRank: item.wordRank,
            headWord: item.headWord,
            bookId: item.bookId,
            content: item.content,
          },
        });
      inserted += 1;
    }

    batch = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let parsed: any;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      continue;
    }

    const wordRank = Number(parsed.wordRank ?? 0);
    const headWord = String(parsed.headWord ?? "").trim();
    const wordId = String(parsed?.content?.word?.wordId ?? "").trim();
    const bookId =
      overrideBookId || String(parsed.bookId ?? "").trim();

    if (!wordRank || !headWord || !wordId || !bookId) {
      continue;
    }

    batch.push({
      wordRank,
      headWord,
      wordId,
      bookId,
      content: parsed,
    });

    if (batch.length >= BATCH_SIZE) {
      await flush();
    }
  }

  await flush();

  revalidatePath("/books");

  return NextResponse.json({ ok: true, inserted });
}
