# Filmstrip Banner Documentation

## Overview

The Filmstrip Banner is an interactive homepage hero section that displays featured portfolio images in a horizontal scrolling format on desktop, mimicking the look and feel of a traditional film strip.

## Features

### Desktop Experience
- **Horizontal Scroll Animation**: As users scroll down, images move horizontally across the screen
- **Film Strip Aesthetic**: Complete with perforation holes at top and bottom
- **Smooth Performance**: Uses CSS transforms and `will-change` for 60fps animation
- **Large Format**: Images displayed at 70vh height for maximum impact
- **Sticky Positioning**: Banner stays in place while images scroll horizontally

### Mobile Experience
- **Vertical Stack**: Images are displayed in a traditional vertical layout
- **Touch-Friendly**: Standard mobile scrolling behavior
- **Responsive Sizing**: Images sized at 90vw for optimal mobile viewing

## Implementation Details

### Components

1. **FilmstripBanner** (`/src/components/home/FilmstripBanner.tsx`)
   - Client component that handles the scroll animation logic
   - Accepts an array of Photo objects
   - Manages mobile/desktop behavior switching

2. **FilmstripBannerWrapper** (`/src/components/home/FilmstripBannerWrapper.tsx`)
   - Server component that fetches featured photos from database
   - Falls back to latest photos if no featured photos exist
   - Passes data to FilmstripBanner component

### Database Integration

The banner pulls featured photos using the following query:
```sql
SELECT * FROM photos 
WHERE is_featured = true 
ORDER BY display_order ASC 
LIMIT 6
```

### Styling

- Film perforation effect using positioned divs
- Photo numbering overlay (01, 02, etc.)
- Maintains 90s aesthetic with color scheme
- Shadow effects for depth

### Performance Considerations

- Images loaded with Next.js Image component
- Priority loading for first 3 images
- Transform animations use GPU acceleration
- Resize handlers optimize scroll calculations

## Usage

Simply import and use in your page:

```tsx
import FilmstripBannerWrapper from '@/components/home/FilmstripBannerWrapper';

export default function HomePage() {
  return (
    <>
      <FilmstripBannerWrapper />
      {/* Rest of page content */}
    </>
  );
}
```

## Configuration

To feature photos in the banner:
1. Set `is_featured = true` on desired photos in the database
2. Adjust `display_order` to control sequence
3. Banner automatically pulls the first 6 featured photos

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers with touch support
- Graceful degradation for older browsers
