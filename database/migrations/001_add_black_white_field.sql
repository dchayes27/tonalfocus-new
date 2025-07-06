-- Add is_black_white field to photos table
ALTER TABLE photos ADD COLUMN is_black_white BOOLEAN DEFAULT FALSE;

-- Create index for better performance when grouping
CREATE INDEX idx_photos_is_black_white ON photos(is_black_white);

-- Update existing photos based on category (if using Black & White category)
UPDATE photos 
SET is_black_white = TRUE 
WHERE category_id IN (
  SELECT id FROM categories WHERE slug = 'black-white'
);
