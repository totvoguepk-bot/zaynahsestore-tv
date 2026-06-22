import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/uploadImage';
import { getAISettings, generateImageMeta } from '@/lib/aiEngine';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'product-images';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log(`[Media Upload API] Processing file: ${file.name}, size: ${file.size} bytes`);

    // 1. Process upload and convert to WebP
    const fileUrl = await uploadImage(file, bucket);

    // 2. Fetch media library record to get its ID
    const { data: mediaRecord, error: fetchError } = await supabaseAdmin
      .from('media_library')
      .select('*')
      .eq('file_url', fileUrl)
      .single();

    if (fetchError || !mediaRecord) {
      console.warn('[Media Upload API] Uploaded URL not found in media_library record:', fetchError);
      return NextResponse.json({ url: fileUrl, success: true });
    }

    // 3. Check if auto vision meta is enabled
    const settings = await getAISettings();
    const isVideo = file.type.startsWith('video/') || 
                    ['mp4', 'mov', 'webm', 'ogg'].includes(file.name.split('.').pop()?.toLowerCase() || '');

    let meta: any = null;
    if (settings.auto_media_ai && !isVideo) {
      try {
        console.log(`[Media Upload API] Auto Image AI is active. Analyzing: ${fileUrl}`);
        meta = await generateImageMeta(fileUrl);

        // Update database record
        await supabaseAdmin
          .from('media_library')
          .update({
            alt_text: meta.alt_text,
            seo_filename: meta.seo_filename,
            title: meta.title,
            description: meta.description,
            caption: meta.caption,
            ai_generated: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', mediaRecord.id);
      } catch (aiErr: any) {
        console.error('[Media Upload API] Auto Vision generation failed:', aiErr.message || aiErr);
      }
    }

    return NextResponse.json({
      success: true,
      id: mediaRecord.id,
      url: fileUrl,
      meta: meta || {
        alt_text: mediaRecord.alt_text,
        seo_filename: mediaRecord.seo_filename,
        title: mediaRecord.title,
        description: mediaRecord.description,
        caption: mediaRecord.caption,
      }
    });
  } catch (error: any) {
    console.error('[Media Upload API] Upload failed:', error);
    return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
