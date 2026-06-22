/**
 * Seeds a few sample categories and watches into Sanity so the storefront
 * renders during development. These are disposable demo docs (ids prefixed
 * with `seed.`) — delete them in the Studio once real products are added.
 *
 * Run:  node scripts/seed.mjs
 * Reads project id, dataset and token from .env.local.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Load env from .env.local -------------------------------------------------
function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].trim();
    }
  } catch {
    // ignore
  }
  return env;
}

const env = loadEnv();
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_API_TOKEN in .env.local (needs an Editor token to write)."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

// --- Demo content -------------------------------------------------------------
const categories = [
  { key: "luxury", name: "Luxury", description: "Refined dress watches for every occasion." },
  { key: "sport", name: "Sport", description: "Durable timepieces built for movement." },
  { key: "classic", name: "Classic", description: "Timeless designs that never go out of style." },
];

const products = [
  { key: "aero-chrono", name: "OLEVS Aero Chronograph", brand: "OLEVS", price: 12500, cat: "sport", sku: "OL-2880" },
  { key: "noir-automatic", name: "OLEVS Noir Automatic", brand: "OLEVS", price: 18900, cat: "luxury", sku: "OL-6610" },
  { key: "heritage-gold", name: "OLEVS Heritage Gold", brand: "OLEVS", price: 21500, cat: "luxury", sku: "OL-9921" },
  { key: "field-classic", name: "OLEVS Field Classic", brand: "OLEVS", price: 8900, cat: "classic", sku: "OL-1204" },
  { key: "diver-pro", name: "OLEVS Diver Pro 200m", brand: "OLEVS", price: 15400, cat: "sport", sku: "OL-3370" },
  { key: "minimal-slim", name: "OLEVS Minimal Slim", brand: "OLEVS", price: 7600, cat: "classic", sku: "OL-4455" },
];

async function run() {
  const tx = client.transaction();

  for (const c of categories) {
    tx.createOrReplace({
      _id: `seed.category.${c.key}`,
      _type: "category",
      name: c.name,
      slug: { _type: "slug", current: c.key },
      description: c.description,
    });
  }

  for (const p of products) {
    tx.createOrReplace({
      _id: `seed.product.${p.key}`,
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: p.key },
      brand: p.brand,
      sku: p.sku,
      price: p.price,
      inStock: true,
      category: { _type: "reference", _ref: `seed.category.${p.cat}` },
      description: [
        {
          _type: "block",
          _key: "d1",
          style: "normal",
          children: [
            {
              _type: "span",
              _key: "s1",
              text: `${p.name} — a sample product created by the seed script. Replace with real details and images in the Studio.`,
            },
          ],
        },
      ],
    });
  }

  await tx.commit();
  console.log(
    `Seeded ${categories.length} categories and ${products.length} products.`
  );
  console.log("Tip: add images to each product in the Studio for the full look.");
}

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
