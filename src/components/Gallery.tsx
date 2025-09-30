'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface GalleryImage { // Added export
  src: string;
  alt: string;
  category?: string;
}

export interface GalleryProps { // Added export for consistency, though not strictly needed for this fix
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  gap?: 'none' | 'small' | 'medium' | 'large';
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  withHoverEffect?: boolean;
  frameStyle?: 'default' | 'film';
  className?: string;
}

const Gallery = ({
  images,
  columns = 4,
  gap = 'medium',
  aspectRatio = 'square',
  withHoverEffect = true,
  frameStyle = 'default',
  className = ''
}: GalleryProps) => {
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});
  
  // Map gap to Tailwind classes
  const gapMap = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-8'
  };
  
  // Map columns to Tailwind classes
  const columnMap = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };
  
  // Map aspect ratio to Tailwind classes
  const aspectRatioMap = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]'
  };
  
  // Handle image load
  const handleImageLoad = (index: number) => {
    setIsLoading(prev => ({
      ...prev,
      [index]: true
    }));
  };
  
  return (
    <div className={`grid ${columnMap[columns]} ${gapMap[gap]} ${className}`}>
      {images.map((image, index) => (
        <div key={index} className="group transform transition-transform duration-500 hover:-translate-y-1">
          <div
            className={`relative overflow-hidden ${aspectRatioMap[aspectRatio]} ${
              frameStyle === 'film'
                ? 'rounded-[18px] border border-primary-charcoal/40 bg-primary-charcoal shadow-2xl'
                : 'shadow-lg rounded-sm border-2 border-gray-100'
            }`}
          >
            {frameStyle === 'film' && (
              <>
                <div className="absolute inset-x-0 top-0 flex h-6 items-center justify-around bg-primary-charcoal">
                  {Array.from({ length: 5 }).map((_, sprocketIndex) => (
                    <span
                      key={`top-${sprocketIndex}`}
                      className="h-4 w-3 rounded-[1px] bg-secondary-offWhite/90"
                    />
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-6 items-center justify-around bg-primary-charcoal">
                  {Array.from({ length: 5 }).map((_, sprocketIndex) => (
                    <span
                      key={`bottom-${sprocketIndex}`}
                      className="h-4 w-3 rounded-[1px] bg-secondary-offWhite/90"
                    />
                  ))}
                </div>
              </>
            )}
            {/* Loading placeholder */}
            {!isLoading[index] && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            
            {/* Image with Next.js optimization - ENHANCED */}
            <Image
              src={image.src}
              alt={image.alt}
              fill={true}
              sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${100 / columns}vw`}
              quality={95}
              priority={index < 2} /* Load first 2 images with priority */
              style={{objectFit: 'cover'}}
              className={`
                transition-all duration-700
                ${isLoading[index] ? 'opacity-100' : 'opacity-0'}
                ${withHoverEffect ? 'group-hover:scale-105 transition-transform duration-700 shadow-xl' : ''}
              `}
              onLoad={() => handleImageLoad(index)}
            />

            {frameStyle === 'film' && (
              <div className="absolute bottom-9 right-5 rounded bg-primary-charcoal/80 px-3 py-1">
                <span className="text-xs font-mono uppercase tracking-[0.35em] text-primary-mauve">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
          
          {/* Enhanced caption display */}
          <div className="mt-4 mb-8">
            {image.category && (
              <p className="text-sm font-medium font-pixel text-primary-teal uppercase tracking-wider">{image.category}</p>
            )}
            <p className="text-lg font-medium font-ms-serif text-primary-charcoal">{image.alt}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
