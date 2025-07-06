declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_KEY: string;
      
      // Email
      RESEND_API_KEY?: string;
      CONTACT_EMAIL?: string;
      
      // Authentication
      NEXTAUTH_URL?: string;
      NEXTAUTH_SECRET?: string;
      
      // Analytics
      NEXT_PUBLIC_GA_ID?: string;
      
      // Node
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
