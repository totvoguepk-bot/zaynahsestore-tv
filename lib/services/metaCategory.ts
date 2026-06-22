'use server';

import { createClient } from '@/lib/supabase/server';
import { MetaCategoryMapping } from '@/lib/types';
import { revalidateTag } from 'next/cache';

/**
 * Retrieves all category mappings from storefront categories to standard Meta categories.
 */
export async function getMetaCategoryMappings(): Promise<MetaCategoryMapping[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('meta_category_mapping')
      .select('*, categories:store_category_id(*)');

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      storeCategoryId: row.store_category_id,
      metaCategory: row.meta_category,
      createdAt: row.created_at,
      category: row.categories ? {
        id: row.categories.id,
        name: row.categories.name,
        slug: row.categories.slug,
        description: row.categories.description || undefined,
        imageUrl: row.categories.image_url || undefined,
        sortOrder: row.categories.sort_order || 0,
        active: row.categories.active ?? true,
        createdAt: row.categories.created_at,
        updatedAt: row.categories.updated_at
      } : undefined
    }));
  } catch (error) {
    console.error('[metaCategory] getMetaCategoryMappings failed:', error);
    throw error;
  }
}

/**
 * Upserts a category mapping record.
 */
export async function upsertMetaCategoryMapping(
  storeCategoryId: string,
  metaCategory: string
): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('meta_category_mapping')
      .upsert(
        { store_category_id: storeCategoryId, meta_category: metaCategory },
        { onConflict: 'store_category_id' }
      );

    if (error) throw error;
    (revalidateTag as any)('meta-category-mappings');
  } catch (error) {
    console.error('[metaCategory] upsertMetaCategoryMapping failed:', error);
    throw error;
  }
}
