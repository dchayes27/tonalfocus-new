-- Consolidate color metadata on is_black_white flag
-- Run this after 001_add_black_white_field.sql has been applied.

-- Backfill is_black_white using legacy is_color flag (true = color => false for B&W)
UPDATE photos
SET is_black_white = CASE
  WHEN is_color IS NULL THEN is_black_white
  WHEN is_color = TRUE THEN FALSE
  ELSE TRUE
END
WHERE is_color IS NOT NULL;

-- Remove legacy index and column
DROP INDEX IF EXISTS idx_photos_is_color;
ALTER TABLE photos DROP COLUMN IF EXISTS is_color;
