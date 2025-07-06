/**
 * @file src/components/ui/Card.tsx
 * @description A reusable Card component for displaying content within a styled container.
 * It supports different color variants, an optional title, and an optional grain overlay effect.
 * This is a Client Component, suitable for general UI structuring.
 */
'use client'; // Marks this as a Client Component.

import { ReactNode } from 'react'; // React type for children elements.

/** Defines the available visual styles for the card background and text. */
type CardVariant = 'white' | 'teal' | 'beige' | 'mauve';

/** Props for the Card component. */
interface CardProps {
  /** The content to be displayed inside the card. */
  children: ReactNode;
  /** An optional title to display at the top of the card. */
  title?: string;
  /** The color variant of the card. Defaults to 'white'.
   *  - 'white': Off-white background, charcoal text/border.
   *  - 'teal': Teal background, white text, charcoal border.
   *  - 'beige': Beige background, charcoal text/border.
   *  - 'mauve': Mauve background, white text, charcoal border.
   */
  variant?: CardVariant;
  /** If true, applies a 'grain-overlay' CSS class for a textured effect. Defaults to false. */
  withGrain?: boolean;
  /** Additional CSS class names to apply to the card for custom styling. */
  className?: string;
}

/**
 * Renders a content card with various styling options.
 *
 * @param {CardProps} props - The properties for the card component.
 * @returns {JSX.Element} A div element styled as a card.
 */
const Card = ({
  children,
  title,
  variant = 'white',    // Default variant.
  withGrain = false,  // Default to no grain overlay.
  className = ''      // Default to no extra classes.
}: CardProps): JSX.Element => {
  // Defines Tailwind CSS classes for each card variant.
  // These control background color, border color, and default text color.
  const variantStyles: Record<CardVariant, string> = {
    white: "bg-secondary-offWhite border-primary-charcoal text-primary-charcoal",
    teal: "bg-primary-teal border-primary-charcoal text-white", // Teal and Mauve variants have white text by default.
    beige: "bg-primary-beige border-primary-charcoal text-primary-charcoal",
    mauve: "bg-primary-mauve border-primary-charcoal text-white"
  };
  
  // Base classes for padding and border, combined with variant-specific styles,
  // custom classes, and conditional grain overlay class.
  const cardClasses = `
    p-6
    border-2
    ${variantStyles[variant]}
    ${className}
    ${withGrain ? 'grain-overlay' : ''}
  `.trim().replace(/\s+/g, ' '); // Clean up extra spaces.

  // Title text color logic:
  // For 'teal' and 'mauve' variants (dark backgrounds), the title text is white.
  // For other variants (lighter backgrounds), the title text is primary-teal.
  const titleColorClass = (variant === 'teal' || variant === 'mauve')
    ? 'text-white'
    : 'text-primary-teal';

  return (
    <div className={cardClasses}>
      {/* Conditionally render the title if provided. */}
      {title && (
        <h2 className={`text-2xl mb-4 font-medium ${titleColorClass}`}>
          {title}
        </h2>
      )}
      {/* Render the main content of the card. */}
      {children}
    </div>
  );
};

export default Card;