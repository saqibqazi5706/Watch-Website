"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function update(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Enter your name";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email";
    if (form.message.trim().length < 5) next.message = "Enter a message";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    // No backend for now — just acknowledge.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <p className="text-lg font-semibold text-white">Thanks for reaching out!</p>
        <p className="mt-2 text-sm text-zinc-400">
          We&apos;ve received your message and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
    >
      <div>
        <label className="mb-1 block text-sm text-zinc-400">Name</label>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={inputCls(errors.name)}
          autoComplete="name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm text-zinc-400">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={inputCls(errors.email)}
          autoComplete="email"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm text-zinc-400">Message</label>
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={5}
          className={cn(inputCls(errors.message), "resize-y")}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-400">{errors.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-amber-400 px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
      >
        Send message
      </button>
    </form>
  );
}

function inputCls(error?: string) {
  return cn(
    "w-full rounded-lg border bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 outline-none transition-colors focus:border-amber-400",
    error ? "border-red-700" : "border-zinc-700"
  );
}
