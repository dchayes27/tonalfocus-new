import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function cookieAdapter() {
  const cookieStore = cookies();

  return {
    get(name: string) {
      return cookieStore.get(name)?.value;
    },
    set(name: string, value: string, options: CookieOptions) {
      cookieStore.set({ name, value, ...options });
    },
    remove(name: string, options: CookieOptions) {
      cookieStore.set({ name, value: '', ...options });
    },
  };
}

export function createServerClient() {
  return createSupabaseServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: cookieAdapter(),
  });
}

export function createServiceRoleClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.');
  }

  return createSupabaseServerClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: cookieAdapter(),
  });
}
