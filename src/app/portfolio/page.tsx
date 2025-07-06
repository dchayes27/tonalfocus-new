/**
 * src/app/portfolio/page.tsx
 * --------------------------
 * Portfolio page for TonalFocus Photography.
 * Displays photos grouped by Black & White vs Color.
 * Quality-first approach with professional gallery display.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import PhotographyGallery from '@/components/photography/PhotographyGallery';
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
      const res = await fetch('/api/photos?view=all&limit=100');
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
            <p className="text-lg text-primary-charcoal/60 mb-4">Loading gallery...</p>
            <p className="text-sm text-primary-charcoal/40">
              High-quality images may take a moment to load
            </p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchPhotos}
              className="px-6 py-2 bg-primary-teal text-white hover:bg-primary-teal/90 transition-colors"
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
                <PhotographyGallery
                  photos={groupedPhotos.blackWhite}
                  columns={3}
                  gap="medium"
                />
              </section>
            )}

            {/* Divider */}
            {groupedPhotos.blackWhite.length > 0 && groupedPhotos.color.length > 0 && (
              <div className="border-t border-gray-200" />
            )}

            {/* Color Section */}
            {groupedPhotos.color.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-primary-charcoal mb-8">
                  COLOR
                </h2>
                <PhotographyGallery
                  photos={groupedPhotos.color}
                  columns={3}
                  gap="medium"
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
