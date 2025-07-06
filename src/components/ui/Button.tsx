/**
 * @file src/components/ui/Button.tsx
 * @description A versatile button component for the TonalFocus application.
 * It can render as a standard HTML button or as a Next.js Link component if an `href` prop is provided.
 * The component supports multiple visual variants and custom styling.
 * It's a Client Component due to potential `onClick` handlers and its interactive nature.
 */
'use client'; // Marks this as a Client Component.

import Link from 'next/link'; // Next.js Link component for client-side navigation.
import { ReactNode, HTMLAttributeAnchorTarget } from 'react'; // React types.

/** Defines the available visual styles for the button. */
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline';

/** Props for the Button component. */
interface ButtonProps {
  /** The content to be displayed inside the button (e.g., text, icons). */
  children: ReactNode;
  /** If provided, the button will render as a Next.js Link, navigating to this URL. */
  href?: string;
  /** The visual style variant of the button. Defaults to 'primary'. */
  variant?: ButtonVariant;
  /** Additional CSS class names to apply to the button for custom styling. */
  className?: string;
  /** Event handler for button clicks. Only applicable if `href` is not provided. */
  onClick?: () => void;
  /** The HTML `type` attribute for the button. Defaults to 'button'. Only applicable if `href` is not provided. */
  type?: 'button' | 'submit' | 'reset';
  /** Target attribute for links, e.g. '_blank'. */
  target?: HTMLAttributeAnchorTarget;
  /** Rel attribute for links, e.g. 'noopener noreferrer'. */
  rel?: string;
}

/**
 * Renders a button or a link with predefined styling variants.
 * The base style includes 'retro-button' for a specific visual theme.
 *
 * @param {ButtonProps} props - The properties for the button component.
 * @returns {JSX.Element} A button or Link element.
 */
const Button = ({
  children,
  href,
  variant = 'primary', // Default variant.
  className = '',      // Default to no extra classes.
  onClick,
  type = 'button',     // Default HTML button type.
  target,
  rel,
}: ButtonProps): JSX.Element => {
  // Defines the Tailwind CSS classes for each button variant.
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary-teal hover:bg-primary-teal/80 text-white",
    secondary: "bg-primary-charcoal hover:bg-primary-charcoal/80 text-white",
    tertiary: "bg-primary-mauve hover:bg-primary-mauve/80 text-white",
    outline: "bg-transparent border-2 border-primary-teal text-primary-teal hover:bg-primary-teal/10"
  };
  
  // Base styles applied to all buttons/links, plus variant-specific and custom classes.
  // 'retro-button' is a global style defined in globals.css.
  const baseStyles = "retro-button transition-colors duration-300";
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  // If an `href` is provided, the component renders as a Next.js Link.
  // This is suitable for navigation purposes.
  if (href) {
    return (
      <Link href={href} className={combinedStyles} target={target} rel={target === '_blank' ? rel || 'noopener noreferrer' : rel}>
        {children}
      </Link>
    );
  }
  
  // Otherwise, it renders as a standard HTML button.
  // This is suitable for actions within a form or triggering JavaScript functions.
  return (
    <button className={combinedStyles} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;