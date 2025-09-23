/**
 * Public Supabase Client
 * ----------------------
 * For fetching public data without authentication.
 * This client doesn't use cookies, allowing static generation.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  );
}
