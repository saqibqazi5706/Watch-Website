"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

interface PaymentInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  whatsapp: string;
}

const optionBase =
  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors";
const optionActive = "border-amber-400 bg-amber-400/5";
const optionIdle = "border-zinc-700 hover:border-zinc-500";

export default function PaymentSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}) {
  const [info, setInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch bank details from the server only when needed (never from env on client).
  useEffect(() => {
    if (value === "bank_transfer" && !info && !loading) {
      setLoading(true);
      fetch("/api/payment-info")
        .then((r) => r.json())
        .then((d: PaymentInfo) => setInfo(d))
        .catch(() => setInfo(null))
        .finally(() => setLoading(false));
    }
  }, [value, info, loading]);

  const whatsappDigits = info?.whatsapp.replace(/[^0-9]/g, "") ?? "";

  return (
    <div className="space-y-3">
      {/* Cash on Delivery */}
      <label className={cn(optionBase, value === "cod" ? optionActive : optionIdle)}>
        <input
          type="radio"
          name="payment_method"
          checked={value === "cod"}
          onChange={() => onChange("cod")}
          className="mt-1 accent-amber-400"
        />
        <div>
          <p className="font-medium text-white">Cash on Delivery</p>
          {value === "cod" && (
            <p className="mt-1 text-sm text-zinc-400">
              Pay in cash when your order is delivered to your door.
            </p>
          )}
        </div>
      </label>

      {/* Bank Transfer */}
      <label
        className={cn(
          optionBase,
          value === "bank_transfer" ? optionActive : optionIdle
        )}
      >
        <input
          type="radio"
          name="payment_method"
          checked={value === "bank_transfer"}
          onChange={() => onChange("bank_transfer")}
          className="mt-1 accent-amber-400"
        />
        <div className="flex-1">
          <p className="font-medium text-white">Bank Transfer</p>
          {value === "bank_transfer" && (
            <div className="mt-2 text-sm text-zinc-300">
              {loading ? (
                <p className="text-zinc-500">Loading bank details…</p>
              ) : info ? (
                <div className="space-y-1 rounded-lg border border-zinc-700 bg-zinc-950 p-3">
                  <p>
                    Bank: <span className="text-white">{info.bankName}</span>
                  </p>
                  <p>
                    Account name:{" "}
                    <span className="text-white">{info.accountName}</span>
                  </p>
                  <p>
                    Account number:{" "}
                    <span className="text-white">{info.accountNumber}</span>
                  </p>
                  <p className="pt-1 text-zinc-400">
                    After paying, send your receipt on WhatsApp:{" "}
                    {whatsappDigits ? (
                      <a
                        href={`https://wa.me/${whatsappDigits}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300"
                      >
                        {info.whatsapp}
                      </a>
                    ) : (
                      <span className="text-white">{info.whatsapp}</span>
                    )}
                  </p>

                  {/*
                    Future-ready receipt upload — fully built but inert.
                    Hidden via `hidden`; enable later by removing that class.
                    It is not submitted with the order while hidden.
                  */}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    data-future="receipt-upload"
                    disabled
                  />
                </div>
              ) : (
                <p className="text-zinc-500">
                  Bank details are unavailable right now — please contact us.
                </p>
              )}
            </div>
          )}
        </div>
      </label>
    </div>
  );
}
