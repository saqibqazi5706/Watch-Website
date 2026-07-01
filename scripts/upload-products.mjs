/**
 * Uploads OLEVS products (from the extracted image archive) into Sanity.
 * Manifest-driven: reads scripts/products-manifest.json = [{ model, name, gender, price }].
 *
 * For each model folder it uploads the gallery images (all non-banner jpgs,
 * capped) and the banner/description images (jpgs under any `banner/` folder),
 * then creates the product referencing the Male/Female category.
 *
 * Idempotent: skips products whose _id already exists (so re-runs don't
 * duplicate assets). Delete the product in the Studio to re-upload.
 *
 * Run:  node scripts/upload-products.mjs
 * Env:  OLEVS_DIR (base extract path), GALLERY_CAP (default 12)
 */
import { readFileSync, createReadStream, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";
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

const EXTRACT_BASE =
  process.env.OLEVS_DIR ||
  "C:/Users/saqib/Downloads/olevs-extract/Olevs compress";
const GALLERY_CAP = Number(process.env.GALLERY_CAP || 12);

const manifest = JSON.parse(
  readFileSync(join(__dirname, "products-manifest.json"), "utf8")
);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const natSort = (a, b) =>
  basename(a).localeCompare(basename(b), undefined, { numeric: true });

let keyCounter = 0;
async function uploadImage(path) {
  const asset = await client.assets.upload("image", createReadStream(path), {
    filename: basename(path),
  });
  return {
    _type: "image",
    _key: `img${Date.now()}${keyCounter++}`,
    asset: { _type: "reference", _ref: asset._id },
  };
}

async function run() {
  let created = 0;
  for (const p of manifest) {
    const id = `olevs.${p.model}`;
    const exists = await client.fetch(`*[_id == $id][0]._id`, { id });
    if (exists) {
      console.log(`skip ${p.model} — already exists`);
      continue;
    }

    const dir = join(EXTRACT_BASE, `${p.model} compressed`);
    let files;
    try {
      files = walk(dir);
    } catch {
      console.log(`!! no folder for ${p.model} at ${dir}`);
      continue;
    }

    const jpgs = files.filter((f) => /\.jpe?g$/i.test(f));
    const isBanner = (f) => /[\/\\]banner[\/\\]/i.test(f);
    const bannerFiles = jpgs.filter(isBanner).sort(natSort);
    const galleryFiles = jpgs
      .filter((f) => !isBanner(f))
      .sort(natSort)
      .slice(0, GALLERY_CAP);

    console.log(
      `${p.model}: ${galleryFiles.length} gallery + ${bannerFiles.length} banner → uploading...`
    );

    const images = [];
    for (const f of galleryFiles) images.push(await uploadImage(f));
    const bannerImages = [];
    for (const f of bannerFiles) bannerImages.push(await uploadImage(f));

    const catKey = p.gender === "female" ? "female" : "male";
    await client.createOrReplace({
      _id: id,
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: `olevs-${p.model}` },
      brand: "OLEVS",
      sku: String(p.model),
      price: p.price,
      inStock: true,
      category: { _type: "reference", _ref: `seed.category.${catKey}` },
      images,
      bannerImages,
    });
    created++;
    console.log(`  ✓ created ${p.name}`);
  }
  console.log(`\nDone. Created ${created} product(s).`);
}

run().catch((err) => {
  console.error("Upload failed:", err.message);
  process.exit(1);
});
