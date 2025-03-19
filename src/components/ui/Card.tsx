'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  variant?: 'white' | 'teal' | 'beige' | 'mauve';
  withGrain?: boolean;
  className?: string;
}

const Card = ({
  children,
  title,
  variant = 'white',
  withGrain = false,
  className = ''
}: CardProps) => {
  const variantStyles = {
    white: "bg-secondary-offWhite border-primary-charcoal text-primary-charcoal",
    teal: "bg-primary-teal border-primary-charcoal text-white",
    beige: "bg-primary-beige border-primary-charcoal text-primary-charcoal",
    mauve: "bg-primary-mauve border-primary-charcoal text-white"
  };
  
  return (
    <div className={`p-6 border-2 ${variantStyles[variant]} ${className} ${withGrain ? 'grain-overlay' : ''}`}>
      {title && (
        <h2 className={`text-2xl mb-4 ${variant === 'teal' || variant === 'mauve' ? 'text-white' : 'text-primary-teal'}`}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;