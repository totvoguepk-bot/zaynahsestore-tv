import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  const url = request.url;
  const expectedKey = process.env.INDEXNOW_API_KEY;

  if (!expectedKey || key !== expectedKey) {
    return NextResponse.json({
      error: 'Not Found',
      debug: {
        keyFromParam: key,
        keyFromUrl: new URL(url).searchParams.get('key'),
        url: url,
        envFirst16: expectedKey?.substring(0, 16) || '(not set)',
        match: key === expectedKey,
        paramLen: key?.length,
        envLen: expectedKey?.length,
        envSet: !!expectedKey,
      }
    }, { status: 404 });
  }

  return new NextResponse(key, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
