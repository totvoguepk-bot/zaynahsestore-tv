import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

import ThemeStyleRegistry from '@/components/common/ThemeStyleRegistry';
import { getSettings } from '@/lib/services/settings';
import Pixels from '@/components/Pixels';
import ChunkErrorListener from '@/components/common/ChunkErrorListener';

const getFaviconType = (url: string) => {
  const lower = url.toLowerCase();
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.svg')) return 'image/svg+xml';
  if (lower.includes('.webp')) return 'image/webp';
  if (lower.includes('.gif')) return 'image/gif';
  if (lower.includes('.jpg') || lower.includes('.jpeg')) return 'image/jpeg';
  return 'image/x-icon';
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    const siteUrl = settings.storeUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.totvogue.pk';

    const storeName = settings.storeName || 'TotVogue';
    const suffix = settings.meta_title_suffix || '';
    const title = settings.metaTitle || storeName;
    const description = settings.metaDescription || settings.tagline || `Welcome to ${storeName}. Premium quality products delivered to your doorstep. Order via WhatsApp.`;

    const timestamp = settings.updatedAt ? new Date(settings.updatedAt).getTime() : Date.now();
    const fav = settings.faviconUrl 
      ? `${settings.faviconUrl}?v=${timestamp}` 
      : settings.logoUrl 
        ? `${settings.logoUrl}?v=${timestamp}` 
        : "/favicon.ico";
    return {
      metadataBase: new URL(siteUrl),
      title: {
        default: settings.metaTitle || (storeName + suffix),
        template: `%s${suffix}`
      },
      description: description,
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: title,
      },
      icons: {
        icon: [
          {
            url: fav,
            type: getFaviconType(fav),
          },
          {
            url: settings.faviconUrl 
              ? `${settings.faviconUrl}?v=${timestamp}` 
              : '/default-favicon/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            url: settings.faviconUrl 
              ? `${settings.faviconUrl}?v=${timestamp}` 
              : '/default-favicon/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          }
        ],
        shortcut: fav,
        apple: settings.logoUrl 
          ? `${settings.logoUrl}?v=${timestamp}` 
          : settings.faviconUrl 
            ? `${settings.faviconUrl}?v=${timestamp}` 
            : '/default-favicon/apple-touch-icon.png',
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION || '',
      },
      openGraph: {
        type: 'website',
        title: title + suffix,
        description: description,
        images: [{ url: '/og-default.jpg' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: title + suffix,
        description: description,
        images: ['/og-default.jpg'],
        creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '',
      }
    };
  } catch (err) {
    return {
      title: "Zaynahs E-Store",
      description: "Modern Pakistani E-Commerce — Premium Mobile Shop",
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Zaynahs E-Store",
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION || '',
      }
    };
  }
}

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${outfit.variable} h-full antialiased overflow-x-clip`}
    >
      <head>
        <ThemeStyleRegistry settings={settings} />
      </head>
      <body suppressHydrationWarning className={`${jakarta.variable} ${outfit.variable} font-body min-h-full flex flex-col bg-gray-50 dark:bg-[#0f0f1b] text-gray-900 dark:text-gray-100 overflow-x-clip`}>
        {/* Conditional Script Injection for Tracking Pixels */}
        <Pixels />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ChunkErrorListener />
          {children}
          <Toaster 
            position="bottom-center" 
            toastOptions={{
              className: 'dark:bg-[#16162a] dark:text-white dark:border-gray-800 rounded-2xl shadow-lg border border-gray-100 font-semibold',
              style: {
                fontSize: '11px',
                padding: '10px 14px',
                maxWidth: '300px',
                marginBottom: '72px',
              }
            }} 
            closeButton 
          />
          
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(){
                  var p = window.location.pathname;
                  var m = p.startsWith('/admin') ? '/admin-manifest.json' : '/manifest.json';
                  var el = document.createElement('link');
                  el.rel = 'manifest';
                  el.href = m;
                  document.head.appendChild(el);
                })();
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var i = 0; i < registrations.length; i++) {
                      registrations[i].unregister();
                      console.log('Service Worker unregistered to prevent stale cache & WebView bugs.');
                    }
                  });
                }
              `,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
