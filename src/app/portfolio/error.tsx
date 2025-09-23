/**
 * src/app/portfolio/error.tsx
 * ---------------------------
 * Error boundary for the portfolio page.
 * Provides graceful error handling and user feedback.
 */

'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function PortfolioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Portfolio error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-primary-charcoal mb-4">
          Something went wrong
        </h2>
        <p className="text-primary-charcoal/60 mb-8">
          We encountered an error while loading the portfolio. 
          This might be a temporary issue.
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => reset()}
            variant="primary"
            className="w-full"
          >
            Try Again
          </Button>
          <Button
            href="/"
            variant="secondary"
            className="w-full"
          >
            Return Home
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer text-sm font-medium">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 text-xs overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
