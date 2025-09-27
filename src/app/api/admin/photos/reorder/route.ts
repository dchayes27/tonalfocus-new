import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { triggerRevalidation } from '@/lib/revalidate';

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const supabase = createServiceRoleClient();
    const { photoIds } = await request.json();
    
    if (!Array.isArray(photoIds)) {
      return NextResponse.json(
        { error: 'photoIds must be an array' },
        { status: 400 }
      );
    }
    
    // Update display_order for each photo
    const updates = photoIds.map((id, index) => ({
      id,
      display_order: index
    }));
    
    // Batch update
    for (const update of updates) {
      const { error } = await supabase
        .from('photos')
        .update({ display_order: update.display_order })
        .eq('id', update.id);
        
      if (error) {
        console.error(`Failed to update photo ${update.id}:`, error);
      }
    }
    
    triggerRevalidation();

    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reorder photos' },
      { status: 500 }
    );
  }
}
