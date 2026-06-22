'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export interface TrashedMedia {
  id: string;
  original_filename: string | null;
  seo_filename: string | null;
  file_url: string;
  alt_text: string | null;
  title: string | null;
  description: string | null;
  caption: string | null;
  bucket: string | null;
  file_size: number | null;
  mime_type: string | null;
  deleted_at: string | null;
  created_at: string;
}

export const getDeletedMedia = async (): Promise<TrashedMedia[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('[media] getDeletedMedia failed:', error);
    throw error;
  }
};

export const restoreMedia = async (id: string): Promise<void> => {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('media_library')
      .update({ deleted_at: null })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('[media] restoreMedia failed:', error);
    throw error;
  }
};

export const hardDeleteMedia = async (id: string, url: string): Promise<void> => {
  try {
    const supabase = await createClient();
    
    // 1. Delete from database
    const { error: dbError } = await supabase
      .from('media_library')
      .delete()
      .eq('id', id);
    if (dbError) throw dbError;

    // 2. Delete from Supabase storage bucket
    const filename = url.split('/').pop();
    if (filename) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('product-images')
        .remove([filename]);
      if (storageError) {
        console.warn('[media] Storage file failed to delete during hardDeleteMedia:', storageError);
      }
    }
  } catch (error) {
    console.error('[media] hardDeleteMedia failed:', error);
    throw error;
  }
};
