import type { Metadata } from 'next';
import { Inter, Space_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/ui/logo';

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

export const metadata: Metadata = {
  title: 'TonalFocus Photography',
  description: 'Photography with nostalgic aesthetics',
  keywords: ['photography', 'portfolio', 'retro', '90s aesthetic'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} ${playfair.variable} font-sans`}>
        <header className="fixed top-0 w-full bg-secondary-offWhite/90 backdrop-blur-sm z-50 shadow-md">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Logo />
              
              <nav className="hidden md:flex space-x-6">
                {['Home', 'Portfolio', 'About', 'Contact'].map(item => (
                  <Link 
                    key={item}
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="uppercase text-primary-charcoal hover:text-primary-teal transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              
              <button className="md:hidden p-2 bg-primary-teal text-white">
                MENU
              </button>
            </div>
          </div>
        </header>
        
        <main className="min-h-screen pt-16">
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
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}