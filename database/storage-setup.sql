-- Supabase Storage Bucket Setup
-- Run this after creating the main database schema

-- IMPORTANT: Storage buckets must be created manually in the Supabase Dashboard
-- Follow these steps:

-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Storage section
-- 3. Create two buckets:
--    - Name: 'photos' (Public bucket)
--    - Name: 'thumbnails' (Public bucket)

-- 4. After creating buckets, you can set policies via the Dashboard
--    or use the SQL below (may need adjustment based on Supabase version)

-- Example RLS policies for storage (if supported):
-- These allow public read access and authenticated write access

/*
-- For 'photos' bucket
INSERT INTO storage.policies (bucket_id, name, definition, mode, check_expression)
VALUES 
  ('photos', 'Public read access', 'true'::jsonb, 'SELECT', NULL),
  ('photos', 'Authenticated users can upload', 'true'::jsonb, 'INSERT', '(auth.role() = ''authenticated'')'),
  ('photos', 'Authenticated users can update', 'true'::jsonb, 'UPDATE', '(auth.role() = ''authenticated'')'),
  ('photos', 'Authenticated users can delete', 'true'::jsonb, 'DELETE', '(auth.role() = ''authenticated'')');

-- For 'thumbnails' bucket  
INSERT INTO storage.policies (bucket_id, name, definition, mode, check_expression)
VALUES 
  ('thumbnails', 'Public read access', 'true'::jsonb, 'SELECT', NULL),
  ('thumbnails', 'Authenticated users can upload', 'true'::jsonb, 'INSERT', '(auth.role() = ''authenticated'')'),
  ('thumbnails', 'Authenticated users can update', 'true'::jsonb, 'UPDATE', '(auth.role() = ''authenticated'')'),
  ('thumbnails', 'Authenticated users can delete', 'true'::jsonb, 'DELETE', '(auth.role() = ''authenticated'')');
*/

-- Note: Storage policies syntax may vary. Use the Dashboard UI for best results.