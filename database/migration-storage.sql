-- Migration: Update photos table for Supabase Storage
-- Run this if you already created the initial schema

-- Add new columns for Supabase Storage
ALTER TABLE photos 
ADD COLUMN IF NOT EXISTS storage_path TEXT,
ADD COLUMN IF NOT EXISTS public_url TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_path TEXT;

-- Update existing columns
ALTER TABLE photos 
ALTER COLUMN cloudinary_url DROP NOT NULL,
ALTER COLUMN thumbnail_url DROP NOT NULL;

-- Or if you want to drop the old columns and use only the new ones:
-- ALTER TABLE photos 
-- DROP COLUMN IF EXISTS cloudinary_url,
-- DROP COLUMN IF EXISTS thumbnail_url;

-- Update any existing rows to have storage paths (if needed)
-- UPDATE photos 
-- SET storage_path = cloudinary_url,
--     public_url = cloudinary_url,
--     thumbnail_path = thumbnail_url,
--     thumbnail_url = thumbnail_url
-- WHERE storage_path IS NULL;
