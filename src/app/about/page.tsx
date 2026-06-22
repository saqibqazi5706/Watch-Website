import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${SITE.name} — our story and why customers trust us for premium watches.`,
  openGraph: {
    title: `About — ${SITE.name}`,
    description: `Our story and why customers trust ${SITE.name}.`,
  },
};

const VALUES = [
  {
    title: "100% Authentic",
    body: "Every watch is genuine and quality-checked before it ships.",
  },
  {
    title: "Cash on Delivery",
    body: "Pay only when your watch arrives — no upfront risk.",
  },
  {
    title: "Nationwide Shipping",
    body: "Fast, reliable delivery to every city across the country.",
  },
  {
    title: "Real Human Support",
    body: "Questions before or after buying? We reply quickly on WhatsApp.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.10),_transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
            {SITE.name}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Watches worth your time
          </h1>
          <p className="mt-4 text-lg text-zinc-400">{SITE.tagline}</p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Our story
        </h2>
        <div className="mt-4 space-y-4 text-zinc-300">
          <p>
            {SITE.name} was founded on a simple idea: a great watch shouldn&apos;t
            be complicated to buy. We curate a focused collection of timepieces
            that balance design, durability and value — then make ordering them
            effortless.
          </p>
          <p>
            No accounts, no friction. Browse, add to cart, and check out as a
            guest with Cash on Delivery or a quick bank transfer. We handle the
            rest and keep you updated every step of the way.
          </p>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-white">
          Why choose us
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <h3 className="font-semibold text-white">{v.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{v.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-block rounded-lg bg-amber-400 px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
          >
            Explore the collection
          </Link>
        </div>
      </section>
    </div>
  );
}
