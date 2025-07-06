/**
 * @file src/components/Hero.tsx
 * @description A reusable Hero component for displaying a large background image
 * with optional overlay, text content (heading, subheading), and children elements.
 * It uses Next.js Image for optimized image loading and includes a film grain effect.
 * This is a Client Component due to its use of `useState` for image load state.
 */
'use client'; // Marks this as a Client Component.

import Image from 'next/image'; // Next.js component for optimized image handling.
import { useState, ReactNode } from 'react'; // React hooks and types.
// import { motion } from 'framer-motion'; // Framer Motion was imported but not used; removed for cleanliness.

/** Defines the available height options for the Hero section. */
type HeroHeight = 'full' | 'large' | 'medium'; // 'full' = 100vh, 'large' = 90vh, 'medium' = 70vh.

/** Props for the Hero component. */
interface HeroProps {
  /** The source URL of the background image. */
  imageSrc: string;
  /** The alternative text for the background image, for accessibility. */
  imageAlt: string;
  /** Optional main heading text to display over the image. */
  heading?: string;
  /** Optional subheading text to display below the heading. */
  subheading?: string;
  /**
   * The height of the Hero section. Defaults to 'large'.
   * - 'full': Screen height (100vh).
   * - 'large': Approximately 90% of screen height (90vh).
   * - 'medium': Approximately 70% of screen height (70vh).
   */
  height?: HeroHeight;
  /** Whether to display a semi-transparent black overlay on the image. Defaults to true. */
  overlay?: boolean;
  /** Optional child elements to render within the Hero section's content area. */
  children?: ReactNode;
}

/**
 * Hero Component.
 * Renders a full-width hero section with a background image and optional content.
 *
 * @param {HeroProps} props - The properties for the Hero component.
 * @returns {JSX.Element} A section element representing the hero unit.
 */
const Hero = ({
  imageSrc,
  imageAlt,
  heading,
  subheading,
  height = 'large',    // Default height.
  overlay = true,     // Default to show overlay.
  children
}: HeroProps): JSX.Element => {
  // State to track if the background image has loaded, for a fade-in effect.
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Mapping for the `height` prop to corresponding Tailwind CSS classes.
  const heightClassMap: Record<HeroHeight, string> = {
    full: 'h-screen',    // Full viewport height.
    large: 'h-[90vh]',   // 90% of viewport height.
    medium: 'h-[70vh]'   // 70% of viewport height.
  };
  
  return (
    // Main section container for the hero unit.
    // `overflow-hidden` is important to contain the `fill` Image component.
    <section className={`relative w-full ${heightClassMap[height]} overflow-hidden`}>
      {/* Background Image using Next.js Image component for optimization. */}
      <Image 
        src={imageSrc}
        alt={imageAlt}
        priority={true} // Prioritize loading for LCP (Largest Contentful Paint) if this is a critical image.
        fill={true}     // Makes the image fill its parent container. Parent must be relative/absolute/fixed.
        quality={95}    // Image quality (1-100).
        sizes="100vw"   // Informs Next.js that the image will span the full viewport width.
        style={{objectFit: 'cover'}} // CSS for how the image should cover the container.
        className={`
          transition-opacity duration-700 ease-in-out
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `} // Fade-in effect once loaded.
        onLoad={() => setIsLoaded(true)} // Set loaded state to true when image finishes loading.
      />
      
      {/* Optional Overlay and Content Area */}
      {/* Renders if `overlay` is true. Displays heading, subheading, and children over a dark overlay. */}
      {overlay && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center"> {/* Dark semi-transparent overlay. */}
          <div className="text-center text-white p-4 max-w-3xl"> {/* Centered content container. */}
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
            {/* Render any custom children passed to the component. */}
            {children}
          </div>
        </div>
      )}
      
      {/* Content Area without Overlay */}
      {/* Renders if `overlay` is false but `children` are provided. Displays children without a dark overlay. */}
      {!overlay && children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4"> {/* Added padding for consistency */}
            {children}
          </div>
        </div>
      )}
      
      {/* Film Grain Effect Overlay */}
      {/* Adds a subtle visual texture over the entire hero section. */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none" // Styling for the grain effect.
        style={{
          backgroundImage: `url("/images/film-grain.svg")` // Path to the SVG grain pattern.
        }}
        aria-hidden="true" // Decorative element.
      />
    </section>
  );
};

export default Hero;