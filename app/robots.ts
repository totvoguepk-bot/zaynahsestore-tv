import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getSettings } from '@/lib/services/settings';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let siteUrl = '';
  try {
    const settings = await getSettings();
    if (settings?.storeUrl) {
      siteUrl = settings.storeUrl;
    }
  } catch (e) {
    console.warn('Failed to load settings in robots:', e);
  }

  if (!siteUrl) {
    const headersList = await headers();
    const host = headersList.get('host') || 'zaynahs.pk';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    siteUrl = `${protocol}://${host}`;
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/cart',
          '/checkout',
          '/account',
          '/account/',
          '/api',
          '/api/',
        ],
      },
      // Explicitly allow all major AI bots
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
