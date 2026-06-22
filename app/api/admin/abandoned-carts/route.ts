import { NextResponse } from 'next/server';
import { getAllAbandonedCarts } from '@/lib/services/abandonedCarts';

export async function GET() {
  try {
    const carts = await getAllAbandonedCarts();
    return NextResponse.json({ carts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
