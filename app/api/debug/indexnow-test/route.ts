import { NextResponse } from 'next/server';

export async function GET() {
  const results: Record<string, any> = {};

  results.env = {
    INDEXNOW_API_KEY_set: !!process.env.INDEXNOW_API_KEY,
    INDEXNOW_API_KEY: process.env.INDEXNOW_API_KEY?.substring(0, 8) + '...',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  };

  try {
    const key = process.env.INDEXNOW_API_KEY || '';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const host = siteUrl.replace(/^https?:\/\//, '').split('/')[0];
    const keyLocation = `${siteUrl}/${key}.txt`;

    results.request = { host, key: key.substring(0, 8) + '...', keyLocation, urlCount: 1 };

    const body = JSON.stringify({
      host,
      key,
      keyLocation,
      urlList: [siteUrl],
    });

    const start = Date.now();
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    });
    const duration = Date.now() - start;
    const responseText = await response.text();

    results.response = {
      ok: response.ok,
      status: response.status,
      body: responseText || '(empty)',
      duration_ms: duration,
    };
  } catch (error: any) {
    results.error = error.message || String(error);
  }

  return NextResponse.json(results);
}
