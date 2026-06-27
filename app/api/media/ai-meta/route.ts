import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getAISettings } from '@/lib/aiEngine';
import { routeVision, extractKeys } from '@/lib/ai/router';

export async function POST(request: Request) {
  try {
    const { image_url, media_id } = await request.json();

    if (!image_url || !media_id) {
      return NextResponse.json({ error: 'Missing image_url or media_id' }, { status: 400 });
    }

    console.log(`[AI Media Meta] Running vision analysis on ${image_url} for media ID ${media_id}`);

    const settings = await getAISettings();
    const keys = extractKeys(settings);

    const systemPrompt = `You are an expert Image SEO optimizer. Analyze the provided image and generate relevant SEO tags. Return ONLY a valid JSON object matching the requested schema. Do not include markdown code block wrappers or extra text.`;
    const userPrompt = `Analyze this image and return ONLY this JSON schema:
{
  "alt_text": "Highly descriptive, SEO-friendly ALT text focusing on clothing attributes, material, and color.",
  "seo_filename": "hyphen-separated-lowercase-filename.webp",
  "title": "Clean, descriptive title for the image.",
  "description": "A 100-150 words detailed description of what is visible in the image.",
  "caption": "A short, engaging caption for the image."
}`;

    const result = await routeVision(userPrompt, systemPrompt, image_url, keys.vision);

    let cleanJson = result.result.trim();
    if (cleanJson.includes('```json')) cleanJson = cleanJson.split('```json')[1].split('```')[0].trim();
    else if (cleanJson.includes('```')) cleanJson = cleanJson.split('```')[1].split('```')[0].trim();
    const meta = JSON.parse(cleanJson);

    const { error: updateError } = await supabaseAdmin
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
      .eq('id', media_id);

    if (updateError) {
      console.error('[AI Media Meta] DB Update Error:', updateError);
      return NextResponse.json({ error: 'Failed to update media library metadata in database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: meta, provider: result.provider, model: result.model });
  } catch (error: any) {
    console.error('[AI Media Meta] Vision analysis failed:', error);
    return NextResponse.json({ error: error.message || 'Vision analysis process failed' }, { status: 500 });
  }
}
