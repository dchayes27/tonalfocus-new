import { NextRequest, NextResponse } from 'next/server';
import { triggerRevalidation } from '@/lib/revalidate';

export async function POST(request: NextRequest) {
  let body: any = null;

  try {
    body = await request.json();
  } catch (error) {
    // Swallow JSON parse errors for empty bodies.
  }

  const token =
    request.headers.get('x-revalidate-token') ||
    (typeof body?.secret === 'string' ? body.secret : null);

  if (!process.env.REVALIDATE_SECRET) {
    console.warn('REVALIDATE_SECRET is not configured. Skipping revalidation.');
    return NextResponse.json({ skipped: true }, { status: 500 });
  }

  if (!token || token !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const paths = Array.isArray(body?.paths) ? body.paths : undefined;

  triggerRevalidation(paths);

  return NextResponse.json({ revalidated: true, paths: paths ?? undefined });
}
