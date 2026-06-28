import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { pathname, searchParams } = request.nextUrl;

  // Catch password reset code on root path and redirect to admin reset page
  if (pathname === '/' && searchParams.get('code')) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/reset-password';
    return NextResponse.redirect(url);
  }

  // Public admin paths — no auth required
  const isPublicAdminPath =
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/admin/forgot-password') ||
    pathname.startsWith('/admin/reset-password');

  if (isPublicAdminPath) {
    return supabaseResponse;
  }

  // Only protect /admin/* routes
  if (pathname.startsWith('/admin/')) {
    // Debug: log auth cookie status
    const allCookieNames = request.cookies.getAll().map((c) => c.name);
    const authCookieName = allCookieNames.find(
      (n) => n.startsWith('sb-') && n.endsWith('-auth-token')
    );
    if (authCookieName) {
      const authCookie = request.cookies.get(authCookieName);
      console.log(
        `[proxy] Auth cookie found: ${authCookieName} (length: ${authCookie?.value?.length || 0})`
      );
    } else {
      console.log(
        `[proxy] No auth cookie found. Available cookies: ${allCookieNames.join(', ') || '(none)'}`
      );
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log(`[proxy] getUser() error: ${error.message}`);
    }

    if (!data?.user) {
      console.log('[proxy] No user — redirecting to /admin/login');
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Cloudflare cache override for admin pages
  supabaseResponse.headers.set(
    'cdn-cache-control',
    'no-cache, no-store, must-revalidate'
  );

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*', '/'],
};
