-- Migration: Update photos table for Supabase Storage
-- -----------------------------------------------------------------------------
-- File: migration-storage.sql
-- Description:
-- This script updates an existing 'photos' table to integrate with Supabase Storage.
-- It's intended for projects that initially used a different storage mechanism
-- (e.g., Cloudinary URLs stored in `cloudinary_url` and `thumbnail_url`)
-- and are now migrating to use Supabase for storing photo files and thumbnails.
--
-- Preconditions:
-- 1. An existing 'photos' table created by an earlier version of 'schema.sql'
--    (or a similar schema that needs these storage-related columns).
-- 2. Supabase project is set up.
--
-- Usage:
-- Run this script in your Supabase SQL Editor if you are migrating an older
-- schema. If you are setting up the project for the first time, the main
-- 'schema.sql' should already include these Supabase Storage specific columns.
-- -----------------------------------------------------------------------------

-- Section 1: Add New Columns for Supabase Storage Paths and URLs
-- These columns will store the direct paths within your Supabase Storage buckets
-- and the publicly accessible URLs for the main photos and their thumbnails.
ALTER TABLE photos 
ADD COLUMN IF NOT EXISTS storage_path TEXT,    -- Stores the path to the original image file in Supabase Storage.
ADD COLUMN IF NOT EXISTS public_url TEXT,      -- Stores the publicly accessible URL for the original image.
ADD COLUMN IF NOT EXISTS thumbnail_path TEXT;  -- Stores the path to the thumbnail image file in Supabase Storage.
                                               -- Note: The main `thumbnail_url` column will now store the Supabase thumbnail public URL.

-- Section 2: Modify Existing Columns
-- If your 'photos' table previously stored URLs from another service (e.g., Cloudinary)
-- and these were marked as NOT NULL, this step makes them optional.
-- This allows new records to use Supabase Storage exclusively without needing
-- to populate these old URL fields.
ALTER TABLE photos 
ALTER COLUMN cloudinary_url DROP NOT NULL,  -- Old column for main image URL, now optional.
ALTER COLUMN thumbnail_url DROP NOT NULL;   -- Old column for thumbnail URL, now primarily for Supabase thumbnail URL but made optional if it was previously mandatory for another service.
                                            -- If `thumbnail_url` is being repurposed for Supabase, ensure it's correctly populated.
                                            -- This script assumes `thumbnail_url` will be used for Supabase thumbnail's public URL.

-- Section 3: Optional - Drop Old Cloudinary-Specific Columns (Uncomment if needed)
-- If you no longer need the old `cloudinary_url` (and potentially `thumbnail_url` if it was purely for Cloudinary),
-- you can drop them to clean up the schema.
-- Make sure you have migrated any necessary data from these columns before dropping them.
--
-- ALTER TABLE photos
-- DROP COLUMN IF EXISTS cloudinary_url,
-- DROP COLUMN IF EXISTS thumbnail_url; -- Only drop this if you are certain `thumbnail_url` is not being used for Supabase thumbnail URLs.

-- Section 4: Optional - Data Migration Example (Uncomment and adapt if needed)
-- If you have existing records that used `cloudinary_url` and `thumbnail_url`
-- and you want to populate the new Supabase Storage path columns from them
-- (perhaps as a placeholder or if the paths/URLs are identical, which is unlikely),
-- you could run an update statement.
--
-- IMPORTANT: This is a placeholder example. Actual data migration will likely involve
--            programmatic downloading from the old service and uploading to Supabase Storage,
--            then updating these paths with the new Supabase Storage locations.
--
-- UPDATE photos
-- SET
--     storage_path = cloudinary_url,    -- Example: if cloudinary_url can serve as a temporary storage_path.
--     public_url = cloudinary_url,      -- Example: if cloudinary_url is the public URL.
--     thumbnail_path = thumbnail_url,   -- Example: if thumbnail_url can serve as a temporary thumbnail_path.
--     -- thumbnail_url = thumbnail_url -- This line is redundant if thumbnail_url is already populated.
-- WHERE
--     storage_path IS NULL; -- Apply only to rows that haven't been updated yet.

-- End of migration script
