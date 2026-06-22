import { createClient as createBrowserClient } from '@/lib/supabase/client';

/**
 * Validates, compresses, and uploads an image file to Supabase storage, converting it to WebP.
 * Registers metadata in the media_library table and returns the public URL.
 * Supports both client (browser Canvas) and server (Sharp Node.js) execution.
 * 
 * @param file The image File or Blob to upload
 * @param bucket The Supabase Storage bucket name (e.g., 'product-images')
 * @param customName Optional custom filename for Blobs
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (file: File | Blob, bucket: string, customName?: string): Promise<string> => {
  try {
    const isBrowser = typeof window !== 'undefined';
    const supabase = isBrowser 
      ? createBrowserClient() 
      : (await import('@/lib/supabase/admin')).supabaseAdmin;

    // 1. Validate file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'mp4', 'mov', 'webm', 'ogg'];
    let fileExtension = 'webp';
    let originalName = 'image';

    if (file instanceof File) {
      fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      originalName = file.name.replace(/\.[^/.]+$/, '');
    } else if (customName) {
      fileExtension = customName.split('.').pop()?.toLowerCase() || 'webp';
      originalName = customName.replace(/\.[^/.]+$/, '');
    }

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`Invalid file format. Allowed formats: ${allowedExtensions.join(', ')}`);
    }

    // 2. Determine if file is a video
    const isVideo = file.type.startsWith('video/') || ['mp4', 'mov', 'webm', 'ogg'].includes(fileExtension);

    // 3. Convert images to WebP
    let webpFile: File | Blob = file;
    const sanitizedName = originalName
      .replace(/[^a-zA-Z0-9-_\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
    const timestamp = Date.now();

    if (!isVideo) {
      if (isBrowser) {
        // Client-side conversion using imageCompressor fallback chain
        const { compressImage } = await import('@/lib/utils/imageCompressor');
        const fileToCompress = file instanceof File 
          ? file 
          : new File([file], `${sanitizedName}.${fileExtension}`, { type: file.type });
        
        try {
          webpFile = await compressImage(fileToCompress, 50);
          fileExtension = 'webp';
        } catch (err) {
          console.warn('[uploadImage] Client side compression failed, using original:', err);
          webpFile = fileToCompress;
        }
      } else {
        // Server-side conversion using sharp
        try {
          const sharp = (await import('sharp')).default;
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const webpBuffer = await sharp(buffer)
            .webp({ quality: 80 })
            .toBuffer();
          webpFile = new Blob([webpBuffer as any], { type: 'image/webp' });
          fileExtension = 'webp';
        } catch (err) {
          console.warn('[uploadImage] Server side sharp compression failed, using original:', err);
        }
      }
    }

    // 4. Generate filename
    let webpFileName = `${sanitizedName}-${timestamp}.${fileExtension}`;

    // 4. Check if file already exists in bucket
    const { data: existingFiles, error: listError } = await supabase.storage
      .from(bucket)
      .list('', { search: webpFileName });

    if (listError) {
      console.warn('[uploadImage] Error checking file existence, continuing:', listError);
    }

    const exists = existingFiles?.some(f => f.name === webpFileName);
    if (exists) {
      webpFileName = `${sanitizedName}-${timestamp}-2.${fileExtension}`;
    }

    // 5. Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(webpFileName, webpFile, {
        cacheControl: 'public, max-age=31536000',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 6. Get public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(webpFileName);

    if (!data?.publicUrl) {
      throw new Error('Failed to retrieve public URL after upload');
    }

    const fileUrl = data.publicUrl;

    // 7. Save to media_library table
    const { error: dbError } = await supabase
      .from('media_library')
      .insert({
        original_filename: file instanceof File ? file.name : (customName || 'unknown'),
        seo_filename: webpFileName,
        file_url: fileUrl,
        alt_text: originalName.replace(/-/g, ' '),
        title: originalName.replace(/-/g, ' '),
        bucket: bucket,
        ai_generated: false,
        ai_enabled: true,
        file_size: webpFile.size,
        mime_type: webpFile.type || 'image/webp'
      });

    if (dbError) {
      console.warn('[uploadImage] Error saving to media_library table:', dbError);
    }

    return fileUrl;
  } catch (error: any) {
    console.error('[uploadImage] Image upload process failed:', error);
    throw new Error(error.message || 'Image upload failed');
  }
};
