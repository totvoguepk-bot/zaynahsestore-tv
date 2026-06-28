import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  const expectedKey = process.env.INDEXNOW_API_KEY;

  // Debug: check if env var is available and compare
  const debug = {
    keyFromParam: key,
    expectedKeyFirst16: expectedKey?.substring(0, 16) || '(not set)',
    match: key === expectedKey,
    paramLen: key?.length,
    envLen: expectedKey?.length,
    envSet: !!expectedKey,
  };

  if (!expectedKey || key !== expectedKey) {
    return NextResponse.json({ error: 'Not Found', debug }, { status: 404 });
  }

  return new NextResponse(key, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
