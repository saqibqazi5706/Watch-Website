import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2024-10-01";

// Server-only. Next strips non-NEXT_PUBLIC_ env from client bundles, so this is
// `undefined` in the browser — the token never leaves the server.
const readToken = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.warn(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity reads will fail until it is configured in .env.local"
  );
}

/**
 * Read-only Sanity client for products & categories.
 *
 * On the server we authenticate with the read token so fetches work whether the
 * dataset is public or private (and we skip the CDN to stay fresh + avoid
 * caching authenticated responses). In the browser the token is undefined, so
 * this falls back to a plain public CDN client — used only to build image URLs.
 */
export const client = createClient({
  projectId: projectId!,
  dataset,
  apiVersion,
  useCdn: !readToken,
  token: readToken,
  perspective: "published",
});

const builder = createImageUrlBuilder(client);

/** Build a Sanity image URL from an image source (asset ref or image object). */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Resolve a sized image URL, or null if no source. Safe for optional images.
 */
export function imageUrl(
  source: SanityImageSource | null | undefined,
  width = 800,
  height?: number
): string | null {
  if (!source) return null;
  let b = builder.image(source).width(width).fit("crop").auto("format");
  if (height) b = b.height(height);
  return b.url();
}

/**
 * Typed GROQ fetch helper with sensible caching defaults. Products/categories
 * change rarely, so a short ISR window keeps reads fast and cheap.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  revalidate: number | false = 60
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate },
  });
}
