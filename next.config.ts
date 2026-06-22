import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Browser may connect to: same origin (API routes), Supabase, Sanity. In dev we
// also allow websockets + localhost for Turbopack HMR.
const connectSrc = [
  "'self'",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "https://*.sanity.io",
  "https://*.apicdn.sanity.io",
].filter(Boolean) as string[];
if (isDev) connectSrc.push("ws:", "http://localhost:*");

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  `connect-src ${connectSrc.join(" ")}`,
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity-hosted product/category images.
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
