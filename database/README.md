# Database Setup Guide

## Prerequisites
- Supabase account (free tier is fine)
- Node.js and npm installed

## Setup Steps

### 1. Create Supabase Project
1. Go to https://supabase.com and create a new project
2. Note down your project URL and anon key from the project settings

### 2. Configure Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   DATABASE_URL=your_database_connection_string
   ```

### 3. Run Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `database/schema.sql`
4. Run the SQL to create tables and initial data

### 4. Verify Setup
1. Check that tables are created in Table Editor
2. Verify categories are populated
3. Test the connection in your app

## Database Structure

### Tables
- **categories**: Photography categories (landscape, portrait, etc.)
- **photos**: Main photo records with metadata

### Key Features
- UUID primary keys for scalability
- JSONB metadata field for EXIF data
- Automatic timestamp updates
- Row Level Security enabled
- Indexes for performance

## Next Steps
- Set up Cloudinary for image storage
- Create API routes for photo management
- Build admin interface
