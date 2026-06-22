"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice, cn } from "@/lib/utils";
import PaymentSelector from "@/components/checkout/PaymentSelector";
import type { PaymentMethod } from "@/types";

interface FormState {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  street: string;
  city: string;
  postal_code: string;
}

const EMPTY: FormState = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  street: "",
  city: "",
  postal_code: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]+$/;

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const e: Partial<Record<keyof FormState, string>> = {};
  if (form.customer_name.trim().length < 2) e.customer_name = "Enter your full name";
  if (!EMAIL_RE.test(form.customer_email.trim())) e.customer_email = "Enter a valid email";
  const phone = form.customer_phone.trim();
  if (phone.length < 10 || phone.length > 15 || !PHONE_RE.test(phone))
    e.customer_phone = "Enter a valid phone number";
  if (form.street.trim().length < 5) e.street = "Enter your street address";
  if (form.city.trim().length < 2) e.city = "Enter your city";
  if (form.postal_code.trim().length < 4) e.postal_code = "Enter your postal code";
  return e;
}

export default function CheckoutForm() {
  const router = useRouter();
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function update(key: keyof FormState, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return; // hard guard against double-submit
    setErrorMessage("");

    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    if (cartCount === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name.trim(),
          customer_email: form.customer_email.trim().toLowerCase(),
          customer_phone: form.customer_phone.trim(),
          address: {
            street: form.street.trim(),
            city: form.city.trim(),
            postal_code: form.postal_code.trim(),
          },
          payment_method: paymentMethod,
          items: cartItems.map((i) => ({
            product_id: i.id,
            product_name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Order failed. Please try again.");
      }

      const { orderNumber } = await response.json();
      clearCart();
      // Don't re-enable the button on success — redirect immediately.
      router.push(
        `/order-confirmed?order=${orderNumber}&method=${paymentMethod}`
      );
    } catch (error) {
      setIsSubmitting(false); // only re-enable on error
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }

  if (cartCount === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
        <p className="text-zinc-400">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-4 inline-block rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
        >
          Browse watches
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Details */}
      <div className="space-y-6">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Delivery details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" error={errors.customer_name} className="sm:col-span-2">
              <input
                value={form.customer_name}
                onChange={(e) => update("customer_name", e.target.value)}
                className={inputCls(errors.customer_name)}
                autoComplete="name"
              />
            </Field>
            <Field label="Email" error={errors.customer_email}>
              <input
                type="email"
                value={form.customer_email}
                onChange={(e) => update("customer_email", e.target.value)}
                className={inputCls(errors.customer_email)}
                autoComplete="email"
              />
            </Field>
            <Field label="Phone" error={errors.customer_phone}>
              <input
                value={form.customer_phone}
                onChange={(e) => update("customer_phone", e.target.value)}
                className={inputCls(errors.customer_phone)}
                autoComplete="tel"
                inputMode="tel"
              />
            </Field>
            <Field label="Street Address" error={errors.street} className="sm:col-span-2">
              <input
                value={form.street}
                onChange={(e) => update("street", e.target.value)}
                className={inputCls(errors.street)}
                autoComplete="street-address"
              />
            </Field>
            <Field label="City" error={errors.city}>
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputCls(errors.city)}
                autoComplete="address-level2"
              />
            </Field>
            <Field label="Postal Code" error={errors.postal_code}>
              <input
                value={form.postal_code}
                onChange={(e) => update("postal_code", e.target.value)}
                className={inputCls(errors.postal_code)}
                autoComplete="postal-code"
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Payment method</h2>
          <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
        </section>
      </div>

      {/* Summary */}
      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Order summary</h2>
          <ul className="space-y-3">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="text-zinc-300">
                  {item.name}{" "}
                  <span className="text-zinc-500">× {item.quantity}</span>
                </span>
                <span className="text-zinc-300">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-zinc-800 pt-4">
            <span className="font-semibold text-white">Total</span>
            <span className="font-bold text-amber-400">
              {formatPrice(cartTotal)}
            </span>
          </div>

          {errorMessage && (
            <p className="mt-4 rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-300">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950/40 border-t-zinc-950" />
            )}
            {isSubmitting ? "Placing order…" : "Place Order"}
          </button>
          <p className="mt-3 text-center text-xs text-zinc-500">
            Free shipping nationwide
          </p>
        </div>
      </aside>
    </form>
  );
}

function inputCls(error?: string) {
  return cn(
    "w-full rounded-lg border bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 outline-none transition-colors focus:border-amber-400",
    error ? "border-red-700" : "border-zinc-700"
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm text-zinc-400">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
