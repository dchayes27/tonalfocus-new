'use client';

import { useState, useEffect, useCallback } from 'react';
import Gallery, { GalleryImage } from '@/components/Gallery'; // Import GalleryImage
import Button from '@/components/ui/Button';
import { Category } from '@/lib/types'; // Photo type is no longer directly used for state

export default function Portfolio() {
  const [photos, setPhotos] = useState<GalleryImage[]>([]); // Changed type to GalleryImage[]
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null); // null for 'All'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.statusText}`);
        }
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err: any) {
        console.error(err);
        // setError('Could not load categories. Please try again later.'); // User-facing error
      }
    };
    fetchCategories();
  }, []);

  // Fetch Photos
  const fetchPhotos = useCallback(async (categorySlug: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = '/api/photos?limit=50'; // Fetch more photos
      if (categorySlug) {
        url += `&category=${categorySlug}`;
      }
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch photos: ${res.statusText}`);
      }
      const data = await res.json();

      // Map API response to GalleryImage structure
      const galleryImages = (data.photos || []).map((photo: any) => ({
        src: photo.public_url,
        alt: photo.title || photo.description || 'Portfolio image',
        category: photo.category?.name, // Assuming category object is nested
      }));
      setPhotos(galleryImages);

    } catch (err: any) {
      console.error(err);
      setError('Could not load photos. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos(activeCategorySlug);
  }, [activeCategorySlug, fetchPhotos]);
  
  const handleCategoryClick = (slug: string | null) => {
    setActiveCategorySlug(slug);
  };
    
  return (
    <>
      {/* Page header */}
      <div className="bg-primary-beige py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-charcoal text-center">
            PORTFOLIO
          </h1>
          <p className="text-center mt-4 max-w-2xl mx-auto text-primary-charcoal/80">
            A collection of my work exploring various subjects and techniques through a nostalgic lens.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-white py-6 sticky top-16 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category.id} // Corrected: Use category.id for the key
                onClick={() => handleCategoryClick(category.slug)} // Corrected: Use category.slug
                className={`px-4 py-2 transition-colors ${
                  activeCategorySlug === category.slug // Corrected: Compare with category.slug
                    ? 'bg-primary-teal text-white'
                    : 'bg-secondary-offWhite hover:bg-gray-200 text-primary-charcoal'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 py-16">
        {isLoading && (
          <div className="text-center py-20">
            <p className="text-lg text-primary-charcoal/60">Loading photos...</p>
            {/* Basic spinner */}
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-teal mt-4"></div>
          </div>
        )}
        {error && (
          <div className="text-center py-20 text-red-500">
            <p>{error}</p>
            <Button variant="primary" onClick={() => fetchPhotos(activeCategorySlug)}>
              Try Again
            </Button>
          </div>
        )}
        {!isLoading && !error && photos.length > 0 && (
          <Gallery
            images={photos} // Use photos state here
            columns={3}
            gap="medium"
            aspectRatio="landscape"
            withHoverEffect={true}
          />
        )}
        {!isLoading && !error && photos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-primary-charcoal/60 mb-4">No images found in this category.</p>
            <Button variant="primary" onClick={() => handleCategoryClick(null)}> {/* Use handleCategoryClick(null) */}
              View All Categories
            </Button>
          </div>
        )}
      </div>
    </>
  );
}