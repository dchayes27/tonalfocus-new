/**
 * @file src/lib/supabase-client.ts
 * @description This module provides a factory function to create a Supabase client instance
 * specifically configured for browser environments (client-side).
 * It utilizes the `@supabase/ssr` library's `createBrowserClient` function.
 *
 * This client is intended for use in React Client Components or any client-side
 * JavaScript code where interaction with Supabase is needed (e.g., fetching data
 * directly, handling user sessions if not using server-side auth helpers).
 *
 * It relies on environment variables prefixed with `NEXT_PUBLIC_` to be accessible
 * in the browser.
 */
import { createBrowserClient, SupabaseClient } from '@supabase/ssr'

/**
 * Creates and returns a Supabase client instance for use in browser environments.
 *
 * This function initializes the client with the Supabase URL and anonymous key
 * fetched from public environment variables (NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY). The use of `!` (non-null assertion operator)
 * implies that these environment variables are expected to be defined at runtime.
 *
 * @returns {SupabaseClient} An instance of the Supabase client configured for the browser.
 * @throws {Error} If the required environment variables (NEXT_PUBLIC_SUPABASE_URL or
 *                 NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set, though the non-null
 *                 assertion operator might suppress compile-time checks for this.
 *                 It's crucial to ensure these variables are correctly set in your environment.
 */
export function createClient(): SupabaseClient {
  // Retrieve Supabase URL and Anon Key from environment variables.
  // These variables MUST be prefixed with NEXT_PUBLIC_ to be available client-side.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if the environment variables are actually set.
  if (!supabaseUrl) {
    throw new Error("Supabase URL (NEXT_PUBLIC_SUPABASE_URL) is not defined. Please check your environment variables.");
  }
  if (!supabaseAnonKey) {
    throw new Error("Supabase Anon Key (NEXT_PUBLIC_SUPABASE_ANON_KEY) is not defined. Please check your environment variables.");
  }

  // Create and return the browser-specific Supabase client.
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
