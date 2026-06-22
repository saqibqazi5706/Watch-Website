import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${SITE.name} — we're here to help on WhatsApp or email.`,
  openGraph: {
    title: `Contact — ${SITE.name}`,
    description: `Get in touch with ${SITE.name}.`,
  },
};

export default function ContactPage() {
  // Contact details read server-side from env (never NEXT_PUBLIC_).
  const whatsapp = process.env.OWNER_WHATSAPP ?? "";
  const email = process.env.OWNER_EMAIL ?? "";
  const whatsappDigits = whatsapp.replace(/[^0-9]/g, "");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-2 text-zinc-400">
          Have a question about a watch or your order? We&apos;d love to help.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <ContactForm />

        <aside className="space-y-4">
          {whatsappDigits && (
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-4 font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.42 1.31-1.95 1.36-.5.05-.97.24-3.27-.68-2.76-1.09-4.5-3.94-4.64-4.13-.13-.19-1.1-1.47-1.1-2.8 0-1.33.7-1.99.95-2.26.24-.27.53-.34.71-.34l.51.01c.16.01.39-.06.6.46.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.16.27.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.45.12.61-.07.16-.19.7-.81.89-1.09.19-.27.37-.23.62-.14.25.09 1.61.76 1.88.9.28.14.46.21.53.32.07.12.07.68-.17 1.36Z" />
              </svg>
              Chat on WhatsApp
            </a>
          )}
          {email && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm text-zinc-500">Email us</p>
              <a
                href={`mailto:${email}`}
                className="mt-1 block break-all font-medium text-white transition-colors hover:text-amber-400"
              >
                {email}
              </a>
            </div>
          )}
          {whatsapp && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm text-zinc-500">WhatsApp</p>
              <p className="mt-1 font-medium text-white">{whatsapp}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
