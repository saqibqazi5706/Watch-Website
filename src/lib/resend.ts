import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  // Don't throw at import time — emails are only sent server-side in the
  // orders route, and a missing key there should surface as a handled error.
  console.warn("RESEND_API_KEY is not set. Order emails will fail to send.");
}

export const resend = new Resend(apiKey);
