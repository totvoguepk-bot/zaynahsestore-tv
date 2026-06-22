import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { generateImageMeta } from '@/lib/aiEngine';

export async function POST(request: Request) {
  try {
    const { image_url, media_id } = await request.json();

    if (!image_url || !media_id) {
      return NextResponse.json({ error: 'Missing image_url or media_id' }, { status: 400 });
    }

    console.log(`[AI Media Meta] Running vision analysis on ${image_url} for media ID ${media_id}`);

    // Call vision helper
    const meta = await generateImageMeta(image_url);

    // Update media_library table
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

    return NextResponse.json({ success: true, data: meta });
  } catch (error: any) {
    console.error('[AI Media Meta] Vision analysis failed:', error);
    return NextResponse.json({ error: error.message || 'Vision analysis process failed' }, { status: 500 });
  }
}
