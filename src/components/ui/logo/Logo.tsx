/**
 * @file src/components/ui/logo/Logo.tsx
 * @description Defines the main Logo component for the TonalFocus application.
 * The logo consists of an animated geometric icon and animated text ("tonal focus").
 * It respects user preference for reduced motion by disabling animations if set.
 * The entire logo is a link to the homepage.
 * This is a Client Component due to its use of React hooks and Framer Motion for animations.
 */
'use client'; // Marks this as a Client Component.

import React, { useState, useEffect } from 'react'; // React hooks.
import Link from 'next/link'; // Next.js Link component for navigation.
import { motion } from 'framer-motion'; // Framer Motion for animations.

/**
 * Custom hook (defined locally within this file) to detect user preference for reduced motion.
 * Listens to the `prefers-reduced-motion` CSS media query.
 *
 * @returns {boolean} `true` if the user prefers reduced motion, `false` otherwise.
 * @note This is a local implementation. If a global `useReducedMotion` hook exists
 *       (e.g., in `src/hooks/`), consider using that for consistency and to avoid duplication.
 */
const useReducedMotionHook = () => { // Renamed to avoid conflict if a global hook is imported
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Ensure this runs only on the client-side.
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches); // Set initial state.
    
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    // Cleanup listener on component unmount.
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []); // Empty dependency array ensures this runs once on mount.
  
  return prefersReducedMotion;
};

/**
 * LogoIcon Component.
 * Renders the geometric, animated part of the logo.
 * Displays a static version if reduced motion is preferred.
 * The animation consists of several colored squares appearing with a slight delay.
 */
const LogoIcon = () => {
  const prefersReducedMotion = useReducedMotionHook(); // Use the local hook.
  
  // Static version for users who prefer reduced motion.
  if (prefersReducedMotion) {
    return (
      <div className="relative w-14 h-14" aria-hidden="true"> {/* Icon is decorative */}
        {/* Static squares forming the logo shape */}
        <div className="absolute top-0 left-0 w-[70%] h-[70%] bg-primary-teal" />
        <div className="absolute bottom-0 right-0 w-[70%] h-[70%] bg-primary-teal" />
        <div className="absolute top-0 right-0 w-[70%] h-[70%] bg-primary-teal" />
        <div className="absolute bottom-0 left-0 w-[70%] h-[70%] bg-primary-mauve" />
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white" />
      </div>
    );
  }
  
  // Animation variants for the squares (fade in and scale up).
  const squareVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  // Animated version using Framer Motion.
  return (
    <div className="relative w-14 h-14" aria-hidden="true"> {/* Icon is decorative */}
      {/* Animated Teal Squares */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={squareVariants}
        className="absolute top-0 left-0 w-[70%] h-[70%] bg-primary-teal"
      />
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={squareVariants}
        transition={{ delay: 0.1 }} // Staggered animation.
        className="absolute bottom-0 right-0 w-[70%] h-[70%] bg-primary-teal"
      />
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={squareVariants}
        transition={{ delay: 0.2 }}
        className="absolute top-0 right-0 w-[70%] h-[70%] bg-primary-teal"
      />
      
      {/* Animated Mauve Square */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={squareVariants}
        transition={{ delay: 0.3 }}
        className="absolute bottom-0 left-0 w-[70%] h-[70%] bg-primary-mauve"
      />
      
      {/* Animated White Center Square */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={squareVariants}
        transition={{ delay: 0.4 }}
        className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white"
      />
    </div>
  );
};

/**
 * Main Logo Component.
 * Combines the `LogoIcon` with the text "tonal focus".
 * The text also animates unless reduced motion is preferred.
 * The entire logo links to the homepage.
 */
const Logo = () => {
  const prefersReducedMotion = useReducedMotionHook(); // Use the local hook.
  
  // Animation variants for the text (fade in and slide up slightly).
  const textVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  // Static version for users who prefer reduced motion.
  if (prefersReducedMotion) {
    return (
      <Link href="/" className="flex items-center gap-3" aria-label="TonalFocus Photography Homepage">
        <LogoIcon />
        <div className="flex items-baseline">
          <span className="font-sans text-2xl text-primary-teal tracking-wider lowercase">
            tonal
          </span>
          <span className="font-sans text-2xl font-bold text-primary-mauve tracking-wider lowercase ml-1">
            focus
          </span>
        </div>
      </Link>
    );
  }
  
  // Animated version.
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="TonalFocus Photography Homepage">
      <LogoIcon />
      <div className="flex items-baseline">
        {/* Animated "tonal" text */}
        <motion.span 
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="font-sans text-2xl text-primary-teal tracking-wider lowercase"
        >
          tonal
        </motion.span>
        {/* Animated "focus" text */}
        <motion.span 
          initial="hidden"
          animate="visible"
          variants={textVariants}
          transition={{ delay: 0.1 }} // Staggered animation for "focus".
          className="font-sans text-2xl font-bold text-primary-mauve tracking-wider lowercase ml-1"
        >
          focus
        </motion.span>
      </div>
    </Link>
  );
};

export default Logo;