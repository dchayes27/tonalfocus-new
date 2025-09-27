import type { Buffer } from 'node:buffer';
import { createClient } from './supabase-client';
import { createServiceRoleClient } from './supabase-server';
import { CreatePhotoInput } from './types';
import exifr from 'exifr';

// Storage bucket names
export const PHOTOS_BUCKET = 'photos';
export const THUMBNAILS_BUCKET = 'thumbnails';

// Maximum file size (50MB to match Supabase free tier limit)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

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

interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: number;
  aperture?: number;
  shutterSpeed?: string;
  iso?: number;
  dateTime?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}

/**
 * Extract EXIF data from image file
 */
export async function extractExifData(file: File): Promise<ExifData | null> {
  try {
    const exif = await exifr.parse(file, {
      // Pick specific tags we're interested in
      pick: [
        'Make', 'Model', 'LensModel', 'FocalLength', 'FNumber', 
        'ExposureTime', 'ISO', 'DateTimeOriginal', 'latitude', 'longitude'
      ]
    });
    
    if (!exif) return null;
    
    return {
      camera: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : undefined,
      lens: exif.LensModel,
      focalLength: exif.FocalLength,
      aperture: exif.FNumber,
      shutterSpeed: exif.ExposureTime ? `1/${Math.round(1/exif.ExposureTime)}` : undefined,
      iso: exif.ISO,
      dateTime: exif.DateTimeOriginal,
      latitude: exif.latitude,
      longitude: exif.longitude,
      ...exif
    };
  } catch (error) {
    console.error('Failed to extract EXIF data:', error);
    return null;
  }
}

/**
 * Get image dimensions from a File object
 * Note: This only works in browser environment
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  if (typeof window === 'undefined') {
    return Promise.resolve({ width: 1920, height: 1080 });
  }

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
  bucket: string = PHOTOS_BUCKET,
  isServer: boolean = false
): Promise<{ path: string; publicUrl: string }> {
  const supabase = isServer ? createServiceRoleClient() : createClient();
  
  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
  }
  
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    const maxMB = (MAX_FILE_SIZE / 1024 / 1024).toFixed(0);
    throw new Error(`File size (${sizeMB}MB) exceeds ${maxMB}MB limit.`);
  }
  
  // Generate unique filename
  const filename = generateStorageFilename(file.name);
  const path = `${new Date().getFullYear()}/${filename}`;
  
  // Upload to Supabase Storage with chunking for large files
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) {
    console.error('Supabase storage error:', error);
    
    // Provide more specific error messages
    if (error.message.includes('exceeded the maximum allowed size')) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      throw new Error(`File too large (${sizeMB}MB). Your Supabase plan may have a lower limit than expected. Try a smaller file.`);
    }
    
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
export async function deleteImage(
  path: string, 
  bucket: string = PHOTOS_BUCKET,
  isServer: boolean = false
): Promise<void> {
  const supabase = isServer ? createServiceRoleClient() : createClient();
  
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
export async function createThumbnail(
  file: File,
  isServer: boolean = false
): Promise<{ path: string; publicUrl: string }> {
  // For now, upload the same image to thumbnails bucket
  // In production, you'd resize the image first
  return uploadImage(file, THUMBNAILS_BUCKET, isServer);
}

/**
 * --- Server-side helpers using Sharp ---
 */

async function getSharpInstance() {
  const sharpModule = await import('sharp');
  return sharpModule.default || sharpModule;
}

export async function getImageDimensionsFromBuffer(buffer: Buffer): Promise<ImageDimensions> {
  const sharp = await getSharpInstance();
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}

interface UploadBufferOptions {
  buffer: Buffer;
  bucket?: string;
  contentType: string;
  extension: string;
}

export async function uploadImageFromBuffer({
  buffer,
  bucket = PHOTOS_BUCKET,
  contentType,
  extension,
}: UploadBufferOptions): Promise<{ path: string; publicUrl: string }> {
  const supabase = createServiceRoleClient();
  const filename = generateStorageFilename(`upload.${extension}`);
  const path = `${new Date().getFullYear()}/${filename}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      cacheControl: '3600',
      upsert: false,
      contentType,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return { path, publicUrl };
}

export async function createThumbnailFromBuffer(buffer: Buffer): Promise<{ path: string; publicUrl: string }> {
  const sharp = await getSharpInstance();
  const processed = await sharp(buffer)
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();

  return uploadImageFromBuffer({
    buffer: processed,
    bucket: THUMBNAILS_BUCKET,
    contentType: 'image/jpeg',
    extension: 'jpg',
  });
}
