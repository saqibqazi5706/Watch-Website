import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch, imageUrl } from "@/lib/sanity";
import {
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_SLUGS_QUERY,
  RELATED_PRODUCTS_QUERY,
} from "@/lib/queries";
import ProductDetail from "@/components/product/ProductDetail";
import ProductGrid from "@/components/shop/ProductGrid";
import type { Product } from "@/types";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(
    PRODUCT_SLUGS_QUERY,
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
  const product = await sanityFetch<Product | null>(PRODUCT_BY_SLUG_QUERY, {
    slug,
  });
  if (!product) return { title: "Product" };

  const ogImage = imageUrl(product.images?.[0], 1200, 630);
  return {
    title: product.name,
    description: `${product.brand ? product.brand + " — " : ""}${product.name}`,
    openGraph: {
      title: product.name,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await sanityFetch<Product | null>(PRODUCT_BY_SLUG_QUERY, {
    slug,
  });

  if (!product) notFound();

  const related = product.category
    ? await sanityFetch<Product[]>(RELATED_PRODUCTS_QUERY, {
        categorySlug: product.category.slug,
        slug: product.slug,
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-16 border-t border-zinc-800 pt-10">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-white">
            Related watches
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
