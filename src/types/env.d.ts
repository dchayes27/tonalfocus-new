declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY?: string;

      // Email
      RESEND_API_KEY?: string;
      CONTACT_EMAIL?: string;
      
      // Contact Information (Public)
      NEXT_PUBLIC_CONTACT_EMAIL?: string;
      NEXT_PUBLIC_CONTACT_PHONE?: string;
      
      // Authentication
      NEXTAUTH_URL?: string;
      NEXTAUTH_SECRET?: string;

      // Analytics
      NEXT_PUBLIC_GA_ID?: string;

      // Revalidation
      REVALIDATE_SECRET?: string;
      REVALIDATE_ENDPOINT?: string;

      // URLs
      NEXT_PUBLIC_SITE_URL?: string;
      
      // Node
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
