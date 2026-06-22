import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const allowedAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAuthorized = user && (!allowedAdminEmail || user.email === allowedAdminEmail);

  const bypassRoutes = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];
  const isBypass = bypassRoutes.includes(pathname);

  // Protect all admin routes except login/forgot/reset bypass routes
  if (pathname.startsWith('/admin') && !isBypass) {
    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect logged-in admin away from login page
  if (pathname === '/admin/login' && isAuthorized) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*']
 };
