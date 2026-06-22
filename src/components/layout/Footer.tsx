import Link from "next/link";
import { SITE } from "@/lib/site";

// Server component: reads owner contact details from env (never hardcoded).
export default function Footer() {
  const whatsapp = process.env.OWNER_WHATSAPP ?? "";
  const email = process.env.OWNER_EMAIL ?? "";
  const whatsappDigits = whatsapp.replace(/[^0-9]/g, "");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold tracking-tight text-amber-400">
              {SITE.name}
            </p>
            <p className="mt-2 max-w-xs text-sm text-zinc-500">
              {SITE.tagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-semibold text-white">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-white">Get in touch</p>
            <ul className="mt-3 space-y-2 text-sm">
              {whatsappDigits && (
                <li>
                  <a
                    href={`https://wa.me/${whatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 transition-colors hover:text-amber-400"
                  >
                    WhatsApp: {whatsapp}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="text-zinc-400 transition-colors hover:text-amber-400"
                  >
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-600">
          © {year} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
