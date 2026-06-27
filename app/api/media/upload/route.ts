import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/uploadImage';
import { getAISettings } from '@/lib/aiEngine';
import { routeVision, extractKeys } from '@/lib/ai/router';
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

    // 3. Check if auto vision meta is enabled (gracefully handle missing settings)
    const isVideo = file.type.startsWith('video/') || 
                    ['mp4', 'mov', 'webm', 'ogg'].includes(file.name.split('.').pop()?.toLowerCase() || '');

    let meta: any = null;
    let aiProvider = '';
    try {
      const settings = await getAISettings();
      if (settings.auto_media_ai && !isVideo) {
        console.log(`[Media Upload API] Auto Image AI is active. Analyzing: ${fileUrl}`);
        const keys = extractKeys(settings);

        if (Object.keys(keys.vision).length > 0) {
          const systemPrompt = `You are an expert Image SEO optimizer. Analyze the provided image and generate relevant SEO tags. Return ONLY a valid JSON object matching the requested schema. Do not include markdown code block wrappers or extra text.`;
          const userPrompt = `Analyze this image and return ONLY this JSON schema:
{
  "alt_text": "Highly descriptive, SEO-friendly ALT text focusing on clothing attributes, material, and color.",
  "seo_filename": "hyphen-separated-lowercase-filename.webp",
  "title": "Clean, descriptive title for the image.",
  "description": "A 100-150 words detailed description of what is visible in the image.",
  "caption": "A short, engaging caption for the image."
}`;

          const result = await routeVision(userPrompt, systemPrompt, fileUrl, keys.vision);
          aiProvider = result.provider;

          let cleanJson = result.result.trim();
          if (cleanJson.includes('```json')) cleanJson = cleanJson.split('```json')[1].split('```')[0].trim();
          else if (cleanJson.includes('```')) cleanJson = cleanJson.split('```')[1].split('```')[0].trim();
          meta = JSON.parse(cleanJson);

          if (meta) {
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
            console.log(`[Media Upload API] AI analysis complete via ${result.provider}/${result.model}`);
          }
        } else {
          console.warn('[Media Upload API] Auto vision enabled but no vision API keys configured');
        }
      }
    } catch (aiErr: any) {
      console.error('[Media Upload API] Auto Vision generation failed:', aiErr.message || aiErr);
    }

    return NextResponse.json({
      success: true,
      id: mediaRecord.id,
      url: fileUrl,
      ai_generated: !!meta,
      aiProvider,
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
