/**
 * PhotographyGallery Component
 * ----------------------------
 * Professional gallery component for displaying high-quality photography.
 * Focuses on tonal preservation and elegant presentation.
 */

import { useState, useMemo } from 'react';
import HighQualityImage from './HighQualityImage';
import Lightbox from './Lightbox';
import { Photo } from '@/lib/types';

interface PhotographyGalleryProps {
  photos: Photo[];
  columns?: 1 | 2 | 3 | 4;
  gap?: 'small' | 'medium' | 'large';
  groupByBW?: boolean;
}

export default function PhotographyGallery({
  photos,
  columns = 3,
  gap = 'medium',
  groupByBW = true
}: PhotographyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Gap sizes
  const gapSizes = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6'
  };

  // Column classes
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  // Prepare images for lightbox
  const lightboxImages = useMemo(() => 
    photos.map(photo => ({
      src: photo.public_url,
      alt: photo.title || photo.description || 'Gallery image',
      title: photo.title
    })), [photos]
  );

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxNavigate = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <div className={`grid ${columnClasses[columns]} ${gapSizes[gap]}`}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group cursor-pointer overflow-hidden bg-gray-100"
            onClick={() => handleImageClick(index)}
          >
            <HighQualityImage
              src={photo.public_url}
              alt={photo.title || photo.description || 'Gallery image'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Subtle hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            
            {/* Optional: Show title on hover */}
            {photo.title && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-sm font-medium">{photo.title}</h3>
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        images={lightboxImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={handleLightboxNavigate}
      />
    </>
  );
}
