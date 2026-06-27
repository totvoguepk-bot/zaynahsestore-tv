import { NextRequest, NextResponse } from 'next/server';

// Always use production API for token validation (get-merchant-address, get-order-types)
// — matches Zaynahs Courier Manger behaviour exactly (postexApi.ts always uses POSTEX_HOST = 'https://api.postex.pk')
// Mode only affects create-order in the dispatch route, not token validation.
const POSTEX_BASE = 'https://api.postex.pk/services/integration/api';

function headers(token: string) {
  return {
    token,
    'Content-Type': 'application/json',
  };
}

/** Extract addresses array from PostEx API response — handles both `dist` and `data` field names */
function extractAddresses(body: any): any[] | null {
  if (Array.isArray(body.dist) && body.dist.length > 0) return body.dist;
  if (Array.isArray(body.data) && body.data.length > 0) return body.data;
  // Single address object wrapped in an envelope
  if (body.dist && typeof body.dist === 'object' && body.dist.addressCode) return [body.dist];
  if (body.data && typeof body.data === 'object' && body.data.addressCode) return [body.data];
  return null;
}

/** Extract string array from PostEx list endpoint */
function extractList(body: any): string[] | null {
  if (Array.isArray(body.dist)) return body.dist;
  if (Array.isArray(body.data)) return body.data;
  return null;
}

/** Check whether PostEx response indicates success */
function isSuccess(body: any): boolean {
  const code = body.statusCode;
  return code === 200 || code === '200' || code === '0200';
}

export async function POST(req: NextRequest) {
  try {
    const { apiToken } = await req.json();

    if (!apiToken) {
      return NextResponse.json({ success: false, error: 'API token is required' }, { status: 400 });
    }

    // Fetch merchant addresses (always production API — matches Zaynahs project behaviour)
    const addrRes = await fetch(`${POSTEX_BASE}/order/v1/get-merchant-address`, {
      method: 'GET',
      headers: headers(apiToken),
    });

    const addrData = await addrRes.json();

    if (!isSuccess(addrData) && !extractAddresses(addrData)) {
      return NextResponse.json({
        success: false,
        error: addrData.statusMessage || addrData.message || addrData.error || 'Invalid token or API error',
        details: addrData,
      }, { status: 200 });
    }

    const addresses = extractAddresses(addrData);

    if (!addresses) {
      return NextResponse.json({
        success: false,
        error: addrData.statusMessage || addrData.message || 'No addresses returned — token may be invalid',
        details: addrData,
      }, { status: 200 });
    }

    // Try to fetch order types
    let orderTypes: string[] = [];
    try {
      const typesRes = await fetch(`${POSTEX_BASE}/order/v1/get-order-types`, {
        method: 'GET',
        headers: headers(apiToken),
      });
      const typesData = await typesRes.json();
      const list = extractList(typesData);
      if (list) orderTypes = list;
    } catch {
      // Order types are optional
    }

    return NextResponse.json({
      success: true,
      addresses,
      orderTypes,
      message: addrData.statusMessage || addrData.message || 'Token valid',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Could not reach PostEx API',
    }, { status: 200 });
  }
}
