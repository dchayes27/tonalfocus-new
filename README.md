# TonalFocus Photography Portfolio

A modern photography portfolio website built with Next.js, featuring a 90s retro tech aesthetic. The site prioritizes high-quality image optimization while maintaining a distinctive visual style.

## Key Features

- Next.js App Router architecture
- Built-in image optimization with WebP conversion
- 90s retro tech aesthetic with square buttons and period-appropriate styling
- Custom color palette with dusty teal, electronics beige, charcoal, and mauve
- Responsive design that works across all devices
- TypeScript for type safety
- Tailwind CSS for styling

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Image Optimization

This project uses Next.js built-in Image component and optimization features to:

- Automatically convert images to WebP format for browsers that support it
- Provide responsive sizing with proper sizes attribute
- Lazy load images and provide placeholders
- Serve the appropriate size image based on the device
- Maintain high quality for photography with a quality setting of 95

## Project Structure

```
/tonalfocus-new
├── /public
│   └── /images          # Photography images and logo
├── /src
│   ├── /app             # Next.js App Router pages
│   │   ├── /about
│   │   ├── /contact
│   │   ├── /portfolio
│   │   ├── layout.tsx   # Root layout with header/footer
│   │   └── page.tsx     # Homepage
│   └── /components      # Reusable components
│       ├── /ui          # UI components like buttons
│       ├── Hero.tsx     # Hero component for full-width images
│       └── Gallery.tsx  # Gallery component for image grids
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Project dependencies
```

## Deployment

This project is optimized for deployment on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments.