import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Never cache this route — always returns live settings
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('store_settings')
      .select('*')
      .eq('id', '00000000-0000-4000-8000-000000000001')
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(data || {}, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err) {
    console.error('[api/settings] fetch failed:', err);
    return NextResponse.json({}, { status: 500 });
  }
}
