'use client'; // Required for useState and event handlers

import type { Metadata } from 'next'; // Still can use Metadata type
import { Inter, Space_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/ui/logo';
import { useState } from 'react';
import InstagramIcon from '@/components/ui/icons/InstagramIcon';

// It's generally recommended to define metadata in Server Components or specific page files
// when converting a layout to 'use client'. However, for this specific case,
// static metadata export should still largely work.
// For dynamic metadata based on client state, other patterns would be needed.
// export const metadata: Metadata = {
// title: 'TonalFocus Photography',
// description: 'Photography with nostalgic aesthetics',
// keywords: ['photography', 'portfolio', 'retro', '90s aesthetic'],
// };
// Note: If `metadata` export is problematic with 'use client', it should be moved
// to child Server Components or pages. For now, I'll keep it commented and assume
// it might be handled at the page level or a parent server component if this layout
// were nested. For a root layout, this usually implies page-level metadata.


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-pixel', // Using Space Mono as our pixel/monospace font
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-ms-serif', // Using Playfair Display as our serif font
  display: 'swap',
});

// Removed metadata export as this is now a 'use client' component.
// Metadata should be handled in page.tsx or parent Server Components.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = ['Home', 'Portfolio', 'About', 'Contact'];

  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} ${playfair.variable} font-sans`}>
        <header className="fixed top-0 w-full bg-secondary-offWhite/90 backdrop-blur-sm z-50 shadow-md">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Logo />
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                {navLinks.map(item => (
                  <Link 
                    key={item}
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="uppercase text-primary-charcoal hover:text-primary-teal transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 bg-primary-teal text-white rounded hover:bg-primary-teal/90 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:ring-opacity-50"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div id="mobile-menu" className="md:hidden bg-secondary-offWhite shadow-lg absolute top-full left-0 w-full z-40">
              <nav className="flex flex-col space-y-1 px-4 py-3">
                {navLinks.map(item => (
                  <Link
                    key={item}
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="block uppercase text-primary-charcoal hover:text-primary-teal transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </header>
        
        <main className={`min-h-screen pt-16 ${isMobileMenuOpen ? 'filter blur-sm' : ''} transition-filter duration-300`}>
          {/* Content area: apply blur if mobile menu is open */}
          {children}
        </main>
        
        <footer className="bg-primary-charcoal text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <Logo />
                <p className="text-sm text-gray-400 mt-1">© {new Date().getFullYear()} All Rights Reserved</p>
              </div>
              
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Instagram">
                  <InstagramIcon />
                </a>
                {/* Add other social icons here if needed */}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}