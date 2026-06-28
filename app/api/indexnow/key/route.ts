import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  const expectedKey = process.env.INDEXNOW_API_KEY;
  const url = request.url;

  console.log('[IndexNow Key] Debug:', { url, key, expectedKey: expectedKey?.substring(0,16)+'...', match: key === expectedKey, keyLen: key?.length, expLen: expectedKey?.length, envSet: !!expectedKey });

  if (!expectedKey || key !== expectedKey) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return new NextResponse(key, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
