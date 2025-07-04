-- Add is_color field to photos table
ALTER TABLE photos 
ADD COLUMN is_color BOOLEAN DEFAULT true;

-- Add index for faster filtering
CREATE INDEX idx_photos_is_color ON photos(is_color);

-- Update existing photos (optional - can be done later)
-- UPDATE photos SET is_color = true WHERE is_color IS NULL;
