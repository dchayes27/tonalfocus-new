# Supabase Storage Setup Guide

## Overview
This guide walks you through setting up Supabase Storage for the TonalFocus photography portfolio.

## Step 1: Create Storage Buckets

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket** and create these two buckets:

### Photos Bucket
- **Name:** `photos`
- **Public bucket:** ✅ Yes (toggle on)
- **File size limit:** 10MB
- **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp`

### Thumbnails Bucket
- **Name:** `thumbnails`
- **Public bucket:** ✅ Yes (toggle on)
- **File size limit:** 2MB
- **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp`

## Step 2: Configure Bucket Policies

For each bucket, set up the following RLS policies:

### Public Read Access
- **Operation:** SELECT
- **Policy:** `true` (anyone can view)

### Authenticated Upload/Update/Delete
- **Operations:** INSERT, UPDATE, DELETE
- **Policy:** `auth.role() = 'authenticated'`

## Step 3: Update Environment Variables

Make sure your `.env.local` file has these values from your Supabase project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 4: Test Upload

You can test the upload functionality using the API endpoint:

```bash
curl -X POST http://localhost:3000/api/photos/upload \
  -F "file=@/path/to/image.jpg" \
  -F "title=Test Photo" \
  -F "description=A test upload" \
  -F "category_id=<category-uuid>"
```

## Storage Structure

Photos are organized by year in the storage bucket:
```
photos/
├── 2025/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.jpg
│   └── ...
└── ...

thumbnails/
├── 2025/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.jpg
│   └── ...
└── ...
```

## Next Steps

1. Implement image resizing for thumbnails (currently uploads same image)
2. Add authentication for admin uploads
3. Create admin UI for photo management
4. Add image optimization/transformation

## Troubleshooting

### "Bucket not found" error
- Make sure you created the buckets in the Storage section
- Check that bucket names match exactly: `photos` and `thumbnails`

### "Policy violation" error
- Ensure buckets are set to public
- Check that RLS policies are configured correctly
- For testing, you can temporarily disable RLS on buckets

### Upload fails silently
- Check browser console for errors
- Verify file size is under 10MB
- Ensure file type is JPEG, PNG, or WebP
