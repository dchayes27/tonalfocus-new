/**
 * HighQualityImage Component
 * --------------------------
 * A quality-first image component for displaying professional photography.
 * Supports modern formats (AVIF, WebP) with JPEG fallback.
 * Prioritizes tonal preservation over loading speed.
 */

import { useState } from 'react';
import Image from 'next/image';

interface HighQualityImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onClick?: () => void;
}

// Custom loader that preserves quality
const qualityLoader = ({ src, width }: { src: string; width: number }) => {
  // For now, return the original URL
  // In production, this would handle CDN URLs with quality parameters
  return src;
};

export default function HighQualityImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  onLoad,
  onClick
}: HighQualityImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Loading state - subtle, elegant */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      <picture>
        {/* Modern format support with fallbacks */}
        <source
          srcSet={src}
          type="image/avif"
        />
        <source
          srcSet={src}
          type="image/webp"
        />
        
        <Image
          src={src}
          alt={alt}
          width={width || 2000}
          height={height || 1500}
          quality={95} // High quality JPEG
          loader={qualityLoader}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onClick={onClick}
          className={`transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          // Preserve aspect ratio
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </picture>
    </div>
  );
}
