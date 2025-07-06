/**
 * @file src/lib/storage.ts
 * @description Utility functions and constants for interacting with Supabase Storage.
 * This module handles operations like image uploads, deletions, filename generation,
 * and dimension retrieval. It also defines constants for bucket names, file size limits,
 * and allowed image types.
 */

import { createClient as createBrowserSupabaseClient } from './supabase-client'; // Browser-side Supabase client
import { createClient as createServerSupabaseClient } from './supabase-server'; // Server-side Supabase client
// import { CreatePhotoInput } from './types'; // Not directly used in this version of the file.

// --- Constants for Storage Operations ---

/** Name of the Supabase Storage bucket for original photos. */
export const PHOTOS_BUCKET = 'photos';
/** Name of the Supabase Storage bucket for thumbnails. */
export const THUMBNAILS_BUCKET = 'thumbnails';

/** Maximum allowed file size for uploads, set to 10MB. */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

/** Array of allowed MIME types for image uploads. */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', // Often used interchangeably with image/jpeg
  'image/png',
  'image/webp'
];

// --- Interfaces ---

/** Interface representing the dimensions of an image. */
interface ImageDimensions {
  width: number;  // Width of the image in pixels.
  height: number; // Height of the image in pixels.
}

// --- Utility Functions ---

/**
 * Gets the dimensions (width and height) of an image file.
 * This function is intended for browser environments as it uses the `Image` API.
 * On the server-side, it currently returns default dimensions as a fallback.
 *
 * @param {File} file - The image file object.
 * @returns {Promise<ImageDimensions>} A promise that resolves with the image dimensions.
 * @throws {Error} If the image fails to load in a browser environment.
 *
 * @note For robust server-side image processing (e.g., getting dimensions, resizing),
 *       a library like 'sharp' is recommended. This function provides a basic
 *       client-side implementation and a server-side placeholder.
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  // Server-side environment check (window is undefined).
  if (typeof window === 'undefined') {
    console.warn("getImageDimensions called on the server. Returning default dimensions. Use a library like 'sharp' for server-side image processing.");
    // Fallback dimensions for server-side execution.
    // In a real application, this path should ideally not be hit for dimension calculation without a proper server-side library.
    return Promise.resolve({ width: 1920, height: 1080 }); // Default placeholder dimensions.
  }
  
  // Browser-side implementation.
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file); // Create a temporary URL for the file.
    
    img.onload = () => {
      URL.revokeObjectURL(url); // Release the object URL to free up memory.
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url); // Release memory on error as well.
      reject(new Error('Failed to load image to determine dimensions.'));
    };
    
    img.src = url; // Start loading the image.
  });
}

/**
 * Generates a unique filename for storing files in Supabase Storage.
 * The format is: {timestamp}-{randomString}.{extension}
 * Example: 1678886400000-abcdefg.jpg
 *
 * @param {string} originalFilename - The original name of the file being uploaded.
 * @returns {string} A uniquely generated filename.
 */
export function generateStorageFilename(originalFilename: string): string {
  const timestamp = Date.now(); // Current time in milliseconds.
  const random = Math.random().toString(36).substring(2, 9); // A short random alphanumeric string.
  const extension = originalFilename.split('.').pop()?.toLowerCase() || 'jpg'; // Extract file extension, default to 'jpg'.
  return `${timestamp}-${random}.${extension}`;
}

/**
 * Uploads an image file to a specified Supabase Storage bucket.
 * Validates file type and size before uploading.
 *
 * @param {File} file - The image file to upload.
 * @param {string} [bucket=PHOTOS_BUCKET] - The name of the Supabase Storage bucket.
 * @param {boolean} [isServer=false] - Flag to determine if running in a server context (uses server client) or client context.
 * @returns {Promise<{ path: string; publicUrl: string }>} A promise that resolves with the storage path and public URL of the uploaded image.
 * @throws {Error} If validation fails or the upload to Supabase Storage fails.
 */
export async function uploadImage(
  file: File,
  bucket: string = PHOTOS_BUCKET,
  isServer: boolean = false
): Promise<{ path: string; publicUrl: string }> {
  // Select the appropriate Supabase client based on the execution environment.
  const supabase = isServer ? createServerSupabaseClient() : createBrowserSupabaseClient();
  
  // Validate file type.
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}.`);
  }
  
  // Validate file size.
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`);
  }
  
  // Generate a unique filename and construct the storage path.
  // Files are organized by year to prevent overly large directories.
  const filename = generateStorageFilename(file.name);
  const path = `${new Date().getFullYear()}/${filename}`; // e.g., "2023/1678886400000-abcdefg.jpg"
  
  // Upload the file to Supabase Storage.
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file);
    
  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }
  
  // Retrieve the public URL for the uploaded file.
  const { data: urlData, error: urlError } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  if (urlError || !urlData?.publicUrl) {
    console.error("Supabase getPublicUrl error:", urlError);
    // Note: Even if getPublicUrl fails, the file is uploaded. Consider cleanup or alternative URL construction.
    throw new Error(`File uploaded, but failed to get public URL: ${urlError?.message || 'Unknown error'}`);
  }
    
  return { path, publicUrl: urlData.publicUrl };
}

/**
 * Deletes an image from a specified Supabase Storage bucket.
 *
 * @param {string} path - The path of the file to delete within the bucket.
 * @param {string} [bucket=PHOTOS_BUCKET] - The name of the Supabase Storage bucket.
 * @param {boolean} [isServer=false] - Flag for server or client context.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 * @throws {Error} If the deletion from Supabase Storage fails.
 */
export async function deleteImage(
  path: string, 
  bucket: string = PHOTOS_BUCKET,
  isServer: boolean = false
): Promise<void> {
  const supabase = isServer ? createServerSupabaseClient() : createBrowserSupabaseClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]); // `remove` expects an array of paths.
    
  if (error) {
    console.error("Supabase delete error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Creates a thumbnail for an image file.
 *
 * @placeholder
 * IMPORTANT: This is currently a placeholder function. It uploads the original image
 * to the `THUMBNAILS_BUCKET` without any resizing. In a production environment,
 * this function should be replaced with actual image resizing logic (e.g., using
 * a library like 'sharp' on the server-side, or a client-side resizing technique
 * before upload if appropriate).
 *
 * @param {File} file - The image file from which to create a thumbnail.
 * @param {boolean} [isServer=false] - Flag for server or client context.
 * @returns {Promise<{ path: string; publicUrl: string }>} A promise that resolves with the storage path and public URL of the "thumbnail".
 */
export async function createThumbnail(
  file: File,
  isServer: boolean = false
): Promise<{ path: string; publicUrl: string }> {
  console.warn("createThumbnail is a placeholder: it uploads the original image as a thumbnail. Implement proper resizing.");
  // In a real application, you would:
  // 1. Resize the image (e.g., using 'sharp' if on server, or canvas on client before this step).
  // 2. Upload the resized image to the THUMBNAILS_BUCKET.
  return uploadImage(file, THUMBNAILS_BUCKET, isServer); // Reuses uploadImage with the thumbnails bucket.
}
