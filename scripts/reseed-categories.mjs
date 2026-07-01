/**
 * Converts the demo categories to Male / Female, reassigns the demo watches
 * across them, and removes the old Luxury/Sport/Classic categories.
 * One-off helper — run:  node scripts/reseed-categories.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].trim();
    }
  } catch {}
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

const newCategories = [
  { key: "male", name: "Male", description: "Watches for men." },
  { key: "female", name: "Female", description: "Watches for women." },
];

// Reassign the 6 demo products across the two categories.
const assignment = {
  "aero-chrono": "male",
  "diver-pro": "male",
  "heritage-gold": "male",
  "field-classic": "female",
  "minimal-slim": "female",
  "noir-automatic": "female",
};

const oldCategoryIds = [
  "seed.category.luxury",
  "seed.category.sport",
  "seed.category.classic",
];

async function run() {
  const tx = client.transaction();

  for (const c of newCategories) {
    tx.createOrReplace({
      _id: `seed.category.${c.key}`,
      _type: "category",
      name: c.name,
      slug: { _type: "slug", current: c.key },
      description: c.description,
    });
  }

  for (const [productKey, categoryKey] of Object.entries(assignment)) {
    tx.patch(`seed.product.${productKey}`, {
      set: {
        category: {
          _type: "reference",
          _ref: `seed.category.${categoryKey}`,
        },
      },
    });
  }

  // Products now point at male/female, so the old categories are unreferenced.
  for (const id of oldCategoryIds) tx.delete(id);

  await tx.commit();
  console.log("Categories converted to Male / Female; products reassigned.");
}

run().catch((err) => {
  console.error("Reseed failed:", err.message);
  process.exit(1);
});
