import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

/**
 * Public client — uses the anon key. Supabase holds orders only (products and
 * categories live in Sanity). Kept for any client-side order lookups.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Service-role client — bypasses RLS. SERVER-ONLY. Never import this into a
 * client component. Used by the orders API route to insert orders/items.
 */
export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }
  return createClient(supabaseUrl!, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
