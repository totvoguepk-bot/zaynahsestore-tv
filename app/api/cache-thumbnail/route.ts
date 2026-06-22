import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const MAX_KB = 50;
const MAX_DIM = 1200;

async function getInstagramThumbnail(code: string): Promise<string> {
  const embedUrl = `https://www.instagram.com/p/${code}/embed/`;
  const res = await fetch(embedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch Instagram embed page');
  const html = await res.text();
  
  // Scrape class EmbeddedMediaImage
  const imgRegex = /class="EmbeddedMediaImage"[^>]*src="([^"]+)"/;
  const match = html.match(imgRegex);
  if (match && match[1]) {
    return match[1].replace(/&amp;/g, '&');
  }
  
  // Fallback to display_url
  const jsonRegex = /"display_url":"([^"]+)"/;
  const jsonMatch = html.match(jsonRegex);
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1].replace(/\\u0026/g, '&');
  }
  
  throw new Error('Could not find thumbnail URL in Instagram embed HTML');
}

export async function POST(request: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    const { imageUrl, videoUrl, folder = 'social' } = await request.json();

    let targetImageUrl = imageUrl;

    if (videoUrl) {
      const cleanUrl = videoUrl.trim();
      
      // 1. YouTube
      const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/ ]{11})/);
      if (ytMatch && ytMatch[1]) {
        targetImageUrl = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      }
      
      // 2. TikTok
      else if (cleanUrl.includes('tiktok.com')) {
        const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`;
        const oembedRes = await fetch(oembedUrl);
        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          if (oembedData && oembedData.thumbnail_url) {
            targetImageUrl = oembedData.thumbnail_url;
          }
        }
      }
      
      // 3. Vimeo
      else if (cleanUrl.includes('vimeo.com')) {
        const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(cleanUrl)}`;
        const oembedRes = await fetch(oembedUrl);
        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          if (oembedData && oembedData.thumbnail_url) {
            targetImageUrl = oembedData.thumbnail_url;
          }
        }
      }
      
      // 4. Instagram
      else if (cleanUrl.includes('instagram.com')) {
        const igMatch = cleanUrl.match(/(?:instagram\.com\/(?:[a-zA-Z0-9_\.]+\/)?(?:p|reel)\/)([^"&?\/ ]+)/);
        const code = igMatch ? igMatch[1] : null;
        if (code) {
          try {
            targetImageUrl = await getInstagramThumbnail(code);
          } catch (e) {
            console.error('Failed to scrape Instagram embed thumbnail:', e);
          }
        }
      }
    }

    if (!targetImageUrl) {
      const lowerUrl = (videoUrl || '').toLowerCase();
      if (lowerUrl.includes('instagram.com') || lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
        return NextResponse.json({
          error: 'Instagram & Facebook require manual thumbnail selection/upload due to Meta API restrictions.'
        }, { status: 400 });
      }
      return NextResponse.json({ error: 'Could not resolve thumbnail image URL' }, { status: 400 });
    }

    // Fetch the target image
    console.log(`[api/cache-thumbnail] Fetching image: ${targetImageUrl}`);
    const fetchResponse = await fetch(targetImageUrl);
    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch image: ${fetchResponse.statusText}`);
    }

    const arrayBuffer = await fetchResponse.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Process with Sharp
    let sharpInstance = sharp(inputBuffer, { failOnError: false });

    // Get metadata for dimension checks
    const meta = await sharpInstance.metadata();
    const origW = meta.width ?? 800;
    const origH = meta.height ?? 800;

    // Compute target dimensions
    let targetW = origW;
    let targetH = origH;
    if (targetW > MAX_DIM || targetH > MAX_DIM) {
      if (targetW >= targetH) {
        targetH = Math.round((targetH * MAX_DIM) / targetW);
        targetW = MAX_DIM;
      } else {
        targetW = Math.round((targetW * MAX_DIM) / targetH);
        targetH = MAX_DIM;
      }
    }

    // Iterative quality reduction to hit < MAX_KB
    let quality = 85;
    let outputBuffer: Buffer | null = null;

    for (let pass = 0; pass < 8; pass++) {
      const passW = pass >= 3 ? Math.max(80, Math.round(targetW * Math.pow(0.8, pass - 2))) : targetW;
      const passH = pass >= 3 ? Math.max(80, Math.round(targetH * Math.pow(0.8, pass - 2))) : targetH;

      const buf = await sharp(inputBuffer, { failOnError: false })
        .rotate()
        .resize(passW, passH, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality, effort: 4 })
        .toBuffer();

      outputBuffer = buf;

      if (buf.length / 1024 <= MAX_KB) {
        break;
      }

      quality = Math.max(10, quality - 12);
    }

    if (!outputBuffer) {
      return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }

    // Generate unique file path
    const hash = Math.random().toString(36).substring(2, 10);
    const fileName = `${folder}/cached_thumb_${Date.now()}_${hash}.webp`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(fileName, outputBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      console.error('[api/cache-thumbnail] Supabase upload failed:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const finalSizeKb = Math.round(outputBuffer.length / 1024);
    console.log(`[api/cache-thumbnail] ✓ Cached thumbnail: ${fileName} (${finalSizeKb} KB)`);

    return NextResponse.json({
      url: data.publicUrl,
      sizeKb: finalSizeKb,
    });
  } catch (err) {
    console.error('[api/cache-thumbnail] Error caching thumbnail:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Caching failed' },
      { status: 500 }
    );
  }
}
