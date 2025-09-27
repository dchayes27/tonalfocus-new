'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/logo';
import InstagramIcon from '@/components/ui/icons/InstagramIcon';
import { Toaster } from 'sonner';

interface SiteChromeProps {
  children: React.ReactNode;
}

export default function SiteChrome({ children }: SiteChromeProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => !open);
  };

  const navLinks = ['Home', 'Portfolio', 'About', 'Contact'];

  return (
    <>
      <header className="fixed top-0 w-full bg-secondary-offWhite/90 backdrop-blur-sm z-50 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo />

            <nav className="hidden md:flex space-x-6">
              {navLinks.map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="uppercase text-primary-charcoal hover:text-primary-teal transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>

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

        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-secondary-offWhite shadow-lg absolute top-full left-0 w-full z-40">
            <nav className="flex flex-col space-y-1 px-4 py-3">
              {navLinks.map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="block uppercase text-primary-charcoal hover:text-primary-teal transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className={`min-h-screen pt-16 ${isMobileMenuOpen ? 'filter blur-sm' : ''} transition-filter duration-300`}>
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
            </div>
          </div>
        </div>
      </footer>

      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
