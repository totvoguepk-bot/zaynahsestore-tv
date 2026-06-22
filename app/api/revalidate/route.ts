import { NextRequest, NextResponse } from 'next/server';
import {
  revalidateProduct,
  revalidateBanner,
  revalidateCategory,
  revalidateHomepage,
  revalidateSettings
} from '@/lib/revalidate';
import { getProductById } from '@/lib/services/products';
import { syncProductToMeta } from '@/lib/meta/syncProduct';

/**
 * POST endpoint for Supabase database update webhooks.
 * Authenticates using x-revalidate-secret header and triggers Next.js and Cloudflare cache revalidation.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify REVALIDATE_SECRET
    const secret = req.headers.get('x-revalidate-secret');
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      console.warn('[Webhook Revalidate] Unauthorized request. Secret token mismatch.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse payload body
    const body = await req.json().catch(() => ({}));
    const { type, table, record, old_record } = body;

    console.log(`[Webhook Revalidate] Received table trigger. Table: ${table}, Type: ${type}`);

    // If deleting, fields are in old_record. Otherwise in record.
    const activeRecord = type === 'DELETE' ? old_record : record;

    if (!activeRecord) {
      return NextResponse.json({ error: 'No record data found in payload' }, { status: 400 });
    }

    // 3. Dispatch to specific revalidation handler
    const childTables = ['product_variants', 'product_images', 'product_modifiers', 'reviews'];

    if (table === 'products') {
      // 🛡️ LOOP GUARD: If the UPDATE only changed meta_sync fields, skip everything.
      // This prevents the infinite loop: meta_sync update → webhook → meta_sync update → ...
      const META_ONLY_COLUMNS = new Set(['meta_sync_status', 'meta_sync_error', 'meta_last_synced_at', 'updated_at']);
      if (type === 'UPDATE' && record && old_record) {
        const changedColumns = Object.keys(record).filter(
          (key) => record[key] !== old_record[key]
        );
        const isMetaOnly = changedColumns.length > 0 && changedColumns.every((col) => META_ONLY_COLUMNS.has(col));
        if (isMetaOnly) {
          console.log('[Webhook Revalidate] Skipping — only meta_sync fields changed, no real product update.');
          return NextResponse.json({ revalidated: false, reason: 'meta_sync_only' });
        }
      }

      const slug = activeRecord.slug;
      if (slug) {
        await revalidateProduct(slug);
      } else {
        console.warn('[Webhook Revalidate] Product update received but slug was missing.');
      }

      // Real-time sync to Meta Catalog
      try {
        if (type === 'DELETE') {
          await syncProductToMeta(activeRecord, 'DELETE');
        } else {
          const fullProduct = await getProductById(activeRecord.id);
          if (fullProduct) {
            await syncProductToMeta(fullProduct, 'UPDATE');
          }
        }
      } catch (metaErr) {
        console.error('[Webhook Revalidate] Meta Catalog Sync failed:', metaErr);
      }
    } else if (childTables.includes(table)) {
      const productId = activeRecord.product_id;
      if (productId) {
        const product = await getProductById(productId);
        if (product && product.slug) {
          await revalidateProduct(product.slug);
          console.log(`[Webhook Revalidate] Revalidated parent product ${product.slug} due to change in table ${table}`);
        } else {
          console.warn(`[Webhook Revalidate] Parent product not found or slug missing for product ID: ${productId}`);
        }
      } else {
        console.warn(`[Webhook Revalidate] Table is ${table} but product_id was missing from activeRecord.`);
      }
    } else if (table === 'banners' || table === 'homepage_sections') {
      await revalidateBanner();
    } else if (table === 'categories') {
      const slug = activeRecord.slug;
      if (slug) {
        await revalidateCategory(slug);
      } else {
        console.warn('[Webhook Revalidate] Category update received but slug was missing.');
      }
    } else if (table === 'store_settings') {
      await revalidateSettings();
    } else {
      console.log(`[Webhook Revalidate] Table ${table} has no specific handler. Revalidating settings completely.`);
      await revalidateSettings();
    }

    return NextResponse.json({ revalidated: true, table, type });
  } catch (error: any) {
    console.error('[Webhook Revalidate] Revalidation endpoint internal error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * GET requests are not allowed.
 */
export async function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
