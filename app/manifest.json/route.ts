import { getSettings } from '@/lib/services/settings';

export const revalidate = 0; // Serve dynamically to ensure dynamic branding updates

export async function GET() {
  try {
    const settings = await getSettings();
    const brandName = settings.storeName || 'TotVogue.pk';
    const description = settings.metaDescription || settings.tagline || `${brandName} - Kids Clothes Online Pakistan`;

    // Use custom uploaded favicon/logo or fallback to default PWA icons
    const faviconUrl = settings.faviconUrl || settings.logoUrl || '/default-favicon/android-chrome-192x192.png';
    const logoUrl = settings.logoUrl || settings.faviconUrl || '/default-favicon/android-chrome-512x512.png';

    const manifestData = {
      name: `${brandName} - Kids Clothes Online Pakistan`,
      short_name: brandName,
      description: description,
      start_url: '/',
      display: 'standalone',
      background_color: '#1a1a2e',
      theme_color: '#1a1a2e',
      orientation: 'portrait',
      icons: [
        {
          src: faviconUrl,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: logoUrl,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    };

    return new Response(JSON.stringify(manifestData), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Failed to generate dynamic manifest:', error);
    return new Response(JSON.stringify({}), { status: 500 });
  }
}
