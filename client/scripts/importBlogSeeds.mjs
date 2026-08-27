import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { blogFormSeeds } from "../src/data/blogSeeds.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env.local");
const workspaceRoot = path.resolve(projectRoot, "..");
const require = createRequire(import.meta.url);
const { MongoClient } = require(path.join(workspaceRoot, "node_modules", "mongodb"));

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function run() {
  loadEnvFile(envPath);
  const mongoUri =
    process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/blogDB";
  const client = new MongoClient(mongoUri);
  await client.connect();

  try {
    const dbName = new URL(mongoUri).pathname.replace(/^\//, "") || "blogDB";
    const db = client.db(dbName);
    const collection = db.collection("blogs");
    const titles = blogFormSeeds.map((blog) => blog.title);
    const existing = await collection.find({ title: { $in: titles } }, { projection: { title: 1 } }).toArray();
    const existingTitles = new Set(existing.map((blog) => blog.title));

    const now = new Date();
    const blogsToInsert = blogFormSeeds
      .filter((blog) => !existingTitles.has(blog.title))
      .map((blog) => ({
        title: blog.title,
        author: blog.author,
        content: blog.content,
        category: blog.category,
        sourceUrl: blog.sourceUrl,
        sourceTitle: blog.title,
        imageUrl: "",
        url: "",
        generatedFromNews: false,
        likes: 0,
        comments: [],
        createdAt: now,
        updatedAt: now,
      }));

    if (blogsToInsert.length === 0) {
      console.log(JSON.stringify({ inserted: 0, skipped: blogFormSeeds.length, total: blogFormSeeds.length }, null, 2));
      return;
    }

    const result = await collection.insertMany(blogsToInsert, { ordered: true });

    console.log(
      JSON.stringify(
        {
          inserted: result.insertedCount,
          skipped: blogFormSeeds.length - result.insertedCount,
          total: blogFormSeeds.length,
        },
        null,
        2
      )
    );
  } finally {
    await client.close();
  }
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
