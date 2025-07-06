/**
 * @file src/lib/types.ts
 * @description This module defines shared TypeScript interfaces and types used throughout
 * the TonalFocus Photography Portfolio application. These types help ensure data
 * consistency and provide autocompletion and type-checking benefits during development.
 * It includes types for database entities (like Category and Photo) and for data
 * transfer objects (DTOs) or input shapes for forms and API payloads.
 */

/**
 * Represents a photography category.
 * Corresponds to the 'categories' table in the database.
 */
export interface Category {
  id: string;                    // Unique identifier (UUID) for the category.
  name: string;                  // Human-readable name of the category (e.g., "Landscape").
  slug: string;                  // URL-friendly slug for the category (e.g., "landscape").
  description: string | null;    // Optional descriptive text for the category.
  display_order: number;         // Integer used for sorting categories in UI displays.
  created_at: string;            // ISO string representation of the creation timestamp.
  updated_at: string;            // ISO string representation of the last update timestamp.
}

/**
 * Represents a photograph and its metadata.
 * Corresponds to the 'photos' table in the database.
 */
export interface Photo {
  id: string;                    // Unique identifier (UUID) for the photo.
  title: string;                 // Title of the photo.
  description: string | null;    // Optional description or caption for the photo.
  category_id: string | null;    // Foreign key referencing the ID of the category this photo belongs to. Nullable.
  filename: string;              // Original filename of the uploaded image.
  file_size: number;             // Size of the original image file in bytes.
  width: number;                 // Width of the original image in pixels.
  height: number;                // Height of the original image in pixels.
  storage_path: string;          // Path to the original image file within Supabase Storage (e.g., "public/photos/image.jpg").
  public_url: string;            // Publicly accessible URL for the original image from Supabase Storage.
  thumbnail_path: string;        // Path to the thumbnail image file within Supabase Storage (e.g., "public/thumbnails/thumb_image.jpg").
  thumbnail_url: string;         // Publicly accessible URL for the thumbnail image from Supabase Storage.
  display_order: number;         // Integer used for sorting photos within a gallery or category.
  is_featured: boolean;          // Boolean flag to indicate if the photo is marked as featured.
  metadata: Record<string, any>; // JSONB column for storing additional, flexible metadata (e.g., camera settings, location).
  created_at: string;            // ISO string representation of the creation timestamp.
  updated_at: string;            // ISO string representation of the last update timestamp.

  // Optional property for joined data when fetching photos with their categories.
  // This is not a direct column in the 'photos' table but represents related data.
  category?: Category | null;    // The associated Category object, if joined.
}

/**
 * Represents a Photo object that is guaranteed to include its associated Category information.
 * Useful for contexts where the category data is always expected to be present with the photo.
 * Extends the base `Photo` type.
 */
export interface PhotoWithCategory extends Photo {
  category: Category | null; // Overrides `category?` from `Photo` to be non-optional, though still potentially null if no category is linked.
                           // Consider if `Category` should be non-nullable if a photo *must* have a category.
}

// --- Form and API Payload Types ---

/**
 * Defines the expected structure for creating a new photo.
 * Used for form data validation or as a DTO for API requests.
 * All fields required for a new photo record in the database are included.
 */
export interface CreatePhotoInput {
  title: string;
  description?: string | null; // Optional description.
  category_id?: string | null; // Optional category ID.
  filename: string;
  file_size: number;
  width: number;
  height: number;
  storage_path: string;
  public_url: string;
  thumbnail_path: string;
  thumbnail_url: string;
  display_order?: number;      // Optional, defaults in DB.
  is_featured?: boolean;       // Optional, defaults in DB.
  metadata?: Record<string, any>; // Optional, defaults in DB.
}

/**
 * Defines the expected structure for updating an existing photo.
 * Used for form data validation or as a DTO for API requests.
 * All fields are optional, as updates are typically partial.
 */
export interface UpdatePhotoInput {
  title?: string;
  description?: string | null;
  category_id?: string | null;
  display_order?: number;
  is_featured?: boolean;
  metadata?: Record<string, any>;
  // Note: Fields like filename, file_size, storage_path, public_url, etc., are typically not updated directly.
  // Changing an image file would involve deleting the old one and creating a new record or a more complex replacement process.
}

// Could add more specific types as needed, for example:
// export type ImageMimeType = 'image/jpeg' | 'image/png' | 'image/webp';
