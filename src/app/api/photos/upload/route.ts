/**
 * src/app/api/photos/upload/route.ts
 * ------------------------------------
 * This API route handler manages the uploading of new photos.
 * It receives image files and associated metadata via a POST request (multipart/form-data),
 * validates the input, uploads the image and a generated thumbnail to cloud storage (Supabase Storage),
 * and then saves the photo's metadata to the Supabase database.
 *
 * IMPORTANT: Authentication is not yet implemented in this route.
 * It should be added to ensure only authorized users can upload photos.
 */
import { NextRequest, NextResponse } from 'next/server'; // Next.js server utilities.
import { createClient } from '@/lib/supabase-server'; // Server-side Supabase client.
import { 
  uploadImage,          // Helper function to upload an image to storage.
  createThumbnail,      // Helper function to generate and upload a thumbnail.
  getImageDimensions,   // Helper function to get image dimensions.
  extractExifData,      // Helper function to extract EXIF metadata.
  ALLOWED_IMAGE_TYPES,  // Constant array of allowed image MIME types.
  MAX_FILE_SIZE,        // Constant for maximum allowed file size.
  PHOTOS_BUCKET         // Constant for the name of the Supabase Storage bucket for photos.
} from '@/lib/storage';   // Storage utility functions and constants.
import { triggerRevalidation } from '@/lib/revalidate';

/**
 * Handles POST requests to the /api/photos/upload endpoint.
 * Processes form data containing an image file and its metadata,
 * performs validation, uploads files, and records data in the database.
 *
 * @param {NextRequest} request - The incoming Next.js request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 *          On success, returns a JSON response with the newly created photo data.
 *          On failure, returns a JSON response with an error message and appropriate status code.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(); // Initialize Supabase client.
    
    // TODO: Implement authentication check here.
    // This is crucial for securing the upload functionality.
    // For now, uploads are permitted without authentication, which is a security risk.
    
    const formData = await request.formData(); // Parse multipart/form-data.
    
    // Extract data from the form.
    const file = formData.get('file') as File | null; // The uploaded image file.
    const title = formData.get('title') as string | null; // Title of the photo.
    const description = formData.get('description') as string | null; // Optional description.
    const categoryId = formData.get('category_id') as string | null; // Optional category ID.
    const isFeatured = formData.get('is_featured') === 'true'; // Boolean flag for featured status.
    const isBlackWhite = formData.get('is_black_white') === 'true'; // TRUE for B&W, FALSE for color.
    
    // Convert empty strings to null for database fields
    const cleanDescription = description?.trim() || null;
    const cleanCategoryId = categoryId?.trim() || null;

    // --- Input Validation ---
    // Validate that essential fields (file and title) are provided.
    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required fields.' },
        { status: 400 } // Bad Request.
      );
    }

    // Validate the file type against a list of allowed MIME types.
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}.` },
        { status: 400 } // Bad Request.
      );
    }
    
    // Validate the file size against a maximum limit.
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.` },
        { status: 400 } // Bad Request.
      );
    }
    
    // --- Image Processing & Storage ---
    // Get the dimensions (width and height) of the uploaded image.
    const dimensions = await getImageDimensions(file);
    
    // Extract EXIF data
    const exifData = await extractExifData(file);
    
    // Upload the main image file to Supabase Storage.
    // `randomizeFilename: true` helps prevent filename collisions.
    const { path: storagePath, publicUrl } = await uploadImage(file, PHOTOS_BUCKET, true);
    console.log('Main image uploaded successfully:', { storagePath, publicUrl });
    
    // Create a thumbnail from the image file and upload it.
    const { path: thumbnailPath, publicUrl: thumbnailUrl } = await createThumbnail(file, true);
    console.log('Thumbnail created successfully:', { thumbnailPath, thumbnailUrl });
    
    // --- Database Interaction ---
    // Prepare data for insertion into the 'photos' table.
    const photoDataToInsert = {
      title,
      description: cleanDescription,    // Use cleaned description (null instead of empty string)
      category_id: cleanCategoryId,     // Use cleaned category ID (null instead of empty string)
      filename: file.name,
      file_size: file.size,
      width: dimensions.width,
      height: dimensions.height,
      storage_path: storagePath,        // Path in Supabase Storage for the main image.
      public_url: publicUrl,            // Publicly accessible URL for the main image.
      thumbnail_path: thumbnailPath,    // Path in Supabase Storage for the thumbnail.
      thumbnail_url: thumbnailUrl,      // Publicly accessible URL for the thumbnail.
      is_featured: isFeatured,
      is_black_white: isBlackWhite,     // Track if photo is B&W (true) or color (false)
      display_order: 999,               // Default to end of list
      metadata: {                       // Store additional metadata as a JSON object.
        originalName: file.name,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        exif: exifData || {},           // Include EXIF data
        colorMode: isBlackWhite ? 'black_white' : 'color'
      }
    };

    // Insert the photo metadata into the 'photos' table.
    const { data, error } = await supabase
      .from('photos')
      .insert(photoDataToInsert)
      .select()  // Select the newly inserted record.
      .single(); // Expect a single record to be returned.
      
    // Handle potential errors during database insertion.
    if (error) {
      console.error('Database insert error:', error);
      // TODO: Implement cleanup logic for uploaded files if database insert fails.
      // This might involve deleting the `storagePath` and `thumbnailPath` from Supabase Storage.
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 } // Internal Server Error.
      );
    }
    
    // If everything is successful, return a success response with the created photo data.
    triggerRevalidation();

    return NextResponse.json({ 
      success: true,
      photo: data 
    });
    
  } catch (error) {
    // Catch any unexpected errors during the process.
    console.error('Upload process error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during upload.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 } // Internal Server Error.
    );
  }
}

// --- Next.js Route Segment Configuration ---
// Specifies the runtime environment for this route. Node.js is required for file system access (implied by form data handling).
export const runtime = 'nodejs';
// Sets the maximum duration for this serverless function to execute, in seconds.
// Useful for long-running operations like file uploads.
export const maxDuration = 60;
