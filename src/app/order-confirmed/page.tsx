import type { Metadata } from "next";
import Link from "next/link";
import ClearCartOnMount from "@/components/cart/ClearCartOnMount";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

type SearchParams = Promise<{ order?: string; method?: string }>;

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { order, method } = await searchParams;
  const isBankTransfer = method === "bank_transfer";

  // Bank details are read server-side from env — never exposed via NEXT_PUBLIC_.
  const bank = isBankTransfer
    ? {
        name: process.env.BANK_NAME ?? "",
        accountName: process.env.BANK_ACCOUNT_NAME ?? "",
        accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "",
        whatsapp: process.env.OWNER_WHATSAPP ?? "",
      }
    : null;
  const whatsappDigits = bank?.whatsapp.replace(/[^0-9]/g, "") ?? "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      {/* Empties the cart on mount (belt-and-suspenders; checkout also clears it). */}
      <ClearCartOnMount />

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/10">
        <svg
          className="h-8 w-8 text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
        Thank you for your order!
      </h1>
      {order && (
        <p className="mt-2 text-zinc-400">
          Your order number is{" "}
          <span className="font-semibold text-amber-400">{order}</span>
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-left">
        <h2 className="text-lg font-semibold text-white">What happens next</h2>
        {isBankTransfer ? (
          <div className="mt-3 space-y-3 text-sm text-zinc-300">
            <p>Please complete your payment via bank transfer:</p>
            <div className="space-y-1 rounded-lg border border-zinc-700 bg-zinc-950 p-3">
              <p>
                Bank: <span className="text-white">{bank?.name}</span>
              </p>
              <p>
                Account name:{" "}
                <span className="text-white">{bank?.accountName}</span>
              </p>
              <p>
                Account number:{" "}
                <span className="text-white">{bank?.accountNumber}</span>
              </p>
            </div>
            <p>
              After paying, send your payment receipt on WhatsApp:{" "}
              {whatsappDigits ? (
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300"
                >
                  {bank?.whatsapp}
                </a>
              ) : (
                <span className="text-white">{bank?.whatsapp}</span>
              )}
            </p>
            <p className="text-zinc-500">
              We&apos;ll confirm and dispatch your order once payment is verified.
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            <p>You&apos;ve chosen <strong>Cash on Delivery</strong>.</p>
            <p>
              We&apos;ll contact you shortly to confirm your delivery details.
              Please have the order total ready in cash when your watch arrives.
            </p>
          </div>
        )}
        <p className="mt-4 text-sm text-zinc-500">
          A confirmation email is on its way to your inbox.
        </p>
      </div>

      <Link
        href="/shop"
        className="mt-8 inline-block rounded-lg bg-amber-400 px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
