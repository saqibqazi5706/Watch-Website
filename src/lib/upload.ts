/**
 * Client helper for uploading a bank-transfer receipt. Built and ready, but NOT
 * wired into the checkout form yet (the receipt field is hidden for now).
 *
 * When enabled: validates type/size client-side, then POSTs to the server route
 * `/api/upload-receipt`, which stores the file in Supabase Storage and returns a
 * public URL to save in `orders.receipt_url`. The browser never talks to
 * Supabase Storage directly.
 */
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function uploadReceipt(
  file: File,
  orderNumber: string
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPEG, PNG and WebP images are allowed");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("File size must be under 10MB");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("orderNumber", orderNumber);

  const response = await fetch("/api/upload-receipt", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Upload failed");
  const { url } = await response.json();
  return url as string;
}
