'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollArrowProps {
  targetId: string;
}

const ScrollArrow: React.FC<ScrollArrowProps> = ({ targetId }) => {
  const handleClick = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex justify-center py-4 bg-white">
      <motion.div 
        className="cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={handleClick}
      >
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-mauve"
        >
          <path 
            d="M7 10L12 15L17 10" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default ScrollArrow;