import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

const POSTEX_BASE = 'https://api.postex.pk/services/integration/api';

// Hardcoded PostEx-approved city spellings — guaranteed to work
const FALLBACK_CITIES: string[] = [
  'ABBOTTABAD', 'AHMEDPUR EAST', 'ARIFWALA', 'ATTOCK', 'BADIN',
  'BAHAWALNAGAR', 'BAHAWALPUR', 'BANNU', 'BATTAGRAM', 'BHAKKAR',
  'BHAWALPUR', 'BUREWALA', 'CHAKWAL', 'CHARSADDA', 'CHICHAWATNI',
  'CHINIOT', 'CHISHTIAN', 'CHITRAL', 'CHUNIAN', 'DADU',
  'DASKA', 'DEPALPUR', 'DERA GHAZI KHAN', 'DERA ISMAIL KHAN', 'FAISALABAD',
  'FATEH JANG', 'FORT ABBAS', 'GOJRA', 'GUJAR KHAN', 'GUJRANWALA',
  'GUJRAT', 'HARIPUR', 'HUB', 'HYDERABAD', 'ISLAMABAD',
  'JACOBABAD', 'JAHANIAN', 'JAMPUR', 'JHANG', 'JHELUM',
  'KABIRWALA', 'KAMALIA', 'KAMOKE', 'KARACHI', 'KARAK',
  'KAROR LAL EASAN', 'KASUR', 'KHAIRPUR', 'KHANEWAL', 'KHANPUR',
  'KHARIAN', 'KHUSHAB', 'KOHAT', 'KOT ADDU', 'KOTLI',
  'LAHORE', 'LAKKI MARWAT', 'LARKANA', 'LAYYAH', 'LODHRAN',
  'LORALAI', 'MAILSI', 'MANDI BAHAUDDIN', 'MANSEHRA', 'MARDAN',
  'MIAN CHANNU', 'MIANWALI', 'MINCHNABAD', 'MINGORA', 'MIRPUR',
  'MIRPUR KHAS', 'MULTAN', 'MUZAFFARABAD', 'MUZAFFARGARH', 'NANKANA SAHIB',
  'NAROWAL', 'NAWABSHAH', 'NOWSHERA', 'OKARA', 'PAKPATTAN',
  'PESHAWAR', 'PHALIA', 'QASBA GUJRAT', 'QUETTA', 'RAHIM YAR KHAN',
  'RAJANPUR', 'RAWALPINDI', 'RENALA KHURD', 'SADIQABAD', 'SAHIWAL',
  'SAMBRIAL', 'SANGHAR', 'SARGODHA', 'SHAHDADPUR', 'SHAHDRAPUR',
  'SHAKARGARH', 'SHEIKHUPURA', 'SHIKARPUR', 'SHORKOT', 'SHUJABAD',
  'SIALKOT', 'SIBI', 'SILANWALI', 'SUKKUR', 'SWAT',
  'TAXILA', 'TIMARGARA', 'TOBA TEK SINGH', 'TURBAT', 'UMERKOT',
  'VEHARI', 'WAH CANTT', 'WAZIRABAD',
];

async function fetchPostexCities(token: string, baseUrl: string): Promise<string[]> {
  const endpoints = [
    `${baseUrl}/order/v2/get-operational-city?operationalCityType=delivery`,
    `${baseUrl}/order/v2/get-operational-city?operationalCityType=Delivery`,
    `${baseUrl}/order/v2/get-operational-city?operationalCityType=pickup`,
    `${baseUrl}/order/v2/get-operational-city`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { token, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (Array.isArray(data.dist) && data.dist.length > 0) {
        const names = data.dist
          .map((c: any) => {
            const name = c.operationalCityName || c.cityName || '';
            return typeof name === 'string' ? name.trim().toUpperCase() : '';
          })
          .filter(Boolean);
        if (names.length > 0) return names;
      }
    } catch {}
  }
  return [];
}

export async function POST(req: NextRequest) {
  try {
    const { apiToken } = await req.json();

    if (apiToken) {
      const liveCities = await fetchPostexCities(apiToken, POSTEX_BASE);
      if (liveCities.length > 0) {
        const merged = Array.from(new Set([...liveCities, ...FALLBACK_CITIES])).sort();
        return NextResponse.json({ success: true, cities: merged, source: 'api' });
      }
    }
    return NextResponse.json({ success: true, cities: FALLBACK_CITIES, source: 'fallback' });
  } catch (err: any) {
    return NextResponse.json({ success: true, cities: FALLBACK_CITIES, source: 'fallback' });
  }
}

export async function GET() {
  // Guest access — only return fallback list (no token required)
  return NextResponse.json({ success: true, cities: FALLBACK_CITIES, source: 'fallback' });
}
