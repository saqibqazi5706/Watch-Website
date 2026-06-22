import { createClient } from "@supabase/supabase-js";

/**
 * SERVER-ONLY Supabase client using the service-role key (bypasses RLS).
 *
 * ⚠️ Never import this file from a client component or anything that ends up in
 * the browser bundle. Import it only inside `src/app/api/**` route handlers.
 */
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);
