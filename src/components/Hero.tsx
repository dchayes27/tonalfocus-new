'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  imageSrc: string;
  imageAlt: string;
  heading?: string;
  subheading?: string;
  height?: 'full' | 'large' | 'medium'; // full = 100vh, large = 90vh, medium = 70vh
  overlay?: boolean;
  children?: React.ReactNode;
}

const Hero = ({
  imageSrc,
  imageAlt,
  heading,
  subheading,
  height = 'large',
  overlay = true,
  children
}: HeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Height mapping
  const heightClass = {
    full: 'h-screen',
    large: 'h-[90vh]',
    medium: 'h-[70vh]'
  };
  
  return (
    <section className={`relative w-full ${heightClass[height]} overflow-hidden`}>
      {/* Image with Next.js optimization */}
      <Image 
        src={imageSrc}
        alt={imageAlt}
        priority={true}
        fill={true}
        quality={95}
        sizes="100vw"
        style={{objectFit: 'cover'}}
        className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* Optional overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-center text-white p-4 max-w-3xl">
            {heading && (
              <h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-4">
                {heading}
              </h1>
            )}
            
            {subheading && (
              <p className="text-xl md:text-2xl mb-6">
                {subheading}
              </p>
            )}
            
            {children}
          </div>
        </div>
      )}
      
      {/* If no overlay but we have children, still display them */}
      {!overlay && children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {children}
          </div>
        </div>
      )}
      
      {/* Scroll indicator moved to page.tsx */}
      
      {/* Film grain effect */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </section>
  );
};

export default Hero;