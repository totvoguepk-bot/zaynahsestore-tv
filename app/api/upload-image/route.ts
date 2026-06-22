/**
 * POST /api/upload-image
 *
 * Server-side image upload with Sharp conversion.
 * Accepts any format (including HEIC/HEIF) and outputs WebP under 50KB.
 * Uses Sharp (libvips) for native HEIC decoding — works where browser WASM fails.
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const MAX_KB = 50;
const MAX_DIM = 1200;

export async function POST(request: NextRequest) {
  // Initialize inside handler so env vars are read at runtime, not at build time
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';
    const type = formData.get('type') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Bypass Sharp for videos and upload raw buffer directly
    const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|avi|mkv|ogv)$/i.test(file.name);
    if (isVideo) {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9_\-]/gi, '_');
      const ext = file.name.split('.').pop() || 'mp4';
      const fileName = `${folder}/${baseName}_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(fileName, inputBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error('[api/upload-image] Supabase video upload failed:', uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      const { data } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(fileName);

      const finalSizeKb = Math.round(inputBuffer.length / 1024);
      console.log(`[api/upload-image] ✓ Video: ${file.name} → ${fileName} (${finalSizeKb} KB)`);

      return NextResponse.json({
        url: data.publicUrl,
        sizeKb: finalSizeKb,
        format: ext,
      });
    }

    // Process with Sharp — supports HEIC/HEIF natively via libvips
    let sharpInstance = sharp(inputBuffer, { failOnError: false });

    // Get metadata for dimension checks
    const meta = await sharpInstance.metadata();
    const origW = meta.width ?? 800;
    const origH = meta.height ?? 800;

    // Compute target dimensions
    const isFavicon = type === 'favicon';
    const targetMaxDim = isFavicon ? 128 : MAX_DIM;
    let targetW = origW;
    let targetH = origH;
    if (targetW > targetMaxDim || targetH > targetMaxDim) {
      if (targetW >= targetH) {
        targetH = Math.round((targetH * targetMaxDim) / targetW);
        targetW = targetMaxDim;
      } else {
        targetW = Math.round((targetW * targetMaxDim) / targetH);
        targetH = targetMaxDim;
      }
    }

    // Re-initialize sharp for the actual conversion
    sharpInstance = sharp(inputBuffer, { failOnError: false });

    // Iterative quality reduction to hit < MAX_KB
    let quality = 85;
    let outputBuffer: Buffer | null = null;
    const outputFormat = isFavicon ? 'png' : 'webp';

    for (let pass = 0; pass < 8; pass++) {
      // Every 3 passes, also reduce resolution
      const passW = pass >= 3 ? Math.max(isFavicon ? 16 : 80, Math.round(targetW * Math.pow(0.8, pass - 2))) : targetW;
      const passH = pass >= 3 ? Math.max(isFavicon ? 16 : 80, Math.round(targetH * Math.pow(0.8, pass - 2))) : targetH;

      let pipe = sharp(inputBuffer, { failOnError: false })
        .rotate() // auto-rotate from EXIF
        .resize(passW, passH, { fit: 'inside', withoutEnlargement: true });

      const buf = isFavicon 
        ? await pipe.png({ compressionLevel: 9 }).toBuffer()
        : await pipe.webp({ quality, effort: 4 }).toBuffer();

      outputBuffer = buf;

      if (buf.length / 1024 <= MAX_KB) {
        break;
      }

      quality = Math.max(10, quality - 12);
    }

    if (!outputBuffer) {
      return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }

    // Generate file path
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9_\-]/gi, '_');
    const fileName = `${folder}/${baseName}_${Date.now()}.${outputFormat}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(fileName, outputBuffer, {
        contentType: isFavicon ? 'image/png' : 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      console.error('[api/upload-image] Supabase upload failed:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const finalSizeKb = Math.round(outputBuffer.length / 1024);
    console.log(`[api/upload-image] ✓ ${file.name} → ${fileName} (${finalSizeKb} KB)`);

    return NextResponse.json({
      url: data.publicUrl,
      sizeKb: finalSizeKb,
      format: outputFormat,
    });
  } catch (err) {
    console.error('[api/upload-image] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
