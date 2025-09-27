import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import { isAdminAuthenticated } from '@/lib/auth/admin';

// Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();
    const { id } = params;
    
    // If name is being updated, regenerate slug
    if (body.name) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    const { data, error } = await supabase
      .from('categories')
      .update(body)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ category: data });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const supabase = createServiceRoleClient();
    const { id } = params;
    
    // Check if category has photos
    const { count } = await supabase
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);
      
    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with photos. Please reassign photos first.' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
