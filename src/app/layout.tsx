/**
 * src/app/layout.tsx
 * --------------------
 * This is the root layout component for the Next.js application.
 * It defines the main HTML structure, including fonts, header, footer, and navigation.
 * This is now a Server Component by default, with client-side interactivity
 * delegated to the ClientNavigation component.
 *
 * Global styles and fonts are imported and applied here.
 * Metadata for SEO can now be exported from this file.
 */

import type { Metadata } from 'next';
import { Inter, Space_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import Logo from '@/components/ui/logo';
import InstagramIcon from '@/components/ui/icons/InstagramIcon';
import { Toaster } from 'sonner';
import ClientNavigation from '@/components/layout/ClientNavigation';

// Font configurations using next/font/google for optimized web font loading.
// These fonts are loaded and made available via CSS variables.

// Inter font: A variable font for general UI text.
const inter = Inter({
  subsets: ['latin'], // Specifies character subsets to include.
  variable: '--font-inter', // CSS variable name to access this font.
  display: 'swap', // Font display strategy.
});

// Space Mono font: A monospaced font, used here for a "pixel" or retro feel.
const spaceMono = Space_Mono({
  weight: ['400', '700'], // Specifies font weights to include.
  subsets: ['latin'],
  variable: '--font-pixel', // CSS variable for the monospace font.
  display: 'swap',
});

// Playfair Display font: A serif font, used here for display text or headings.
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-ms-serif', // CSS variable for the serif font.
  display: 'swap',
});

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Tonal Focus - Medium Format Film Photography',
  description: 'High-fidelity photography portfolio showcasing medium-format film work with a 90s-inspired aesthetic.',
};

/**
 * RootLayout component.
 * This functional component wraps the entire application content.
 * @param {Readonly<{children: React.ReactNode}>} props - Props containing the child elements to render.
 * @returns {JSX.Element} The main HTML structure of the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Applies font variables to the body for global font access. */}
      <body className={`${inter.variable} ${spaceMono.variable} ${playfair.variable} font-sans`}>
        {/* Client-side navigation header with mobile menu state */}
        <ClientNavigation />

        {/* Main content area for pages. */}
        <main className="min-h-screen pt-16">
          {/* Children (page content) are rendered here. */}
          {children}
        </main>
        
        {/* Footer section. */}
        <footer className="bg-primary-charcoal text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Footer Logo and copyright */}
              <div className="mb-4 md:mb-0">
                <Logo /> {/* Assuming Logo component adapts to context or has a dark variant. */}
                <p className="text-sm text-gray-400 mt-1">© {new Date().getFullYear()} All Rights Reserved</p>
              </div>
              
              {/* Social media links */}
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Instagram">
                  <InstagramIcon />
                </a>
                {/* Placeholder for other social icons if needed in the future. */}
              </div>
            </div>
          </div>
        </footer>
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}