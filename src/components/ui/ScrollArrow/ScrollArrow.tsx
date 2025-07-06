/**
 * @file src/components/ui/ScrollArrow/ScrollArrow.tsx
 * @description A UI component that displays an animated downward-pointing arrow.
 * When clicked, it smoothly scrolls the page to a specified target element.
 * This component uses `framer-motion` for animation and is a Client Component.
 */
'use client'; // Marks this as a Client Component due to event handling and Framer Motion.

import React from 'react'; // React library.
import { motion } from 'framer-motion'; // Framer Motion for animations.

/** Props for the ScrollArrow component. */
interface ScrollArrowProps {
  /** The ID of the HTML element to scroll to when the arrow is clicked. */
  targetId: string;
}

/**
 * ScrollArrow Component.
 * Renders an animated arrow that scrolls to a target element on click.
 *
 * @param {ScrollArrowProps} props - The properties for the ScrollArrow component.
 * @returns {JSX.Element} An animated arrow icon wrapped in a div.
 */
const ScrollArrow: React.FC<ScrollArrowProps> = ({ targetId }) => {
  /**
   * Handles the click event on the arrow.
   * Finds the target element by its ID and smoothly scrolls it into view.
   */
  const handleClick = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling behavior.
    } else {
      console.warn(`ScrollArrow: Target element with ID "${targetId}" not found.`);
    }
  };

  return (
    // Outer container for centering and padding.
    <div className="flex justify-center py-4 bg-white">
      {/* Framer Motion div for animating the arrow. */}
      <motion.div 
        className="cursor-pointer" // Makes the arrow clickable.
        // Animation properties: makes the arrow move up and down.
        animate={{ y: [0, 10, 0] }} // y-position animates from 0 to 10px and back to 0.
        transition={{
          repeat: Infinity, // Animation repeats indefinitely.
          duration: 2,      // Duration of one animation cycle (in seconds).
          ease: "easeInOut" // Easing function for a smoother animation.
        }}
        onClick={handleClick} // Attach click handler.
        aria-label={`Scroll to ${targetId}`} // Accessibility label.
      >
        {/* SVG icon for the downward arrow. */}
        <svg 
          width="36"  // SVG width.
          height="36" // SVG height.
          viewBox="0 0 24 24" // SVG viewbox.
          fill="none" // No fill for the SVG container itself.
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-mauve" // Sets the stroke color using Tailwind.
        >
          <path 
            d="M7 10L12 15L17 10" // Defines the arrow shape.
            stroke="currentColor" // Stroke color inherits from `className`.
            strokeWidth="2.5"    // Stroke width.
            strokeLinecap="round" // Rounded line caps.
            strokeLinejoin="round"// Rounded line joins.
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default ScrollArrow;