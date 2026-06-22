import { getSettings } from '@/lib/services/settings';
import fs from 'fs';
import path from 'path';

export const revalidate = 0; // Serve dynamically to ensure immediate updates

export async function GET() {
  try {
    const settings = await getSettings();
    const faviconUrl = settings.faviconUrl || settings.logoUrl;
    
    if (faviconUrl) {
      const res = await fetch(faviconUrl);
      if (res.ok) {
        const contentType = res.headers.get('content-type') || 'image/x-icon';
        const buffer = await res.arrayBuffer();
        return new Response(buffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
      }
    }
  } catch (e) {
    console.error('Failed to serve dynamic favicon:', e);
  }

  // Fallback to local default-favicon.ico from filesystem instead of 404
  try {
    const filePath = path.join(process.cwd(), 'public', 'default-favicon', 'favicon.ico');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      return new Response(data, {
        headers: {
          'Content-Type': 'image/x-icon',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
  } catch (fsErr) {
    console.error('Failed to read fallback favicon:', fsErr);
  }

  // Final fallback
  return new Response('', { status: 404 });
}
