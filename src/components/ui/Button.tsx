'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = ({
  children,
  href,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false
}: ButtonProps) => {
  // Define styles for different variants
  const variantStyles = {
    primary: "bg-primary-teal hover:bg-primary-teal/80 text-white",
    secondary: "bg-primary-charcoal hover:bg-primary-charcoal/80 text-white",
    tertiary: "bg-primary-mauve hover:bg-primary-mauve/80 text-white",
    outline: "bg-transparent border-2 border-primary-teal text-primary-teal hover:bg-primary-teal/10"
  };
  
  const baseStyles = "retro-button transition-colors duration-300";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
  const styles = `${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`;
  
  // If href is provided, render a Link component
  if (href) {
    return (
      <Link 
        href={disabled ? '#' : href} 
        className={styles}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }
  
  // Otherwise, render a button
  return (
    <button 
      className={styles} 
      onClick={onClick} 
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;