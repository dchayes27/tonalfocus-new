/**
 * src/app/portfolio/page.tsx
 * --------------------------
 * Portfolio page for TonalFocus Photography.
 * Displays photos grouped by Black & White vs Color.
 * No category navigation - clean, minimal interface focused on the photography.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Gallery, { GalleryImage } from '@/components/Gallery';
import { Photo } from '@/lib/types';

interface GroupedPhotos {
  blackWhite: Photo[];
  color: Photo[];
}

export default function Portfolio() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [groupedPhotos, setGroupedPhotos] = useState<GroupedPhotos>({ blackWhite: [], color: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all photos from the API
  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/photos?view=all&limit=100'); // Get all photos
      if (!res.ok) {
        throw new Error(`Failed to fetch photos: ${res.statusText}`);
      }
      const data = await res.json();
      
      setPhotos(data.photos || []);
      setGroupedPhotos(data.grouped || { blackWhite: [], color: [] });
    } catch (err: any) {
      console.error("Error fetching photos:", err);
      setError('Could not load photos at this time. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Convert Photo array to GalleryImage array
  const toGalleryImages = (photos: Photo[]): GalleryImage[] => {
    return photos.map(photo => ({
      src: photo.public_url,
      alt: photo.title || photo.description || 'Portfolio image',
      category: photo.is_black_white ? 'Black & White' : 'Color'
    }));
  };

  return (
    <>
      {/* Minimal Page Header */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {isLoading && (
          <div className="text-center py-20">
            <p className="text-lg text-primary-charcoal/60">Loading photos...</p>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-teal mt-4" />
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-20 text-red-600">
            <p>{error}</p>
            <button 
              onClick={fetchPhotos}
              className="mt-4 px-6 py-2 bg-primary-teal text-white hover:bg-primary-teal/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && photos.length > 0 && (
          <div className="space-y-20">
            {/* Black & White Section */}
            {groupedPhotos.blackWhite.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-primary-charcoal mb-8">
                  BLACK & WHITE
                </h2>
                <Gallery
                  images={toGalleryImages(groupedPhotos.blackWhite)}
                  columns={3}
                  gap="medium"
                  aspectRatio="landscape"
                  withHoverEffect={false} // Minimal, no hover effects
                />
              </section>
            )}

            {/* Color Section */}
            {groupedPhotos.color.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-primary-charcoal mb-8">
                  COLOR
                </h2>
                <Gallery
                  images={toGalleryImages(groupedPhotos.color)}
                  columns={3}
                  gap="medium"
                  aspectRatio="landscape"
                  withHoverEffect={false} // Minimal, no hover effects
                />
              </section>
            )}
          </div>
        )}

        {!isLoading && !error && photos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-primary-charcoal/60">No photos available.</p>
          </div>
        )}
      </div>
    </>
  );
}
