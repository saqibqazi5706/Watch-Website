"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { imageUrl } from "@/lib/sanity";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const image = imageUrl(product.images?.[0], 600, 750);
  const href = `/product/${product.slug}`;

  function buildItem() {
    return {
      id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image,
      brand: product.brand ?? null,
    };
  }

  function handleAdd() {
    addToCart(buildItem());
  }

  function handleBuyNow() {
    addToCart(buildItem());
    router.push("/checkout");
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700">
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden bg-zinc-800"
      >
        {image ? (
          <Image
            src={image}
            alt={product.images?.[0]?.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-600">
            No image
          </div>
        )}
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-zinc-950/80 px-2.5 py-1 text-xs font-medium text-zinc-300 backdrop-blur">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {product.brand}
          </p>
        )}
        <Link href={href} className="mt-1">
          <h3 className="line-clamp-2 font-semibold text-white transition-colors group-hover:text-amber-400">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-lg font-bold text-amber-400">
          {formatPrice(product.price)}
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className="w-full rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {product.inStock ? "Buy Now" : "Sold out"}
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className="w-full rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
