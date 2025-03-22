'use client';

import { useState } from 'react';
import Gallery from '@/components/Gallery';
import Button from '@/components/ui/Button';

export default function Portfolio() {
  // Portfolio images - in a real application, these would likely come from a CMS or data file
  const allImages = [
    {
      src: '/images/gallery1.jpg',
      alt: 'Urban landscape photograph',
      category: 'Urban'
    },
    {
      src: '/images/gallery2.jpg',
      alt: 'Nature photograph with trees',
      category: 'Nature'
    },
    {
      src: '/images/gallery3.jpg',
      alt: 'Portrait photograph',
      category: 'Portrait'
    },
    {
      src: '/images/gallery4.jpg',
      alt: 'Street photography scene',
      category: 'Street'
    },
    {
      src: '/images/gallery1.jpg',
      alt: 'Architectural detail photograph',
      category: 'Architecture'
    },
    {
      src: '/images/gallery2.jpg',
      alt: 'Landscape photograph with mountains',
      category: 'Landscape'
    },
    {
      src: '/images/gallery3.jpg',
      alt: 'Abstract photograph',
      category: 'Abstract'
    },
    {
      src: '/images/gallery4.jpg',
      alt: 'Travel photography scene',
      category: 'Travel'
    }
  ];
  
  // Extract unique categories
  const categories = ['All', ...new Set(allImages.map(img => img.category))];
  
  // State for active category
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Filter images based on active category
  const filteredImages = activeCategory === 'All' 
    ? allImages 
    : allImages.filter(img => img.category === activeCategory);
    
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
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 transition-colors ${
                  activeCategory === category 
                    ? 'bg-primary-teal text-white' 
                    : 'bg-secondary-offWhite hover:bg-gray-200 text-primary-charcoal'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 py-16">
        <Gallery 
          images={filteredImages}
          columns={3}
          gap="medium"
          aspectRatio="landscape"
          withHoverEffect={true}
        />
        
        {/* If no images match the filter */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-primary-charcoal/60 mb-4">No images found in this category.</p>
            <Button variant="primary" onClick={() => setActiveCategory('All')}>
              View All Categories
            </Button>
          </div>
        )}
      </div>
    </>
  );
}