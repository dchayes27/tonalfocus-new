-- Updated TonalFocus Photography Portfolio Database Schema
-- PostgreSQL/Supabase with Supabase Storage

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Photos table (updated for Supabase Storage)
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    filename TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    storage_path TEXT NOT NULL, -- Path in Supabase Storage bucket
    public_url TEXT NOT NULL,    -- Public URL from Supabase Storage
    thumbnail_path TEXT NOT NULL, -- Thumbnail path in storage
    thumbnail_url TEXT NOT NULL,  -- Thumbnail public URL
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_black_white BOOLEAN DEFAULT FALSE, -- TRUE for B&W, FALSE for color
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_photos_category_id ON photos(category_id);
CREATE INDEX idx_photos_display_order ON photos(display_order);
CREATE INDEX idx_photos_is_featured ON photos(is_featured);
CREATE INDEX idx_photos_is_black_white ON photos(is_black_white);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
    ('Landscape', 'landscape', 'Stunning landscape photography', 1),
    ('Portrait', 'portrait', 'Professional portrait photography', 2),
    ('Street', 'street', 'Urban and street photography', 3),
    ('Nature', 'nature', 'Wildlife and nature photography', 4),
    ('Black & White', 'black-white', 'Monochrome photography', 5),
    ('Abstract', 'abstract', 'Abstract and conceptual photography', 6);

-- Enable RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view photos" ON photos FOR SELECT USING (true);

-- Storage bucket setup (run in Supabase Dashboard under Storage)
-- 1. Create a bucket named 'photos' with public access
-- 2. Create a bucket named 'thumbnails' with public access
