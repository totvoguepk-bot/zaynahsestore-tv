import { NextResponse } from 'next/server';
import { pingIndexNow } from '@/lib/indexNow';

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: 'Missing or invalid urls array' }, { status: 400 });
    }

    const success = await pingIndexNow(urls);

    if (!success) {
      return NextResponse.json({ error: 'IndexNow ping failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[IndexNow API] Ping failed:', error);
    return NextResponse.json({ error: error.message || 'Ping failed' }, { status: 500 });
  }
}
