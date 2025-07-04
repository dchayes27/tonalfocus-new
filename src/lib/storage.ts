import { createClient } from './supabase-client';
import { CreatePhotoInput } from './types';

// Storage bucket names
export const PHOTOS_BUCKET = 'photos';
export const THUMBNAILS_BUCKET = 'thumbnails';

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed image types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Get image dimensions from a File object
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Generate a unique filename for storage
 */
export function generateStorageFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalFilename.split('.').pop()?.toLowerCase() || 'jpg';
  return `${timestamp}-${random}.${extension}`;
}

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucket: string = PHOTOS_BUCKET
): Promise<{ path: string; publicUrl: string }> {
  const supabase = createClient();
  
  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
  }
  
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit.');
  }
  
  // Generate unique filename
  const filename = generateStorageFilename(file.name);
  const path = `${new Date().getFullYear()}/${filename}`;
  
  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file);
    
  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  return { path, publicUrl };
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(path: string, bucket: string = PHOTOS_BUCKET): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
    
  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Create a thumbnail (for now, we'll use the same image)
 * In production, you'd want to use a service like Sharp or ImageMagick
 */
export async function createThumbnail(file: File): Promise<{ path: string; publicUrl: string }> {
  // For now, upload the same image to thumbnails bucket
  // In production, you'd resize the image first
  return uploadImage(file, THUMBNAILS_BUCKET);
}
