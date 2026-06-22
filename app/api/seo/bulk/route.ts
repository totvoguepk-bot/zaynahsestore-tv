import { NextResponse } from 'next/server';

interface BulkItem {
  entity_type: 'product' | 'category' | 'page';
  entity_id: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Missing or invalid items array' }, { status: 400 });
    }

    const success: BulkItem[] = [];
    const failed: { item: BulkItem; error: string }[] = [];
    const { origin } = new URL(request.url);
    const siteUrl = origin;

    console.log(`[Bulk SEO] Starting sequential optimization of ${items.length} items`);

    for (const item of items) {
      try {
        const response = await fetch(`${siteUrl}/api/seo/optimize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            entity_type: item.entity_type,
            entity_id: item.entity_id
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          success.push(item);
        } else {
          failed.push({ item, error: data.error || 'Unknown error' });
        }
      } catch (err: any) {
        failed.push({ item, error: err.message || 'Network error' });
      }

      // Safe delay between requests to avoid rate limits
      await sleep(500);
    }

    console.log(`[Bulk SEO] Finished. Success: ${success.length}, Failed: ${failed.length}`);

    return NextResponse.json({
      success: success.length,
      failed: failed.length,
      results: {
        successItems: success,
        failedItems: failed
      }
    });
  } catch (error: any) {
    console.error('[Bulk SEO] Bulk process error:', error);
    return NextResponse.json({ error: error.message || 'Bulk process failed' }, { status: 500 });
  }
}
