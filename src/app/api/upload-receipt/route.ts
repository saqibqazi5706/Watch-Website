import { type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// Receipt upload endpoint — BUILT AND READY, but not wired into the form yet.
// When enabled, create a public Supabase Storage bucket named `receipts`.
// The browser never uploads to Supabase directly; it POSTs here and the
// service-role client performs the upload.

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 5MB
const BUCKET = "receipts";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const orderNumber = String(form.get("orderNumber") ?? "").trim();

    if (!(file instanceof File)) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: "Only JPEG, PNG and WebP images are allowed" },
        { status: 415 }
      );
    }
    if (file.size > MAX_SIZE_BYTES) {
      return Response.json(
        { error: "File size must be under 5MB" },
        { status: 413 }
      );
    }

    const ext = file.type.split("/")[1];
    const safeOrder = orderNumber.replace(/[^A-Za-z0-9-]/g, "") || "unknown";
    const path = `${safeOrder}/${Date.now()}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { error } = await supabaseServer.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: false });

    if (error) {
      console.error("Receipt upload failed:", error);
      return Response.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data } = supabaseServer.storage.from(BUCKET).getPublicUrl(path);
    return Response.json({ url: data.publicUrl });
  } catch (error) {
    console.error("Receipt upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
