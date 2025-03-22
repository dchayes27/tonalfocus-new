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

## Deployment Options

### Option 1: GitHub + Vercel (Recommended)

Use the provided script to push to GitHub and then deploy via Vercel:

```bash
# Make the script executable
chmod +x reset-and-push.sh

# Run the script to push to GitHub
./reset-and-push.sh
```

Then connect your GitHub repository to Vercel.

### Option 2: Direct Vercel CLI Deployment

You can also deploy directly using the Vercel CLI:

```bash
# Make the script executable
chmod +x deploy-to-vercel.sh

# Run the script to deploy to Vercel
./deploy-to-vercel.sh
```

## Image Optimization

This project uses Next.js built-in Image component and optimization features to:

- Automatically convert images to WebP format for browsers that support it
- Provide responsive sizing with proper sizes attribute
- Lazy load images and provide placeholders
- Serve the appropriate size image based on the device

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

## Troubleshooting

If you encounter the error `Unrecognized key(s) in object: 'quality' at "images"`, make sure your `next.config.js` file does not include the `quality` property in the `images` configuration, as this is not a valid configuration option. Instead, set the quality on individual Image components using the `quality` prop.