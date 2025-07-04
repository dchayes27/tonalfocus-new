import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { 
  uploadImage, 
  createThumbnail, 
  getImageDimensions,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE 
} from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Check authentication (you'll implement this later)
    // For now, we'll allow uploads but you should add auth
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const categoryId = formData.get('category_id') as string | null;
    const isFeatured = formData.get('is_featured') === 'true';
    
    // Validate required fields
    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 }
      );
    }
    // Validate file
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }
    
    // Get image dimensions
    const dimensions = await getImageDimensions(file);
    
    // Upload main image
    const { path: storagePath, publicUrl } = await uploadImage(file);
    
    // Create thumbnail
    const { path: thumbnailPath, publicUrl: thumbnailUrl } = await createThumbnail(file);
    
    // Save to database
    const { data, error } = await supabase
      .from('photos')
      .insert({
        title,
        description,        category_id: categoryId,
        filename: file.name,
        file_size: file.size,
        width: dimensions.width,
        height: dimensions.height,
        storage_path: storagePath,
        public_url: publicUrl,
        thumbnail_path: thumbnailPath,
        thumbnail_url: thumbnailUrl,
        is_featured: isFeatured,
        metadata: {
          originalName: file.name,
          mimeType: file.type,
          uploadedAt: new Date().toISOString()
        }
      })
      .select()
      .single();
      
    if (error) {
      // If database insert fails, try to clean up uploaded files
      // (You might want to handle this more gracefully)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      photo: data 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

// Configure Next.js to handle file uploads
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout