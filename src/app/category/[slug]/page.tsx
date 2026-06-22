import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity";
import {
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_SLUGS_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
} from "@/lib/queries";
import ProductGrid from "@/components/shop/ProductGrid";
import type { Category, Product } from "@/types";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(
    CATEGORY_SLUGS_QUERY,
    {},
    false
  );
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await sanityFetch<Category | null>(CATEGORY_BY_SLUG_QUERY, {
    slug,
  });
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: category.description ?? `Browse ${category.name} watches.`,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [category, products] = await Promise.all([
    sanityFetch<Category | null>(CATEGORY_BY_SLUG_QUERY, { slug }),
    sanityFetch<Product[]>(PRODUCTS_BY_CATEGORY_QUERY, { slug }),
  ]);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-zinc-800 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-3 max-w-2xl text-zinc-400">{category.description}</p>
        )}
        <p className="mt-3 text-sm text-zinc-500">
          {products.length} {products.length === 1 ? "watch" : "watches"}
        </p>
      </header>
      <ProductGrid products={products} />
    </div>
  );
}
