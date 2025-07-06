-- Temporary RLS policies for testing
-- -----------------------------------------------------------------------------
-- File: temp-policies.sql
-- Description:
-- This script defines TEMPORARY and INSECURE Row Level Security (RLS) policies
-- for the 'photos' table. These policies grant public write access (INSERT,
-- UPDATE, DELETE) to the 'photos' table.
--
-- !!! WARNING !!!
-- THESE POLICIES ARE FOR DEVELOPMENT AND TESTING PURPOSES ONLY.
-- DO NOT USE THEM IN A PRODUCTION ENVIRONMENT as they allow anyone to modify
-- or delete photo data.
--
-- In a production environment, you should have strict RLS policies that,
-- for example, only allow authenticated admin users to perform write operations.
--
-- Usage:
-- Run this script in your Supabase SQL Editor during development if you need
-- to temporarily bypass authentication for photo uploads or modifications.
-- REMEMBER TO REMOVE OR REPLACE THESE POLICIES BEFORE GOING TO PRODUCTION.
-- -----------------------------------------------------------------------------

-- Policy 1: Allow anyone to insert new records into the 'photos' table.
-- WARNING: TEMPORARY - REMOVE IN PRODUCTION!
CREATE POLICY "Temporary: Allow public inserts on photos" ON photos
    FOR INSERT -- Applies to INSERT operations.
    WITH CHECK (true); -- The condition 'true' means any insert is allowed.

-- Policy 2: Allow anyone to update existing records in the 'photos' table.
-- WARNING: TEMPORARY - REMOVE IN PRODUCTION!
CREATE POLICY "Temporary: Allow public updates on photos" ON photos
    FOR UPDATE -- Applies to UPDATE operations.
    USING (true) -- The condition 'true' means any row can be updated.
    WITH CHECK (true); -- The condition 'true' means any update is allowed.

-- Policy 3: Allow anyone to delete records from the 'photos' table.
-- WARNING: TEMPORARY - REMOVE IN PRODUCTION!
CREATE POLICY "Temporary: Allow public deletes on photos" ON photos
    FOR DELETE -- Applies to DELETE operations.
    USING (true); -- The condition 'true' means any row can be deleted.

-- -----------------------------------------------------------------------------
-- How to Remove These Temporary Policies:
-- -----------------------------------------------------------------------------
-- When you are ready to implement proper, secure RLS policies, or before
-- deploying to production, you MUST remove these temporary policies.
-- Uncomment and run the following commands in your Supabase SQL Editor:
/*
DROP POLICY IF EXISTS "Temporary: Allow public inserts on photos" ON photos;
DROP POLICY IF EXISTS "Temporary: Allow public updates on photos" ON photos;
DROP POLICY IF EXISTS "Temporary: Allow public deletes on photos" ON photos;

-- After dropping, ensure you have appropriate secure policies in place.
-- For example, only allowing authenticated users with a specific role (e.g., 'admin')
-- to perform write operations. Example (conceptual):
--
-- CREATE POLICY "Admins can manage photos" ON photos
--     FOR ALL -- Covers INSERT, SELECT, UPDATE, DELETE
--     USING (auth.role() = 'admin') -- Or check against a user ID column for ownership
--     WITH CHECK (auth.role() = 'admin');
*/
-- -----------------------------------------------------------------------------

-- End of temporary policies script
