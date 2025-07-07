import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Admin credentials from environment
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

// Session cookie name
const SESSION_COOKIE = 'tonalfocus_admin_session';

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) {
    return false;
  }
  
  // In development, allow a default password
  if (!ADMIN_PASSWORD_HASH && process.env.NODE_ENV === 'development') {
    return password === 'admin123'; // Default dev password
  }
  
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
}

/**
 * Create admin session
 */
export function createAdminSession() {
  const sessionId = crypto.randomUUID();
  const cookieStore = cookies();
  
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  });
  
  return sessionId;
}

/**
 * Check if admin is authenticated
 */
export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  
  // In production, you'd verify this against a session store
  // For now, just check if cookie exists
  return !!session?.value;
}

/**
 * Clear admin session
 */
export function clearAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Middleware to protect admin routes
 */
export function requireAdmin(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    if (!isAdminAuthenticated()) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return handler(request, ...args);
  };
}

/**
 * Generate password hash for setup
 */
export function generatePasswordHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}
