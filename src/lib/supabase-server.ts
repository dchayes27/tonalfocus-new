/**
 * @file src/lib/supabase-server.ts
 * @description This module provides a factory function to create a Supabase client instance
 * specifically configured for server-side environments within a Next.js application
 * (e.g., Server Components, API Routes, Route Handlers).
 * It utilizes the `@supabase/ssr` library's `createServerClient` function and integrates
 * with Next.js's `cookies` store for managing user sessions and authentication.
 *
 * This client can be configured to use either the public anonymous key or, preferably
 * for privileged operations, the Supabase service role key.
 */
import { createServerClient, type CookieOptions, SupabaseClient } from '@supabase/ssr'
import { cookies } from 'next/headers' // Next.js utility for accessing cookies in Server Components/Routes.

/**
 * Creates and returns a Supabase client instance for use in server-side environments.
 *
 * This function initializes the client with the Supabase URL and an appropriate key.
 * It prioritizes the `SUPABASE_SERVICE_ROLE_KEY` for server-side operations, which
 * allows bypassing Row Level Security (RLS) policies – useful for admin tasks or
 * when RLS is handled at a different layer. If the service role key is not available,
 * it falls back to the public anonymous key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
 *
 * It configures cookie handling for the Supabase client by adapting Next.js's
 * `cookies()` store to the interface expected by `@supabase/ssr`.
 *
 * @returns {SupabaseClient} An instance of the Supabase client configured for server-side use.
 * @throws {Error} If essential environment variables (NEXT_PUBLIC_SUPABASE_URL or
 *                 the chosen Supabase key) are not set.
 */
export function createClient(): SupabaseClient {
  // Access the Next.js cookie store. This is specific to Server Components and Route Handlers.
  const cookieStore = cookies();

  // Retrieve Supabase URL and keys from environment variables.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Determine the Supabase key to use: prioritize service role key for server operations.
  // Using the service role key bypasses RLS, so it should be handled with extreme care
  // and only used when necessary for operations that require elevated privileges.
  let supabaseKey = serviceRoleKey;
  if (!supabaseKey) {
    console.warn(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY for server client. " +
      "Operations requiring elevated privileges may fail or be subject to RLS policies for anonymous users."
    );
    supabaseKey = anonKey;
  }

  // Validate that necessary environment variables are available.
  if (!supabaseUrl) {
    throw new Error("Supabase URL (NEXT_PUBLIC_SUPABASE_URL) is not defined. Please check your environment variables.");
  }
  if (!supabaseKey) { // This checks the chosen key (either service_role or anon)
    throw new Error("Supabase Key (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY) is not defined. Please check your environment variables.");
  }

  // Create and return the server-specific Supabase client.
  return createServerClient(
    supabaseUrl,
    supabaseKey, // Use the determined key (service role or anon).
    {
      // Define cookie handling methods that adapt Next.js's cookie store
      // to the interface expected by the Supabase client.
      cookies: {
        /**
         * Retrieves a cookie by name from the Next.js cookie store.
         * @param {string} name - The name of the cookie.
         * @returns {string | undefined} The cookie value or undefined if not found.
         */
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        /**
         * Sets a cookie in the Next.js cookie store.
         * @param {string} name - The name of the cookie.
         * @param {string} value - The value of the cookie.
         * @param {CookieOptions} options - Options for the cookie (e.g., httpOnly, path, maxAge).
         */
        set(name: string, value: string, options: CookieOptions) {
          // The `cookieStore.set` method in Next.js can accept a name-value pair object
          // or separate arguments. Here, we spread options into the object.
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle potential errors, e.g., if called outside a request context in older Next.js versions.
            // In modern Next.js App Router, `cookies()` should be available in Server Components/Actions/Routes.
            console.error("Failed to set cookie for Supabase client:", error);
          }
        },
        /**
         * Removes a cookie from the Next.js cookie store by setting its value to empty
         * and maxAge to 0 (or using `cookieStore.delete(name, options)` if available and preferred).
         * @param {string} name - The name of the cookie to remove.
         * @param {CookieOptions} options - Options for the cookie, passed to `set`.
         */
        remove(name: string, options: CookieOptions) {
          try {
            // To remove a cookie, set its value to empty and often an expiry date in the past or maxAge 0.
            // The `@supabase/ssr` library might handle the specifics of expiry when `remove` is called.
            // Next.js `cookieStore.set` with an empty value and options is a common way to clear it.
            cookieStore.set({ name, value: '', ...options });
            // Alternatively, if your Next.js version's cookieStore supports `delete`:
            // cookieStore.delete(name, options);
          } catch (error) {
            console.error("Failed to remove cookie for Supabase client:", error);
          }
        },
      },
    }
  );
}
