'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Check if reduced motion is preferred
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const onChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', onChange);
    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, []);
  
  return prefersReducedMotion;
};

const LogoIcon = () => {
  const prefersReducedMotion = useReducedMotion();
  
  // Skip animations for users who prefer reduced motion
  if (prefersReducedMotion) {
    return (
      <div className="relative w-14 h-14">
        <div className="absolute top-0 left-0 w-[70%] h-[70%] bg-primary-teal" />
        <div className="absolute bottom-0 right-0 w-[70%] h-[70%] bg-primary-teal" />
        <div className="absolute top-0 right-0 w-[70%] h-[70%] bg-primary-teal" />
        <div className="absolute bottom-0 left-0 w-[70%] h-[70%] bg-primary-mauve" />
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white" />
      </div>
    );
  }
  
  // Framer motion variants for animated squares
  const squareVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };
  
  return (
    <div className="relative w-14 h-14">
      {/* Teal squares with animation */}
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
        transition={{ delay: 0.1 }}
        className="absolute bottom-0 right-0 w-[70%] h-[70%] bg-primary-teal"
      />
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={squareVariants}
        transition={{ delay: 0.2 }}
        className="absolute top-0 right-0 w-[70%] h-[70%] bg-primary-teal"
      />
      
      {/* Mauve square with animation */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={squareVariants}
        transition={{ delay: 0.3 }}
        className="absolute bottom-0 left-0 w-[70%] h-[70%] bg-primary-mauve"
      />
      
      {/* White center with animation */}
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

const Logo = () => {
  const prefersReducedMotion = useReducedMotion();
  
  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  // Skip animations for users who prefer reduced motion
  if (prefersReducedMotion) {
    return (
      <Link href="/" className="flex items-center gap-3">
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
  
  return (
    <Link href="/" className="flex items-center gap-3">
      <LogoIcon />
      <div className="flex items-baseline">
        <motion.span 
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="font-sans text-2xl text-primary-teal tracking-wider lowercase"
        >
          tonal
        </motion.span>
        <motion.span 
          initial="hidden"
          animate="visible"
          variants={textVariants}
          transition={{ delay: 0.1 }}
          className="font-sans text-2xl font-bold text-primary-mauve tracking-wider lowercase ml-1"
        >
          focus
        </motion.span>
      </div>
    </Link>
  );
};

export default Logo;