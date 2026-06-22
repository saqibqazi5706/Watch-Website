// Serves customer-facing payment details from server-only env vars so the
// browser never reads BANK_* / OWNER_WHATSAPP from a NEXT_PUBLIC_ variable.
// These values are shown to customers at checkout, so exposing them here is by
// design (no secrets involved).
export async function GET() {
  return Response.json({
    bankName: process.env.BANK_NAME ?? "",
    accountName: process.env.BANK_ACCOUNT_NAME ?? "",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "",
    whatsapp: process.env.OWNER_WHATSAPP ?? "",
  });
}
