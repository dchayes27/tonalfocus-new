import type { Metadata } from 'next';
import { Inter, Space_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import SiteChrome from '@/components/layout/SiteChrome';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-pixel', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-ms-serif', display: 'swap' });

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tonalfocus-new.vercel.app';
const DEFAULT_TITLE = 'Tonal Focus';
const DEFAULT_DESCRIPTION = 'Film photography portfolio by Daniel Chayes focusing on tonal depth and medium-format work.';

export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${DEFAULT_TITLE}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: DEFAULT_TITLE,
    url: DEFAULT_SITE_URL,
    type: 'website',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} ${playfair.variable} font-sans`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
