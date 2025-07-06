-- Updated TonalFocus Photography Portfolio Database Schema
-- -----------------------------------------------------------------------------
-- File: schema.sql
-- Description:
-- This script defines the database schema for the TonalFocus Photography Portfolio.
-- It includes table definitions for categories and photos, relationships,
-- indexes, triggers for updating timestamps, default data insertion, and
-- basic Row Level Security (RLS) policies.
-- This schema is designed for PostgreSQL and is compatible with Supabase.
--
-- Usage:
-- Run this script in your Supabase SQL Editor or using a PostgreSQL client
-- connected to your Supabase database to set up the initial database structure.
-- -----------------------------------------------------------------------------

-- Section 1: Enable Extensions
-- Enable the 'uuid-ossp' extension if not already enabled.
-- This extension provides functions to generate UUIDs, used for primary keys.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Section 2: Categories Table
-- Stores different categories for organizing photos (e.g., Landscape, Portrait).
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique identifier for the category.
    name TEXT NOT NULL,                             -- Human-readable name of the category (e.g., "Landscape Photography").
    slug TEXT NOT NULL UNIQUE,                      -- URL-friendly slug for the category (e.g., "landscape-photography"). Must be unique.
    description TEXT,                               -- Optional description of the category.
    display_order INTEGER DEFAULT 0,                -- Integer to control the display order of categories in UI. Lower numbers typically appear first.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the category was created.
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- Timestamp of when the category was last updated.
);

-- Section 3: Photos Table
-- Stores information about each photo, including metadata and Supabase Storage details.
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique identifier for the photo.
    title TEXT NOT NULL,                            -- Title of the photo.
    description TEXT,                               -- Optional description or caption for the photo.
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL, -- Foreign key linking to the 'categories' table. If a category is deleted, this field becomes NULL.
    filename TEXT NOT NULL,                         -- Original filename of the uploaded image.
    file_size BIGINT NOT NULL,                      -- Size of the original image file in bytes.
    width INTEGER NOT NULL,                         -- Width of the original image in pixels.
    height INTEGER NOT NULL,                        -- Height of the original image in pixels.
    storage_path TEXT NOT NULL,                     -- Path to the original image file within the Supabase Storage bucket (e.g., "public/photos/image.jpg").
    public_url TEXT NOT NULL,                       -- Publicly accessible URL for the original image from Supabase Storage.
    thumbnail_path TEXT NOT NULL,                   -- Path to the thumbnail image file within the Supabase Storage bucket (e.g., "public/thumbnails/thumb_image.jpg").
    thumbnail_url TEXT NOT NULL,                    -- Publicly accessible URL for the thumbnail image from Supabase Storage.
    display_order INTEGER DEFAULT 0,                -- Integer to control the display order of photos within a category or gallery.
    is_featured BOOLEAN DEFAULT FALSE,              -- Boolean flag to mark a photo as featured (e.g., for homepage display).
    metadata JSONB DEFAULT '{}',                    -- JSONB column to store additional, flexible metadata (e.g., camera settings, location). Defaults to an empty JSON object.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the photo record was created.
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- Timestamp of when the photo record was last updated.
);

-- Section 4: Create Indexes
-- Indexes improve query performance on frequently searched or sorted columns.
CREATE INDEX idx_photos_category_id ON photos(category_id);     -- Index on photo's category ID for faster filtering by category.
CREATE INDEX idx_photos_display_order ON photos(display_order); -- Index for sorting photos by display order.
CREATE INDEX idx_photos_is_featured ON photos(is_featured);     -- Index for quickly finding featured photos.
CREATE INDEX idx_categories_slug ON categories(slug);           -- Index on category slug for efficient lookups by slug.

-- Section 5: Trigger Function for `updated_at`
-- This PostgreSQL function automatically updates the `updated_at` column
-- of a row to the current timestamp whenever the row is modified.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP; -- Set the `updated_at` field of the NEW (modified) row.
    RETURN NEW;                         -- Return the modified row to be inserted/updated.
END;
$$ language 'plpgsql';

-- Section 6: Create Triggers for `updated_at`
-- Apply the `update_updated_at_column` function as a trigger to the
-- 'categories' and 'photos' tables. It fires before any UPDATE operation on a row.
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at
    BEFORE UPDATE ON photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Section 7: Insert Default Categories
-- Populate the 'categories' table with some initial data.
INSERT INTO categories (name, slug, description, display_order) VALUES
    ('Landscape', 'landscape', 'Stunning landscape photography', 1),
    ('Portrait', 'portrait', 'Professional portrait photography', 2),
    ('Street', 'street', 'Urban and street photography', 3),
    ('Nature', 'nature', 'Wildlife and nature photography', 4),
    ('Black & White', 'black-white', 'Monochrome photography', 5),
    ('Abstract', 'abstract', 'Abstract and conceptual photography', 6);

-- Section 8: Enable Row Level Security (RLS)
-- RLS is a PostgreSQL feature that allows fine-grained control over data access.
-- It's crucial for security in Supabase.
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Section 9: Define Default RLS Policies
-- These policies grant public read access to the 'categories' and 'photos' tables.
-- More specific policies for write operations (INSERT, UPDATE, DELETE) should be
-- added based on authentication and user roles (e.g., only authenticated admins can write).
CREATE POLICY "Public can view categories" ON categories
    FOR SELECT -- Applies to SELECT operations.
    USING (true); -- Allows access if the condition (true) is met for any row.

CREATE POLICY "Public can view photos" ON photos
    FOR SELECT
    USING (true);

-- Section 10: Important Note on Supabase Storage Bucket Setup
-- The actual storage buckets ('photos', 'thumbnails') need to be created manually
-- via the Supabase Dashboard (Storage section).
-- 1. Create a bucket named 'photos'. Ensure it's marked as a Public bucket if images are to be publicly accessible.
-- 2. Create a bucket named 'thumbnails'. Ensure it's also marked as a Public bucket.
-- RLS policies for storage buckets are also typically managed via the Dashboard,
-- or can be defined using `storage.objects` table policies if needed (refer to Supabase docs).

-- End of schema definition
