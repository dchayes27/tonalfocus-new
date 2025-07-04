import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    
    // Get query parameters
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured') === 'true';

    // Build query
    let query = supabase
      .from('photos')
      .select(`
        *,
        category:categories(*)
      `)
      .order('display_order', { ascending: true })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (category) {
      query = query.eq('categories.slug', category);
    }
    
    if (featured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      photos: data || [],
      pagination: {
        limit,
        offset,
        hasMore: data?.length === limit
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
