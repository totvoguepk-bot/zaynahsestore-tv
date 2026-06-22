/**
 * Smart Image Compressor — Universal Format Support
 *
 * Strategy (in order — tries each until one succeeds):
 * 1. createImageBitmap(file)         — Fastest. Handles JPEG/PNG/WebP/GIF + HEIC on macOS/iOS
 * 2. ObjectURL → <img> → bitmap      — Uses OS-level decoder. Works for HEIC on macOS Chrome
 * 3. heic2any → bitmap (HEIC only)   — Pure WASM fallback for HEIC on Windows/Linux Chrome
 *
 * Output: .webp file, same aspect ratio, compressed under maxKb.
 * On failure: throws a user-visible Error (shown as toast in UI).
 */

// ─── Canvas WebP compression ──────────────────────────────────────────────────

async function compressBitmapToWebP(
  source: ImageBitmap | HTMLImageElement,
  baseName: string,
  maxKb: number
): Promise<File> {
  const MAX_DIM = 1200;

  const srcW = source instanceof ImageBitmap ? source.width : source.naturalWidth;
  const srcH = source instanceof ImageBitmap ? source.height : source.naturalHeight;

  // Scale-down if needed (keeps aspect ratio)
  let targetW = srcW;
  let targetH = srcH;
  if (targetW > MAX_DIM || targetH > MAX_DIM) {
    if (targetW >= targetH) {
      targetH = Math.round((targetH * MAX_DIM) / targetW);
      targetW = MAX_DIM;
    } else {
      targetW = Math.round((targetW * MAX_DIM) / targetH);
      targetH = MAX_DIM;
    }
  }

  // Draw to canvas
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source as CanvasImageSource, 0, 0, targetW, targetH);

  // Free GPU memory if ImageBitmap
  if (source instanceof ImageBitmap) source.close();

  const toBlob = (q: number): Promise<Blob | null> =>
    new Promise((res) => canvas.toBlob((b) => res(b), 'image/webp', q));

  // Iterative quality reduction, then resolution reduction
  const qualities = [0.88, 0.75, 0.62, 0.50, 0.38, 0.26, 0.15];
  let cW = targetW;
  let cH = targetH;

  for (let pass = 0; pass < 14; pass++) {
    const quality = qualities[Math.min(pass, qualities.length - 1)];

    // Every 4 passes, also shrink resolution by 75%
    if (pass > 0 && pass % 4 === 0) {
      cW = Math.max(80, Math.round(cW * 0.75));
      cH = Math.max(80, Math.round(cH * 0.75));

      // Re-draw at smaller size (use a temp canvas to avoid self-draw)
      const tmp = document.createElement('canvas');
      tmp.width = cW;
      tmp.height = cH;
      tmp.getContext('2d')!.drawImage(canvas, 0, 0, cW, cH);
      canvas.width = cW;
      canvas.height = cH;
      ctx.drawImage(tmp, 0, 0);
    }

    const blob = await toBlob(quality);
    if (!blob) break;

    if (blob.size / 1024 <= maxKb) {
      const name = baseName.replace(/[^a-z0-9_\-]/gi, '_');
      return new File([blob], `${name}.webp`, { type: 'image/webp', lastModified: Date.now() });
    }
  }

  // Absolute last resort — still return valid WebP
  const last = await toBlob(0.10);
  const name = baseName.replace(/[^a-z0-9_\-]/gi, '_');
  return new File([last ?? new Blob()], `${name}.webp`, { type: 'image/webp', lastModified: Date.now() });
}

// ─── Load helpers ────────────────────────────────────────────────────────────

/** Load any Blob/File via ObjectURL + <img>. Uses OS-native decoder — works for HEIC on macOS/iOS. */
function loadViaImg(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Browser cannot decode this image format'));
    };
    img.src = url;
  });
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function compressImage(file: File, maxKb: number = 50): Promise<File> {
  if (typeof window === 'undefined') return file;

  const baseName = file.name.replace(/\.[^/.]+$/, '');

  // ── Strategy 1: createImageBitmap(file) ─────────────────────────────────
  // Native browser decode — works for JPEG/PNG/WebP/GIF + HEIC on some platforms
  try {
    const bitmap = await createImageBitmap(file);
    console.log('[compressImage] Strategy 1 (createImageBitmap) succeeded');
    return await compressBitmapToWebP(bitmap, baseName, maxKb);
  } catch {
    // continue
  }

  // ── Strategy 2: ObjectURL → <img> ────────────────────────────────────────
  // Uses OS-level image decoder (works for HEIC on macOS Chrome, Safari)
  try {
    const img = await loadViaImg(file);
    console.log('[compressImage] Strategy 2 (ObjectURL → img) succeeded');
    return await compressBitmapToWebP(img, baseName, maxKb);
  } catch {
    // continue
  }

  // ── Strategy 3: heic2any (HEIC/HEIF only) ────────────────────────────────
  // Pure WASM fallback for HEIC on Windows/Linux where OS codec is unavailable
  const isHeic =
    /\.(heic|heif)$/i.test(file.name) ||
    file.type === 'image/heic' ||
    file.type === 'image/heif';

  if (isHeic) {
    try {
      const { default: heic2any } = await import('heic2any');
      const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
      const jpegBlob = Array.isArray(converted) ? converted[0] : converted;
      const img = await loadViaImg(jpegBlob);
      console.log('[compressImage] Strategy 3 (heic2any) succeeded');
      return await compressBitmapToWebP(img, baseName, maxKb);
    } catch (err) {
      console.warn('[compressImage] All strategies failed for HEIC:', err);
      throw new Error(
        'Could not convert HEIC photo. On your iPhone: open the photo → tap Share → ' +
        '"Save as JPEG" or use "Files" app → Share → Save Image → then upload.'
      );
    }
  }

  // ── All strategies failed (non-HEIC) ─────────────────────────────────────
  throw new Error(
    `Cannot process "${file.name}". Please use JPEG, PNG, or WebP format.`
  );
}
