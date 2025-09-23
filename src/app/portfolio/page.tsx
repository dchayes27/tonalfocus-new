/**
 * src/app/portfolio/page.tsx
 * --------------------------
 * Portfolio page for TonalFocus Photography.
 * Server-rendered with ISR for optimal performance and SEO.
 * Displays photos grouped by Black & White vs Color.
 */

import { Metadata } from 'next';
import PhotographyGallery from '@/components/photography/PhotographyGallery';
import { Photo } from '@/lib/types';
import { createPublicClient } from '@/lib/supabase-public';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Portfolio | Tonal Focus Photography',
  description: 'Film photography exploring light, shadow, and the spaces between. Black & white and color photography by Daniel Chayes.',
  openGraph: {
    title: 'Portfolio | Tonal Focus Photography',
    description: 'Film photography exploring light, shadow, and the spaces between.',
    type: 'website',
    url: 'https://tonalfocus.com/portfolio',
  },
};

// Revalidate every hour (ISR)
export const revalidate = 3600;

/**
 * Fetch photos from Supabase
 * Server-side function to get all published photos
 */
async function getPhotos(): Promise<{ 
  all: Photo[]; 
  blackWhite: Photo[]; 
  color: Photo[] 
}> {
  try {
    const supabase = createPublicClient();
    
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('is_black_white', { ascending: false })
      .order('display_order', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error fetching photos:', error);
      return { all: [], blackWhite: [], color: [] };
    }

    const photos = data || [];
    
    return {
      all: photos,
      blackWhite: photos.filter(p => p.is_black_white),
      color: photos.filter(p => !p.is_black_white)
    };
  } catch (error) {
    console.error('Unexpected error fetching photos:', error);
    return { all: [], blackWhite: [], color: [] };
  }
}

export default async function Portfolio() {
  const { all, blackWhite, color } = await getPhotos();

  // If no photos, show empty state
  if (all.length === 0) {
    return (
      <>
        {/* Page Header */}
        <div className="bg-primary-beige py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-charcoal text-center">
              PORTFOLIO
            </h1>
            <p className="text-center mt-4 max-w-2xl mx-auto text-primary-charcoal/80">
              Film photography exploring light, shadow, and the spaces between.
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <p className="text-lg text-primary-charcoal/60 mb-4">
              Portfolio images coming soon.
            </p>
            <p className="text-sm text-primary-charcoal/40">
              Check back shortly for a curated collection of film photography.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-primary-beige py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-charcoal text-center">
            PORTFOLIO
          </h1>
          <p className="text-center mt-4 max-w-2xl mx-auto text-primary-charcoal/80">
            Film photography exploring light, shadow, and the spaces between.
          </p>
        </div>
      </div>

      {/* Main Gallery Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-20">
          {/* Black & White Section */}
          {blackWhite.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-charcoal mb-8">
                BLACK & WHITE
              </h2>
              <PhotographyGallery
                photos={blackWhite}
                columns={3}
                gap="medium"
              />
            </section>
          )}

          {/* Divider */}
          {blackWhite.length > 0 && color.length > 0 && (
            <div className="border-t border-gray-200" />
          )}

          {/* Color Section */}
          {color.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-charcoal mb-8">
                COLOR
              </h2>
              <PhotographyGallery
                photos={color}
                columns={3}
                gap="medium"
              />
            </section>
          )}
        </div>
      </div>
    </>
  );
}
