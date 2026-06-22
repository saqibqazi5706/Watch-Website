import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity";
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from "@/lib/queries";
import ShopView from "@/components/shop/ShopView";
import type { Category, Product } from "@/types";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our full collection of premium watches.",
  openGraph: {
    title: "Shop — OLEVS",
    description: "Browse our full collection of premium watches.",
  },
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    sanityFetch<Product[]>(PRODUCTS_QUERY),
    sanityFetch<Category[]>(CATEGORIES_QUERY),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Shop</h1>
        <p className="mt-2 text-zinc-400">
          {products.length} {products.length === 1 ? "watch" : "watches"}{" "}
          available
        </p>
      </header>
      <ShopView products={products} categories={categories} />
    </div>
  );
}
