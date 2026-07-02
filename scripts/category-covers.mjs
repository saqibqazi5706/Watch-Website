/**
 * Uploads a cover image for the Male and Female categories.
 * Run:  node scripts/category-covers.mjs
 */
import { readFileSync, createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const env = {};
  const raw = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

const env = loadEnv();
const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: env.SANITY_API_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const BASE = "C:/Users/saqib/Downloads/olevs-extract/Olevs compress";

const covers = [
  {
    catId: "seed.category.male",
    file: `${BASE}/3660 compressed/iloveimg-compressed/26.jpg`,
    alt: "Men's watches",
  },
  {
    catId: "seed.category.female",
    file: `${BASE}/9971 compressed/iloveimg-compressed/1-(100).jpg`,
    alt: "Women's watches",
  },
];

async function run() {
  for (const c of covers) {
    const asset = await client.assets.upload("image", createReadStream(c.file), {
      filename: basename(c.file),
    });
    await client
      .patch(c.catId)
      .set({
        coverImage: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: c.alt,
        },
      })
      .commit();
    console.log(`✓ set cover for ${c.catId}`);
  }
  console.log("Done.");
}

run().catch((err) => {
  console.error("Cover upload failed:", err.message);
  process.exit(1);
});
