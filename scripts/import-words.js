const fs = require("fs");
const readline = require("readline");
const mysql = require("mysql2/promise");

function loadEnvFile() {
  const envPath = ".env";
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

const BATCH_SIZE = 500;

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Usage: node scripts/import-words.js <path-to-json>");
    process.exit(1);
  }

  loadEnvFile();
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const connection = await mysql.createConnection({ uri: connectionString });

  const stream = fs.createReadStream(filePath, { encoding: "utf8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let batch = [];
  let total = 0;

  async function flush() {
    if (!batch.length) return;
    const sql =
      "INSERT INTO words (word_rank, head_word, word_id, book_id, content) VALUES ? " +
      "ON DUPLICATE KEY UPDATE " +
      "word_rank = VALUES(word_rank), " +
      "head_word = VALUES(head_word), " +
      "book_id = VALUES(book_id), " +
      "content = VALUES(content)";

    await connection.query(sql, [batch]);
    total += batch.length;
    batch = [];
  }

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch (error) {
      console.warn("Skip invalid JSON line:", error.message);
      continue;
    }

    const wordRank = Number(parsed.wordRank ?? 0);
    const headWord = String(parsed.headWord ?? "").trim();
    const wordId = String(parsed?.content?.word?.wordId ?? "").trim();
    const bookId = String(parsed.bookId ?? "").trim();

    if (!wordRank || !headWord || !wordId || !bookId) {
      continue;
    }

    batch.push([
      wordRank,
      headWord,
      wordId,
      bookId,
      JSON.stringify(parsed),
    ]);

    if (batch.length >= BATCH_SIZE) {
      await flush();
    }
  }

  await flush();
  await connection.end();

  console.log(`Import done. Total rows: ${total}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
