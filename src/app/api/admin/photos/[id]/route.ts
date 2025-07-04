import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { deleteImage } from '@/lib/storage';

// Update photo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const supabase = createClient();
    const body = await request.json();
    const { id } = params;
    
    // Update photo
    const { data, error } = await supabase
      .from('photos')
      .update(body)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ photo: data });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}

// Delete photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const supabase = createClient();
    const { id } = params;
    
    // Get photo details first
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('storage_path, thumbnail_path')
      .eq('id', id)
      .single();
      
    if (fetchError || !photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('photos')
      .delete()
      .eq('id', id);
      
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
    
    // Delete files from storage (don't fail if storage delete fails)
    try {
      if (photo.storage_path) {
        await deleteImage(photo.storage_path, 'photos', true);
      }
      if (photo.thumbnail_path) {
        await deleteImage(photo.thumbnail_path, 'thumbnails', true);
      }
    } catch (storageError) {
      console.error('Storage deletion failed:', storageError);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
