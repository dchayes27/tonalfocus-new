# High-Quality Image Display System

## Overview
The TonalFocus portfolio now uses a quality-first image display system designed specifically for professional photography with emphasis on preserving tonal range, especially in midtone-heavy black & white work.

## Features

### 1. Modern Image Format Support
- **AVIF**: Primary format with superior compression and 12-bit color depth
- **WebP**: Secondary format for broader browser support
- **JPEG**: Fallback at 95% quality for maximum compatibility

### 2. Professional Lightbox
- Full-screen viewing for detailed inspection
- Zoom functionality (click or press spacebar)
- Keyboard navigation (← → arrows, ESC to close)
- Smooth transitions and elegant UI

### 3. Quality-First Loading
- Native browser lazy loading
- Subtle loading states
- No aggressive optimization or compression

## Image Preparation Guidelines

### Recommended Workflow

1. **Master Files** (Your 1GB TIFFs)
   - Keep these as your archival copies
   - Never compress or alter these files

2. **Web Preparation**
   ```
   Resolution: 2000px on longest side
   Color Space: sRGB
   Bit Depth: 8-bit (for web)
   
   Export Settings:
   - AVIF: 85-90 quality
   - WebP: 90-95 quality  
   - JPEG: 95-100 quality
   
   Target: <500KB per image
   ```

3. **Black & White Considerations**
   - Ensure `is_black_white` field is set in database
   - Photos will automatically group by B&W vs Color
   - Preserve full tonal range during conversion

## Usage

### Portfolio Page
Photos are automatically grouped into BLACK & WHITE and COLOR sections. Click any image to open in the lightbox.

### Lightbox Controls
- **Click image**: Toggle zoom
- **Spacebar**: Toggle zoom
- **← →**: Navigate between images
- **ESC**: Close lightbox

## Technical Implementation

### Components

1. **HighQualityImage**
   - Handles format detection and fallbacks
   - Implements quality-preserving loader
   - Provides loading states

2. **Lightbox**
   - React Portal for overlay
   - Keyboard event handling
   - Zoom functionality

3. **PhotographyGallery**
   - Responsive grid layout
   - Integration with lightbox
   - Hover effects

### Next Steps

1. **CDN Integration**: Configure Cloudinary or similar for automatic format conversion
2. **Upload Flow**: Add format conversion to admin interface
3. **Performance Monitoring**: Track Core Web Vitals with focus on LCP

## Best Practices

1. **Always prioritize quality over speed** - Your audience expects to wait for fine art
2. **Test on multiple devices** - Ensure midtones display correctly everywhere
3. **Monitor file sizes** - Keep under 500KB while maintaining quality
4. **Use progressive encoding** - Better perceived performance

## Resources

- [AVIF Guide](https://avif.io/)
- [Web Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Next.js Image Component](https://nextjs.org/docs/pages/api-reference/components/image)
