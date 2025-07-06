/**
 * @file src/components/Gallery.tsx
 * @description A responsive image gallery component.
 * It displays a collection of images in a configurable grid layout,
 * with options for aspect ratio, gaps, hover effects, and captions.
 * Uses Next.js Image component for optimization and includes loading placeholders.
 * This is a Client Component due to its use of `useState` for image loading states.
 */
'use client'; // Marks this as a Client Component.

import { useState } from 'react'; // React hook for managing image loading state.
import Image from 'next/image';   // Next.js component for optimized image handling.

/**
 * Interface for a single image object to be displayed in the gallery.
 */
export interface GalleryImage {
  /** The source URL of the image. */
  src: string;
  /** The alternative text for the image, used for accessibility and as a fallback. */
  alt: string;
  /** Optional category for the image, displayed in the caption. */
  category?: string;
}

/**
 * Props for the Gallery component.
 */
export interface GalleryProps {
  /** An array of `GalleryImage` objects to display. */
  images: GalleryImage[];
  /** Number of columns in the gallery grid. Defaults to 4.
   *  Supports 2, 3, or 4 columns with responsive behavior.
   */
  columns?: 2 | 3 | 4;
  /** The spacing between images in the grid. Defaults to 'medium'. */
  gap?: 'none' | 'small' | 'medium' | 'large';
  /** The aspect ratio for the images. Defaults to 'square'. */
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  /** Whether to apply a hover effect (slight scale and lift). Defaults to true. */
  withHoverEffect?: boolean;
  /** Additional CSS class names to apply to the gallery container. */
  className?: string;
}

/**
 * Gallery Component.
 * Renders a grid of images with various customization options.
 *
 * @param {GalleryProps} props - The properties for the Gallery component.
 * @returns {JSX.Element} A div element containing the image gallery.
 */
const Gallery = ({
  images,
  columns = 4,        // Default to 4 columns.
  gap = 'medium',     // Default to medium gap.
  aspectRatio = 'square', // Default to square aspect ratio.
  withHoverEffect = true, // Default to enable hover effect.
  className = ''      // Default to no extra classes.
}: GalleryProps): JSX.Element => {
  // State to track loading status of individual images.
  // `isLoading` is an object where keys are image indices and values are booleans.
  // `true` means the image at that index has loaded.
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});
  
  // Mapping for gap prop to corresponding Tailwind CSS classes.
  const gapMap: Record<NonNullable<GalleryProps['gap']>, string> = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-8'
  };
  
  // Mapping for columns prop to responsive Tailwind CSS grid column classes.
  const columnMap: Record<NonNullable<GalleryProps['columns']>, string> = {
    2: 'grid-cols-1 md:grid-cols-2', // 1 col on small, 2 on medium+
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', // 1 small, 2 medium, 3 large+
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'  // 1 small, 2 medium, 4 large+
  };
  
  // Mapping for aspectRatio prop to Tailwind CSS aspect ratio classes.
  const aspectRatioMap: Record<NonNullable<GalleryProps['aspectRatio']>, string> = {
    square: 'aspect-square',    // 1:1 aspect ratio.
    landscape: 'aspect-video',  // 16:9 aspect ratio.
    portrait: 'aspect-[3/4]'    // 3:4 aspect ratio (custom).
  };
  
  /**
   * Handles the `onLoad` event for each image.
   * Sets the loading state for the specific image index to true.
   * @param {number} index - The index of the image that has loaded.
   */
  const handleImageLoad = (index: number) => {
    setIsLoading(prev => ({
      ...prev,
      [index]: true // Mark this image as loaded.
    }));
  };
  
  return (
    // Main grid container for the gallery.
    <div className={`grid ${columnMap[columns]} ${gapMap[gap]} ${className}`}>
      {images.map((image, index) => (
        // Container for each individual gallery item (image + caption).
        // Applies a group class for hover effects and a slight lift on hover.
        <div key={index} className="group transform transition-transform duration-500 hover:-translate-y-1">
          {/* Image container with aspect ratio, shadow, border, and overflow hidden. */}
          <div className={`relative overflow-hidden ${aspectRatioMap[aspectRatio]} shadow-lg rounded-sm border-2 border-gray-100`}>

            {/* Loading Placeholder: Displayed if the image at this index hasn't loaded yet. */}
            {!isLoading[index] && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" aria-hidden="true" />
            )}
            
            {/* Next.js Image component for optimized image loading. */}
            <Image
              src={image.src}
              alt={image.alt}
              fill={true} // Makes the image fill its parent container (requires parent to be relative, absolute, or fixed).
              // `sizes` prop helps Next.js optimize image selection based on viewport width and column count.
              sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${100 / columns}vw`}
              quality={95} // Image quality (1-100).
              priority={index < 2} // Prioritize loading for the first 2 images (improves LCP).
              style={{objectFit: 'cover'}} // Ensures the image covers the container while maintaining aspect ratio.
              className={`
                transition-all duration-700 ease-in-out
                ${isLoading[index] ? 'opacity-100' : 'opacity-0'} // Fade-in effect once loaded.
                ${withHoverEffect ? 'group-hover:scale-105 transition-transform duration-700 shadow-xl' : ''} // Scale effect on hover.
              `}
              onLoad={() => handleImageLoad(index)} // Update loading state when image is loaded.
            />
          </div>
          
          {/* Caption display below the image. */}
          <div className="mt-4 mb-8">
            {/* Display category if available. */}
            {image.category && (
              <p className="text-sm font-medium font-pixel text-primary-teal uppercase tracking-wider">{image.category}</p>
            )}
            {/* Display image alt text as a title/description. */}
            <p className="text-lg font-medium font-ms-serif text-primary-charcoal">{image.alt}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;