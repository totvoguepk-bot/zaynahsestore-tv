export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const resolvedParams = await params;
    const keyParam = resolvedParams.key; // e.g. "123456.txt"
    const expectedKey = process.env.INDEXNOW_API_KEY || '';

    // Check if the requested key matches the verification key format
    const cleanKeyParam = keyParam.replace('.txt', '');

    if (expectedKey && cleanKeyParam === expectedKey) {
      return new Response(expectedKey, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    return new Response('Not Found', { status: 404 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
