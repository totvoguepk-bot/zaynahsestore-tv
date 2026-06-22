import { NextRequest, NextResponse } from 'next/server';
import { markCartAsOrdered } from '@/lib/services/abandonedCarts';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, orderId } = await req.json();
    if (!sessionId || !orderId) {
      return NextResponse.json({ error: 'Missing sessionId or orderId' }, { status: 400 });
    }
    await markCartAsOrdered(sessionId, orderId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[abandoned-cart/mark-ordered] failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
