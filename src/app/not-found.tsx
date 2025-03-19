import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl md:text-7xl font-bold text-primary-charcoal mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl text-primary-teal mb-6">Page Not Found</h2>
      <p className="text-lg text-primary-charcoal/70 max-w-md mb-10">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button href="/" variant="primary">
        Return Home
      </Button>
    </div>
  );
}