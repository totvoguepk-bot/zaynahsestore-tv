'use server';

import { syncProductToMeta } from '@/lib/meta/syncProduct';
import { getProductById } from './products';

/**
 * Server action to manually trigger Meta Catalog synchronization for a single product.
 */
export async function triggerMetaSync(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const product = await getProductById(productId);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }
    
    const result = await syncProductToMeta(product, 'UPDATE');
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to synchronize with Meta' };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('[metaSyncAction] triggerMetaSync failed:', error);
    return { success: false, error: error.message || 'Unknown error occurred during manual sync.' };
  }
}
