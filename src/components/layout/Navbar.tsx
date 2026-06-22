"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { SITE, NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

interface NavCategory {
  name: string;
  slug: string;
}

export default function Navbar({
  categories = [],
}: {
  categories?: NavCategory[];
}) {
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  // "All Watches" first, then live categories from Sanity.
  const categoryLinks = [
    { href: "/shop", label: "All Watches" },
    ...categories.map((c) => ({
      href: `/category/${c.slug}`,
      label: c.name,
    })),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-amber-400"
        >
          {SITE.name}
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            Shop
          </Link>

          {/* Categories dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-zinc-300 transition-colors hover:text-white"
              onClick={() => setCategoriesOpen((v) => !v)}
            >
              Categories
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {categoriesOpen && (
              <div className="absolute left-0 top-full w-44 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 py-1 shadow-xl">
                {categoryLinks.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            Contact
          </Link>
        </div>

        {/* Right side: cart + mobile toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-lg p-2 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-.534 2.295-2.41 2.6-3.762a.75.75 0 00-.722-.962H5.106M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-semibold text-zinc-950">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 md:hidden">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-base text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <p className="px-3 pb-1 text-xs uppercase tracking-wide text-zinc-500">
                Categories
              </p>
              {categoryLinks.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm text-zinc-300",
                    "transition-colors hover:bg-zinc-800 hover:text-white"
                  )}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
