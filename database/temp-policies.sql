-- Temporary RLS policies for testing
-- Run this in Supabase SQL Editor to allow uploads without authentication

-- Allow anyone to insert photos (TEMPORARY - remove in production!)
CREATE POLICY "Temporary: Allow public inserts" ON photos 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update photos (TEMPORARY - remove in production!)
CREATE POLICY "Temporary: Allow public updates" ON photos 
FOR UPDATE 
USING (true);

-- Allow anyone to delete photos (TEMPORARY - remove in production!)  
CREATE POLICY "Temporary: Allow public deletes" ON photos
FOR DELETE
USING (true);

-- To remove these policies later:
-- DROP POLICY "Temporary: Allow public inserts" ON photos;
-- DROP POLICY "Temporary: Allow public updates" ON photos;
-- DROP POLICY "Temporary: Allow public deletes" ON photos;
