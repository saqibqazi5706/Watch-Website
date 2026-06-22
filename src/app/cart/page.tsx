"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart } =
    useCart();

  if (cartCount === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Your cart is empty
        </h1>
        <p className="mt-2 text-zinc-400">
          Looks like you haven&apos;t added any watches yet.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-lg bg-amber-400 px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
        >
          Browse watches
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-white">
        Your cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <Link
                href={`/product/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-800"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                    No image
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    {item.brand && (
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        {item.brand}
                      </p>
                    )}
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-semibold text-white hover:text-amber-400"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <p className="font-bold text-amber-400">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-zinc-700">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-zinc-300 transition-colors hover:text-white"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-zinc-300 transition-colors hover:text-white"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-zinc-500 transition-colors hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Order summary
            </h2>
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Shipping calculated at delivery — free nationwide.
            </p>
            <div className="mt-4 flex justify-between border-t border-zinc-800 pt-4">
              <span className="font-semibold text-white">Total</span>
              <span className="font-bold text-amber-400">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded-lg bg-amber-400 px-6 py-3 text-center font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="mt-3 block text-center text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
