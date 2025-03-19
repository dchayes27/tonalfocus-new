'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  gap?: 'none' | 'small' | 'medium' | 'large';
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  withHoverEffect?: boolean;
  className?: string;
}

const Gallery = ({
  images,
  columns = 4,
  gap = 'medium',
  aspectRatio = 'square',
  withHoverEffect = true,
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
        <div key={index} className="group">
          <div className={`relative overflow-hidden ${aspectRatioMap[aspectRatio]}`}>
            {/* Loading placeholder */}
            {!isLoading[index] && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            
            {/* Image with Next.js optimization */}
            <Image
              src={image.src}
              alt={image.alt}
              fill={true}
              sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${100 / columns}vw`}
              quality={90}
              style={{objectFit: 'cover'}}
              className={`
                transition-all duration-500
                ${isLoading[index] ? 'opacity-100' : 'opacity-0'}
                ${withHoverEffect ? 'group-hover:scale-105 transition-transform duration-500' : ''}
              `}
              onLoad={() => handleImageLoad(index)}
            />
          </div>
          
          {/* Optional caption */}
          {image.category && (
            <div className="mt-2">
              <p className="text-sm text-primary-charcoal/70">{image.category}</p>
              <p className="text-primary-charcoal">{image.alt}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Gallery;