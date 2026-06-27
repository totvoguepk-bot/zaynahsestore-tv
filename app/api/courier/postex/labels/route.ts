import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

const POSTEX_HOST = 'https://api.postex.pk';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cns = searchParams.get('cns') || '';

  const trackingNumbers = cns.split(',').filter(Boolean);
  if (trackingNumbers.length === 0) {
    return new NextResponse('No tracking numbers provided', { status: 400 });
  }

  const { data: s } = await supabaseAdmin
    .from('store_settings')
    .select('postex_api_token, postex_mode')
    .single();

  const token = s?.postex_api_token;
  if (!token) {
    return NextResponse.json({ success: false, error: 'PostEx not configured' }, { status: 200 });
  }

  const baseUrl = s?.postex_mode === 'production' ? POSTEX_HOST : 'https://staging-api.postex.pk';

  const res = await fetch(
    `${baseUrl}/services/reporting/api/report/integration/airway-bill`,
    {
      method: 'POST',
      headers: {
        token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingNumbers),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    return NextResponse.json({ success: false, error: `PostEx label API error (${res.status}): ${errText}` }, { status: 200 });
  }

  const data = await res.json();

  const ok = data.statusCode === 200 || data.statusCode === '200' || data.statusCode === '0200';
  if (!ok || !data.dist) {
    return NextResponse.json({
      success: false,
      error: data.statusMessage || data.message || 'Label generation failed',
      details: data,
    }, { status: 200 });
  }

  const b64 = data.dist;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="postex-labels-${Date.now()}.pdf"`,
      'Content-Length': String(bytes.length),
    },
  });
}
