import { NextRequest, NextResponse } from 'next/server';
import { deleteAbandonedCart } from '@/lib/services/abandonedCarts';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteAbandonedCart(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
