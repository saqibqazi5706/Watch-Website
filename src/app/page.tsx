import Link from "next/link";
import { sanityFetch } from "@/lib/sanity";
import { CATEGORIES_QUERY, FEATURED_PRODUCTS_QUERY } from "@/lib/queries";
import ProductGrid from "@/components/shop/ProductGrid";
import CategoryCard from "@/components/ui/CategoryCard";
import { SITE } from "@/lib/site";
import type { Category, Product } from "@/types";

const TRUST_POINTS = [
  "Authentic timepieces",
  "Cash on Delivery",
  "Nationwide shipping",
  "Easy WhatsApp support",
];

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    sanityFetch<Category[]>(CATEGORIES_QUERY),
    sanityFetch<Product[]>(FEATURED_PRODUCTS_QUERY),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.10),_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
            {SITE.name}
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Premium watches, made effortless.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
            Discover a curated collection of timepieces. Order in minutes with
            Cash on Delivery or bank transfer.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-lg bg-amber-400 px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
            >
              Shop the collection
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 text-center sm:grid-cols-4 sm:px-6 lg:px-8">
          {TRUST_POINTS.map((point) => (
            <p key={point} className="text-sm text-zinc-400">
              {point}
            </p>
          ))}
        </div>
      </section>

      {/* Shop by category */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Shop by category
            </h2>
            <Link
              href="/shop"
              className="text-sm text-amber-400 transition-colors hover:text-amber-300"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Featured watches */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Featured watches
          </h2>
          <Link
            href="/shop"
            className="text-sm text-amber-400 transition-colors hover:text-amber-300"
          >
            View all →
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>
    </div>
  );
}
