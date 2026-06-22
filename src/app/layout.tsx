import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE } from "@/lib/site";
import { sanityFetch } from "@/lib/sanity";
import { CATEGORIES_QUERY } from "@/lib/queries";
import type { Category } from "@/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Luxury Watches`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.tagline,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Categories power the navbar dropdown. Fail soft so a Sanity hiccup never
  // takes down the whole site shell.
  let categories: Category[] = [];
  try {
    categories = await sanityFetch<Category[]>(CATEGORIES_QUERY, {}, 300);
  } catch {
    categories = [];
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-300">
        <CartProvider>
          <Navbar
            categories={categories.map((c) => ({
              name: c.name,
              slug: c.slug,
            }))}
          />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
