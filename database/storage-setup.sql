-- Supabase Storage Bucket Setup
-- -----------------------------------------------------------------------------
-- File: storage-setup.sql
-- Description:
-- This file provides instructions and example SQL for setting up Supabase Storage
-- buckets and their access policies for the TonalFocus Photography Portfolio.
--
-- IMPORTANT:
-- The primary method for creating and managing storage buckets and their
-- policies in Supabase is through the Supabase Dashboard. The SQL examples
-- provided here for policies are illustrative and may need adjustments based
-- on your Supabase version or specific security requirements. Always refer to
-- the official Supabase documentation for the most current practices.
--
-- Preconditions:
-- 1. A Supabase project has been created.
-- 2. The main database schema (from schema.sql) should ideally be set up first,
--    though bucket creation can technically precede it.
--
-- Usage:
-- Follow the manual steps in the Supabase Dashboard as outlined below.
-- The SQL for policies is optional and provided as an example; using the
-- Dashboard UI for policies is generally recommended for ease of use and reliability.
-- -----------------------------------------------------------------------------

-- Section 1: Manual Bucket Creation (Supabase Dashboard)
-- -----------------------------------------------------
-- Storage buckets must be created manually in your Supabase project's Dashboard.
--
-- Steps:
-- 1. Navigate to your Supabase Project Dashboard.
-- 2. In the left sidebar, click on the 'Storage' icon.
-- 3. Click the '+ New bucket' button.
--
-- 4. Create the 'photos' bucket:
--    - Bucket name: photos
--    - Public bucket: Check this box (to allow public read access for images).
--      If you uncheck this, you'll need more complex RLS policies on `storage.objects`
--      and signed URLs to access images. For a public portfolio, public buckets are common.
--    - Allowed MIME types: (Optional) You can restrict file types here, e.g.,
--      image/jpeg, image/png, image/webp.
--    - File size limit: (Optional) Set a maximum file size for uploads.
--
-- 5. Click '+ New bucket' again.
--
-- 6. Create the 'thumbnails' bucket:
--    - Bucket name: thumbnails
--    - Public bucket: Check this box.
--    - Allowed MIME types: (Optional) e.g., image/jpeg, image/png, image/webp.
--    - File size limit: (Optional) Set a maximum (usually smaller than original photos).
--
-- After creating the buckets, they will appear in your Storage list.

-- Section 2: Storage Access Policies (Recommended: Use Supabase Dashboard UI)
-- --------------------------------------------------------------------------
-- Access policies for storage buckets control who can perform operations like
-- SELECT (read), INSERT (upload), UPDATE, and DELETE on objects within the buckets.
-- These are typically managed via the "Policies" tab for each bucket in the Dashboard.
--
-- The SQL below shows examples of how you might define these policies directly
-- using SQL by inserting into the `storage.policies` table. However, this
-- method can be less intuitive and might change with Supabase versions.
--
-- ALWAYS VERIFY AND TEST POLICIES THOROUGHLY.

/*
-- Example RLS Policies for Storage Buckets (Illustrative SQL)
-- Replace 'bucket_id' with the actual name of your bucket (e.g., 'photos', 'thumbnails').
-- These examples allow:
--   - Public read access (SELECT).
--   - Uploads (INSERT) only for authenticated users.
--   - Updates (UPDATE) only for authenticated users (e.g., if they own the object, more complex policy needed).
--   - Deletes (DELETE) only for authenticated users (e.g., if they own the object, more complex policy needed).

-- For 'photos' bucket:
-- Policy 1: Allow public read access to all files in the 'photos' bucket.
INSERT INTO storage.policies (bucket_id, name, definition, mode, check_expression)
VALUES ('photos', 'Public Read Access', 'true'::jsonb, 'SELECT', NULL);

-- Policy 2: Allow authenticated users to upload files to the 'photos' bucket.
INSERT INTO storage.policies (bucket_id, name, definition, mode, check_expression)
VALUES ('photos', 'Authenticated Upload', 'true'::jsonb, 'INSERT', '(auth.role() = ''authenticated'')');

-- Policy 3: (Example) Allow authenticated users to update their own files.
-- This requires a more complex check, often involving metadata or ownership.
-- A simple version for any authenticated user (use with caution):
-- INSERT INTO storage.policies (bucket_id, name, definition, mode, check_expression)
-- VALUES ('photos', 'Authenticated Update', 'true'::jsonb, 'UPDATE', '(auth.role() = ''authenticated'')');

-- Policy 4: (Example) Allow authenticated users to delete their own files.
-- Similar to update, requires careful consideration of ownership.
-- A simple version for any authenticated user (use with caution):
-- INSERT INTO storage.policies (bucket_id, name, definition, mode, check_expression)
-- VALUES ('photos', 'Authenticated Delete', 'true'::jsonb, 'DELETE', '(auth.role() = ''authenticated'')');


-- For 'thumbnails' bucket (similar policies would typically apply):
INSERT INTO storage.policies (bucket_id, name, definition, mode, check_expression)
VALUES ('thumbnails', 'Public Read Access', 'true'::jsonb, 'SELECT', NULL);

INSERT INTO storage.policies (bucket_id, name, definition, mode, check_expression)
VALUES ('thumbnails', 'Authenticated Upload', 'true'::jsonb, 'INSERT', '(auth.role() = ''authenticated'')');

-- etc. for UPDATE and DELETE if needed for thumbnails.
*/

-- Final Note:
-- The Supabase Dashboard provides a user-friendly interface for managing these policies.
-- It often translates your UI selections into the appropriate SQL policies behind the scenes.
-- Using the Dashboard UI is generally the recommended and safer approach, especially
-- if you are not deeply familiar with Supabase's storage RLS internals.

-- End of storage setup instructions