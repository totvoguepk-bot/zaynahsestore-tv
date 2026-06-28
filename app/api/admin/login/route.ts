import { NextResponse } from 'next/server';

function stringToBase64URL(str: string): string {
  const base64url =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const bytes = new TextEncoder().encode(str);
  let result = '';
  let i = 0;
  while (i < bytes.length) {
    if (i + 2 < bytes.length) {
      const a = bytes[i], b = bytes[i + 1], c = bytes[i + 2];
      result +=
        base64url[a >> 2] +
        base64url[((a & 3) << 4) | (b >> 4)] +
        base64url[((b & 15) << 2) | (c >> 6)] +
        base64url[c & 63];
      i += 3;
    } else if (i + 1 < bytes.length) {
      const a = bytes[i], b = bytes[i + 1];
      result +=
        base64url[a >> 2] +
        base64url[((a & 3) << 4) | (b >> 4)] +
        base64url[(b & 15) << 2];
      i += 2;
    } else {
      const a = bytes[i];
      result += base64url[a >> 2] + base64url[(a & 3) << 4];
      i += 1;
    }
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Authenticate via Supabase Auth REST API
    const authRes = await fetch(
      `${supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      }
    );

    const authData = await authRes.json();

    if (!authRes.ok) {
      return NextResponse.json(
        {
          error:
            authData.error_description ||
            authData.error ||
            'Authentication failed',
        },
        { status: 401 }
      );
    }

    const user = authData.user;
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Admin email check
    const allowedAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (allowedAdminEmail && user.email !== allowedAdminEmail) {
      await fetch(`${supabaseUrl}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
          apikey: supabaseAnonKey,
        },
      });
      return NextResponse.json(
        { error: 'Access denied: Not authorized for admin portal.' },
        { status: 403 }
      );
    }

    // Build session object (same shape @supabase/supabase-js expects)
    const session = {
      access_token: authData.access_token,
      token_type: authData.token_type,
      expires_in: authData.expires_in,
      expires_at: authData.expires_at,
      refresh_token: authData.refresh_token,
      user: authData.user,
    };

    const supabaseProjectRef =
      supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1] || '';
    const cookieName = `sb-${supabaseProjectRef}-auth-token`;

    // Encode using @supabase/ssr's expected format: base64-<base64url(json)>
    const encoded = 'base64-' + stringToBase64URL(JSON.stringify(session));

    const response = NextResponse.json({ success: true });
    response.cookies.set(cookieName, encoded, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
