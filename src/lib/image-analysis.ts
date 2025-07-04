/**
 * Detect if an image is color or black & white
 * This runs in the browser during upload
 */
export async function detectImageColorMode(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      // Sample the image at a smaller size for performance
      const sampleSize = 100;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      
      ctx?.drawImage(img, 0, 0, sampleSize, sampleSize);
      
      try {
        const imageData = ctx?.getImageData(0, 0, sampleSize, sampleSize);
        if (!imageData) {
          resolve(true); // Default to color if we can't analyze
          return;
        }
        
        const data = imageData.data;
        let isColor = false;
        
        // Check pixels for color
        // Skip every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // If R, G, B values differ significantly, it's a color image
          const diff = Math.max(
            Math.abs(r - g),
            Math.abs(g - b),
            Math.abs(r - b)
          );
          
          // Threshold of 30 accounts for slight variations in B&W images
          if (diff > 30) {
            isColor = true;
            break;
          }
        }
        
        resolve(isColor);
      } catch (error) {
        console.error('Error analyzing image:', error);
        resolve(true); // Default to color on error
      }
      
      // Clean up
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      resolve(true); // Default to color on error
      URL.revokeObjectURL(img.src);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Server-side color detection (for future use with Sharp or similar)
 * Currently returns true as placeholder
 */
export async function detectImageColorModeServer(buffer: Buffer): Promise<boolean> {
  // TODO: Implement server-side detection with Sharp
  // For now, this is a placeholder
  console.log('Server-side color detection not yet implemented');
  return true;
}
