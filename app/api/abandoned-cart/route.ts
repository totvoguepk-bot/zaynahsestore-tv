import { NextRequest, NextResponse } from 'next/server';
import { upsertAbandonedCart } from '@/lib/services/abandonedCarts';

/**
 * POST /api/abandoned-cart
 * Called from the client when cart data or checkout contact info changes.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerApartment,
      customerPostalCode,
      items,
      subtotal,
      currency
    } = body;

    if (!sessionId || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Only track if cart has items
    if (items.length === 0) {
      return NextResponse.json({ skipped: true });
    }

    const cart = await upsertAbandonedCart({
      sessionId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerApartment,
      customerPostalCode,
      items,
      subtotal: subtotal ?? 0,
      currency: currency ?? 'PKR',
    });

    return NextResponse.json({ success: true, cartId: cart.id });
  } catch (err: any) {
    console.error('[abandoned-cart] POST failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
