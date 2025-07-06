// Test database connectivity
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Try a simple query
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .single();
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database query failed',
        error: error.message,
        code: error.code,
        details: error.details,
      }, { status: 500 });
    }
    
    return NextResponse.json({
      status: 'ok',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to database',
      error: err.message,
    }, { status: 500 });
  }
}
