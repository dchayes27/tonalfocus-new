/**
 * Environment Variable Type Definitions
 *
 * This file provides TypeScript type safety for environment variables
 * used throughout the application.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase (Required)
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;

    // Admin Authentication (Required)
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD_HASH: string;

    // Revalidation (Required for production)
    REVALIDATE_SECRET: string;
    REVALIDATE_ENDPOINT?: string;

    // Contact Information (Public, Optional)
    NEXT_PUBLIC_CONTACT_EMAIL?: string;
    NEXT_PUBLIC_CONTACT_PHONE?: string;
    CONTACT_EMAIL?: string;

    // Email Service (Optional - for contact form)
    RESEND_API_KEY?: string;

    // Site Configuration (Optional)
    NEXT_PUBLIC_SITE_URL?: string;

    // Database (Optional - for migrations)
    DATABASE_URL?: string;

    // NextAuth (Optional - if using NextAuth)
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;

    // Analytics (Optional)
    NEXT_PUBLIC_GA_ID?: string;

    // Node Environment
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
