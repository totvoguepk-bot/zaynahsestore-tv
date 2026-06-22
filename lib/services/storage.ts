import { createClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/utils/imageCompressor';

/**
 * Upload an image via the server-side Sharp API route (primary).
 * Falls back to client-side WebP conversion if API fails.
 *
 * Server-side handles ALL formats including HEIC/HEIF reliably via libvips.
 */
async function uploadViaServer(file: File, folder: string, type?: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  if (type) {
    formData.append('type', type);
  }

  const res = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Server upload failed: ${res.status}`);
  }

  const data = await res.json();
  return data.url as string;
}

/**
 * Client-side fallback: compress with canvas + upload directly to Supabase.
 * Used if the server API is unavailable.
 */
async function uploadViaClient(file: File, fileName: string): Promise<string> {
  const supabase = createClient();
  const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|avi|mkv|ogv)$/i.test(file.name);
  const rawOrCompressed = isVideo ? file : await compressImage(file, 50);

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, rawOrCompressed, { 
      contentType: file.type || (isVideo ? 'video/mp4' : 'image/webp'),
      upsert: true 
    });

  if (error) throw error;

  const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
  return data.publicUrl;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const uploadProductImage = async (
  file: File,
  productId: string
): Promise<string> => {
  try {
    // Primary: server-side Sharp conversion (supports HEIC natively)
    return await uploadViaServer(file, `products/${productId}`);
  } catch (serverErr) {
    console.warn('[storage] Server upload failed, trying client fallback:', serverErr);
    try {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9_\-]/gi, '_');
      const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|avi|mkv|ogv)$/i.test(file.name);
      const ext = isVideo ? (file.name.split('.').pop() || 'mp4') : 'webp';
      const fileName = `products/${productId}/${baseName}_${Date.now()}.${ext}`;
      return await uploadViaClient(file, fileName);
    } catch (clientErr) {
      console.error('[storage] uploadProductImage failed:', clientErr);
      throw clientErr;
    }
  }
};

export const uploadSettingsImage = async (
  file: File,
  type: 'logo' | 'favicon' | 'banner' | 'exit_intent' | 'size_chart'
): Promise<string> => {
  try {
    // Primary: server-side Sharp conversion
    return await uploadViaServer(file, `settings`, type);
  } catch (serverErr) {
    console.warn('[storage] Server upload failed, trying client fallback:', serverErr);
    try {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9_\-]/gi, '_');
      const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|avi|mkv|ogv)$/i.test(file.name);
      const ext = isVideo ? (file.name.split('.').pop() || 'mp4') : 'webp';
      const fileName = `settings/${type}_${baseName}_${Date.now()}.${ext}`;
      return await uploadViaClient(file, fileName);
    } catch (clientErr) {
      console.error('[storage] uploadSettingsImage failed:', clientErr);
      throw clientErr;
    }
  }
};

export const deleteProductImage = async (url: string): Promise<void> => {
  try {
    const supabase = createClient();
    const path = url.split('/product-images/')[1];
    if (!path) return;
    const { error } = await supabase.storage.from('product-images').remove([path]);
    if (error) throw error;
  } catch (error) {
    console.error('[storage] deleteProductImage failed:', error);
    throw error;
  }
};
