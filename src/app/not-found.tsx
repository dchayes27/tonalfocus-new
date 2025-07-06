/**
 * src/app/not-found.tsx
 * ---------------------
 * This component defines the user interface for 404 "Page Not Found" errors.
 * When a user navigates to a route that does not exist, Next.js will render this page.
 * It provides a user-friendly message and a link to return to the homepage.
 */
import Link from 'next/link'; // Used indirectly by the Button component if it navigates.
import Button from '@/components/ui/Button'; // Custom Button component.

/**
 * NotFound component.
 * Renders a standardized 404 error page.
 * @returns {JSX.Element} The JSX for the 404 page.
 */
export default function NotFound() {
  return (
    // Main container for the 404 page content.
    // Centers content vertically and horizontally, with padding and minimum height.
    <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
      {/* Large "404" heading. */}
      <h1 className="text-5xl md:text-7xl font-bold text-primary-charcoal mb-4">404</h1>
      {/* Sub-heading indicating "Page Not Found". */}
      <h2 className="text-2xl md:text-3xl text-primary-teal mb-6">Page Not Found</h2>
      {/* Descriptive message explaining the error. */}
      <p className="text-lg text-primary-charcoal/70 max-w-md mb-10">
        The page you're looking for doesn't exist or has been moved.
      </p>
      {/* Button component that links to the homepage. */}
      <Button href="/" variant="primary">
        Return Home
      </Button>
    </div>
  );
}