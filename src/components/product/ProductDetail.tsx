"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { useCart } from "@/context/CartContext";
import { imageUrl } from "@/lib/sanity";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-3 text-zinc-300">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mb-2 mt-4 text-xl font-semibold text-white">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-3 text-lg font-semibold text-white">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-3 list-disc space-y-1 pl-5 text-zinc-300">{children}</ul>
    ),
  },
};

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selected, setSelected] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const images = product.images ?? [];
  const mainImage = imageUrl(images[selected], 900, 900);

  function handleAdd() {
    addToCart(
      {
        id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: imageUrl(images[0], 600, 600),
        brand: product.brand ?? null,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={images[selected]?.alt ?? product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-600">
              No image
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {images.map((img, i) => {
              const thumb = imageUrl(img, 200, 200);
              return (
                <button
                  key={img._key ?? i}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border bg-zinc-900",
                    i === selected
                      ? "border-amber-400"
                      : "border-zinc-800 hover:border-zinc-600"
                  )}
                >
                  {thumb && (
                    <Image
                      src={thumb}
                      alt={img.alt ?? `${product.name} thumbnail ${i + 1}`}
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        {product.brand && (
          <p className="text-sm uppercase tracking-wide text-zinc-500">
            {product.brand}
          </p>
        )}
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          {product.name}
        </h1>

        {product.category && (
          <Link
            href={`/category/${product.category.slug}`}
            className="mt-2 inline-block text-sm text-zinc-400 transition-colors hover:text-amber-400"
          >
            {product.category.name}
          </Link>
        )}

        <p className="mt-4 text-3xl font-bold text-amber-400">
          {formatPrice(product.price)}
        </p>

        <p className="mt-2 text-sm">
          {product.inStock ? (
            <span className="text-emerald-400">In stock</span>
          ) : (
            <span className="text-zinc-500">Currently sold out</span>
          )}
        </p>

        {product.description && product.description.length > 0 && (
          <div className="mt-6 border-t border-zinc-800 pt-6">
            <PortableText
              value={product.description}
              components={ptComponents}
            />
          </div>
        )}

        {/* Quantity + Add to cart */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-lg border border-zinc-700">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-zinc-300 transition-colors hover:text-white"
            >
              −
            </button>
            <span className="w-10 text-center text-white">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 text-zinc-300 transition-colors hover:text-white"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex-1 rounded-lg bg-amber-400 px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 sm:flex-none"
          >
            {added ? "Added ✓" : product.inStock ? "Add to Cart" : "Sold out"}
          </button>
        </div>

        {product.sku && (
          <p className="mt-6 text-xs text-zinc-600">SKU: {product.sku}</p>
        )}
      </div>
    </div>
  );
}
