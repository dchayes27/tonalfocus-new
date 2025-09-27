/**
 * src/app/page.tsx
 * ----------------
 * This is the main page component for the application's homepage (route: "/").
 * It showcases a filmstrip banner hero section, a featured gallery, and introductory sections
 * for "About Me" and "Get in Touch", utilizing various UI components.
 *
 * As a Server Component by default in Next.js App Router, it can directly fetch data
 * or define metadata if needed (though metadata is often in layout or dedicated files).
 */

import FilmstripBannerWrapper from '@/components/home/FilmstripBannerWrapper'; // New filmstrip banner component
import Gallery from '@/components/Gallery'; // Component for displaying a collection of images.
import Card from '@/components/ui/Card'; // Reusable UI component for content cards.
import Button from '@/components/ui/Button'; // Reusable UI button component.
import Image from 'next/image'; // Next.js component for optimized image rendering.
import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase-public'; // Cookie-less Supabase client for ISR-friendly fetches.

const TITLE = 'Film Photography Portfolio';
const DESCRIPTION = 'Explore medium-format film work from Tonal Focus: curated galleries, a scrolling filmstrip hero, and stories told through light and grain.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
    card: 'summary_large_image',
  },
};

// Revalidate the homepage every 60 seconds
// This ensures new photos appear within a minute of upload
export const revalidate = 60;

/**
 * Home page component.
 * Renders the main landing page of the website with a horizontal scrolling filmstrip banner.
 * @returns {JSX.Element} The JSX for the homepage.
 */
type FeaturedPhoto = {
  id: string;
  title: string | null;
  description: string | null;
  public_url: string | null;
  thumbnail_url: string | null;
  category: { name: string | null } | null;
};

export default async function Home() {
  const supabase = createPublicClient();

  const { data: featuredPhotos, error } = await supabase
    .from('photos')
    .select(
      `
        id,
        title,
        description,
        public_url,
        thumbnail_url,
        category:categories(name)
      `
    )
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(8);

  if (error) {
    console.error('Error fetching featured gallery photos:', error);
  }

  const galleryImages = (featuredPhotos as FeaturedPhoto[] | null | undefined)?.map((photo) => ({
    src: photo.public_url ?? photo.thumbnail_url ?? '/images/gallery1.jpg',
    alt: photo.title || 'Featured photo',
    category: photo.category?.name || undefined,
  })) ?? [];

  return (
    <>
      {/* Filmstrip Banner Section: Interactive horizontal scrolling hero */}
      <FilmstripBannerWrapper />
      
      {/* Gallery Section: Showcases featured work. */}
      <section id="gallery-section" className="py-24 container mx-auto px-4 bg-secondary-offWhite">
        {/* Section Title */}
        <h2 className="text-5xl mb-12 text-center text-primary-charcoal font-ms-serif font-bold tracking-wider">
          FEATURED WORK
        </h2>
        
        {/* Gallery Component: Displays images in a configurable grid. */}
        <Gallery 
          images={galleryImages.length > 0 ? galleryImages : [
            {
              src: '/images/gallery1.jpg',
              alt: 'Portfolio coming soon',
              category: 'Tonal Focus'
            }
          ]} // Prefer live Supabase images, fallback to a single placeholder.
          columns={2} // Number of columns in the gallery grid.
          gap="large" // Spacing between gallery items.
          aspectRatio="square" // Aspect ratio for the gallery images.
          withHoverEffect={true} // Enables a hover effect on gallery items.
          className="mb-12" // Additional styling for the gallery container.
        />
        
        {/* Call to Action: Button to view the full portfolio. */}
        <div className="mt-16 text-center">
          <Button href="/portfolio" variant="primary" className="py-4 px-8 text-lg font-bold tracking-wider">
            VIEW FULL PORTFOLIO
          </Button>
        </div>
      </section>
      
      {/* About and Contact Section: Provides brief introductions and links. */}
      <section className="py-16 bg-primary-beige">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About Me Card */}
            <Card variant="white" withGrain={true} title="ABOUT ME">
              <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                {/* Profile Image */}
                <div className="w-32 h-32 overflow-hidden relative flex-shrink-0">
                  <Image
                    src="/images/profile.jpg"
                    alt="Photographer portrait"
                    width={128} // Explicit width for Next/Image.
                    height={128} // Explicit height for Next/Image.
                    className="object-cover" // Ensures the image covers the container.
                  />
                </div>
                {/* Brief introductory text. */}
                <p className="leading-relaxed text-primary-charcoal">
                  I'm a photographer with a passion for capturing moments that blend 
                  nostalgic aesthetics with modern techniques. My work is inspired by 
                  the warm, distinctive character of early 90s imagery while maintaining 
                  contemporary clarity and precision.
                </p>
              </div>
              {/* Link to the full "About Me" page. */}
              <div className="text-center">
                <Button href="/about" variant="primary">
                  More About Me
                </Button>
              </div>
            </Card>
            
            {/* Get In Touch Card */}
            <Card variant="teal" withGrain={true} title="GET IN TOUCH">
              {/* Introductory text for contacting. */}
              <p className="mb-6 leading-relaxed">
                Interested in working together? Have questions about my process or 
                availability for a session? I'd love to hear from you.
              </p>
              
              {/* Contact details, potentially using environment variables. */}
              <div className="mb-6">
                <p className="mb-2"><strong>Email:</strong> {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@tonalfocus.com'}</p>
                <p><strong>Phone:</strong> {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1 (555) 123-4567'}</p>
              </div>
              
              {/* Link to the full "Contact Me" page. */}
              <div className="text-center">
                <Button href="/contact" variant="tertiary">
                  Contact Me
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
