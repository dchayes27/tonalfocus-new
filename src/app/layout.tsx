/**
 * src/app/layout.tsx
 * --------------------
 * This is the root layout component for the Next.js application.
 * It defines the main HTML structure, including the header, footer, and navigation.
 * This component uses 'use client' because it incorporates client-side interactivity
 * (e.g., managing the state of the mobile navigation menu).
 *
 * Global styles and fonts are imported and applied here.
 * Metadata for SEO is typically handled by individual pages or server components
 * when a root layout is a client component.
 */
'use client'; // Required for client-side hooks like useState and event handlers.

// import type { Metadata } from 'next'; // Metadata type can still be used if needed elsewhere.
import { Inter, Space_Mono, Playfair_Display } from 'next/font/google';
import './globals.css'; // Imports global stylesheets.
import Link from 'next/link'; // Next.js component for client-side navigation.
import Image from 'next/image'; // Next.js component for optimized images.
import Logo from '@/components/ui/logo'; // Custom Logo component.
import { useState } from 'react'; // React hook for managing component state.
import InstagramIcon from '@/components/ui/icons/InstagramIcon'; // Custom Instagram icon component.
import { Toaster } from 'sonner'; // Toast notifications for admin interface

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

// Note on Metadata:
// When a root layout uses 'use client', `export const metadata` is not directly supported
// in the same file for server-side rendering of metadata.
// Metadata should be defined in child Server Components (like `page.tsx`) or
// through other Next.js metadata conventions if this layout is nested.

/**
 * RootLayout component.
 * This functional component wraps the entire application content.
 * @param {Readonly<{children: React.ReactNode}>} props - Props containing the child elements to render.
 * @returns {JSX.Element} The main HTML structure of the application.
 */
export default function RootLayout({
  children, // Child components (typically pages) will be rendered here.
}: Readonly<{
  children: React.ReactNode;
}>) {
  // State for managing the visibility of the mobile navigation menu.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Toggles the state of the mobile menu (open/closed).
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Array of navigation links for easy mapping.
  const navLinks = ['Home', 'Portfolio', 'About', 'Contact'];

  return (
    <html lang="en">
      {/* Applies font variables to the body for global font access. */}
      <body className={`${inter.variable} ${spaceMono.variable} ${playfair.variable} font-sans`}>
        {/* Header section: Fixed at the top, with background blur and shadow. */}
        <header className="fixed top-0 w-full bg-secondary-offWhite/90 backdrop-blur-sm z-50 shadow-md">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              {/* Application Logo */}
              <Logo />
              
              {/* Desktop Navigation: Hidden on small screens (md:flex). */}
              <nav className="hidden md:flex space-x-6">
                {navLinks.map(item => (
                  <Link 
                    key={item}
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} // Dynamically generates href.
                    className="uppercase text-primary-charcoal hover:text-primary-teal transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              
              {/* Mobile Menu Button: Visible only on small screens (md:hidden). */}
              <button
                onClick={toggleMobileMenu} // Toggles mobile menu visibility.
                className="md:hidden p-2 bg-primary-teal text-white rounded hover:bg-primary-teal/90 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:ring-opacity-50"
                aria-expanded={isMobileMenuOpen} // Accessibility attribute indicating menu state.
                aria-controls="mobile-menu" // Accessibility attribute linking button to menu.
              >
                {/* Conditional rendering of menu icon (hamburger or close). */}
                {isMobileMenuOpen ? (
                  // Close icon (X)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu: Conditionally rendered based on isMobileMenuOpen state. */}
          {isMobileMenuOpen && (
            <div id="mobile-menu" className="md:hidden bg-secondary-offWhite shadow-lg absolute top-full left-0 w-full z-40">
              <nav className="flex flex-col space-y-1 px-4 py-3">
                {navLinks.map(item => (
                  <Link
                    key={item}
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="block uppercase text-primary-charcoal hover:text-primary-teal transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)} // Closes menu when a link is clicked.
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </header>
        
        {/* Main content area for pages. */}
        {/* Applies a blur effect to the main content if the mobile menu is open. */}
        <main className={`min-h-screen pt-16 ${isMobileMenuOpen ? 'filter blur-sm' : ''} transition-filter duration-300`}>
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