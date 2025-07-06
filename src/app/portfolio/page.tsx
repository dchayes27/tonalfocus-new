/**
 * src/app/portfolio/page.tsx
 * --------------------------
 * This file defines the Portfolio page for TonalFocus Photography.
 * It fetches and displays a gallery of photos, allowing users to filter by category.
 * This component is marked as a Client Component ('use client') because it uses
 * React hooks (useState, useEffect, useCallback) for managing state, fetching data,
 * and handling user interactions.
 */
'use client'; // Directive to mark this as a Client Component.

import { useState, useEffect, useCallback } from 'react'; // React hooks.
import Gallery, { GalleryImage } from '@/components/Gallery'; // Gallery component and its image type.
import Button from '@/components/ui/Button'; // Reusable UI button component.
import { Category } from '@/lib/types'; // Type definition for Category.

/**
 * Portfolio Page Component.
 * Renders the photo gallery and category filters.
 * @returns {JSX.Element} The JSX for the Portfolio page.
 */
export default function Portfolio() {
  // --- State Variables ---
  // Stores the array of photos to be displayed in the gallery. Type is GalleryImage[] for Gallery component compatibility.
  const [photos, setPhotos] = useState<GalleryImage[]>([]);
  // Stores the array of available categories fetched from the API.
  const [categories, setCategories] = useState<Category[]>([]);
  // Tracks the slug of the currently active category for filtering. `null` represents "All" categories.
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  // Boolean flag to indicate if photo data is currently being loaded.
  const [isLoading, setIsLoading] = useState(true);
  // Stores any error message that occurs during data fetching.
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Effects ---
  // Effect to fetch categories when the component mounts.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories'); // API endpoint for categories.
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.statusText} (status: ${res.status})`);
        }
        const data = await res.json();
        setCategories(data.categories || []); // Update categories state. Default to empty array if no data.
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        // Optionally set a user-facing error for categories, though current UI doesn't display it.
        // setError('Could not load categories. Some filters might not work.');
      }
    };
    fetchCategories();
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Memoized function to fetch photos from the API.
  // `useCallback` prevents this function from being recreated on every render unless its dependencies change.
  const fetchPhotos = useCallback(async (categorySlug: string | null) => {
    setIsLoading(true); // Set loading state to true before fetching.
    setError(null); // Clear any previous errors.
    try {
      let url = '/api/photos?limit=50'; // Base API endpoint for photos, fetching up to 50.
      if (categorySlug) {
        url += `&category=${categorySlug}`; // Append category filter if a slug is provided.
      }
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch photos: ${res.statusText} (status: ${res.status})`);
      }
      const data = await res.json();

      // Map the API response (data.photos) to the GalleryImage structure required by the Gallery component.
      const galleryImages: GalleryImage[] = (data.photos || []).map((photo: any) => ({
        src: photo.public_url, // URL of the main image.
        alt: photo.title || photo.description || 'Portfolio image', // Alt text for the image.
        category: photo.category?.name, // Category name, accessed from nested category object.
      }));
      setPhotos(galleryImages); // Update photos state.

    } catch (err: any) {
      console.error("Error fetching photos:", err);
      setError('Could not load photos at this time. Please try refreshing the page or select another category.'); // Set user-facing error message.
    } finally {
      setIsLoading(false); // Set loading state to false after fetching (success or failure).
    }
  }, []); // `fetchPhotos` itself has no dependencies other than those passed in its scope (which are none here).

  // Effect to re-fetch photos whenever the activeCategorySlug changes or the fetchPhotos function reference changes.
  useEffect(() => {
    fetchPhotos(activeCategorySlug);
  }, [activeCategorySlug, fetchPhotos]); // Dependencies: activeCategorySlug and fetchPhotos.
  
  /**
   * Handles clicks on category filter buttons.
   * Sets the activeCategorySlug state to the clicked category's slug.
   * @param {string | null} slug - The slug of the category to filter by, or null for "All".
   */
  const handleCategoryClick = (slug: string | null) => {
    setActiveCategorySlug(slug);
  };
    
  return (
    <>
      {/* Page Header Section */}
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

      {/* Category Filter Section */}
      {/* This section is sticky to remain visible while scrolling. */}
      <div className="bg-white py-6 sticky top-16 z-10 shadow-sm"> {/* `top-16` assumes a header height */}
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {/* Button to show all categories */}
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-4 py-2 transition-colors ${
                activeCategorySlug === null
                  ? 'bg-primary-teal text-white'
                  : 'bg-secondary-offWhite hover:bg-gray-200 text-primary-charcoal'
              }`}
            >
              All
            </button>
            {/* Map through fetched categories to create filter buttons. */}
            {categories.map(category => (
              <button
                key={category.id} // Unique key for each button.
                onClick={() => handleCategoryClick(category.slug)} // Set active category on click.
                className={`px-4 py-2 transition-colors ${
                  activeCategorySlug === category.slug // Highlight active category.
                    ? 'bg-primary-teal text-white'
                    : 'bg-secondary-offWhite hover:bg-gray-200 text-primary-charcoal'
                }`}
              >
                {category.name} {/* Display category name. */}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Gallery Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Conditional rendering based on loading and error states. */}
        {isLoading && (
          // Loading state: Display a message and a spinner.
          <div className="text-center py-20">
            <p className="text-lg text-primary-charcoal/60">Loading photos...</p>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-teal mt-4" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {error && !isLoading && (
          // Error state: Display error message and a "Try Again" button.
          <div className="text-center py-20 text-red-600 bg-red-50 p-6 rounded-md">
            <p className="font-semibold text-lg mb-2">Oops! Something went wrong.</p>
            <p className="mb-4">{error}</p>
            <Button variant="primary" onClick={() => fetchPhotos(activeCategorySlug)}>
              Try Again
            </Button>
          </div>
        )}
        {!isLoading && !error && photos.length > 0 && (
          // Success state (photos loaded): Display the Gallery component.
          <Gallery
            images={photos} // Pass the fetched and mapped photos.
            columns={3} // Configure gallery layout (e.g., 3 columns).
            gap="medium" // Spacing between gallery items.
            aspectRatio="landscape" // Desired aspect ratio for images.
            withHoverEffect={true} // Enable hover effects on images.
          />
        )}
        {!isLoading && !error && photos.length === 0 && (
          // Empty state (no photos found for the filter, no error, not loading):
          <div className="text-center py-20">
            <p className="text-lg text-primary-charcoal/60 mb-4">No images found in this category.</p>
            {/* Button to clear filter and view all categories. */}
            <Button variant="primary" onClick={() => handleCategoryClick(null)}>
              View All Categories
            </Button>
          </div>
        )}
      </div>
    </>
  );
}