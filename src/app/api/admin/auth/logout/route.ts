import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/auth/admin';

export async function POST() {
  clearAdminSession();
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
}
