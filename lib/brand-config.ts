export interface BrandConfig {
  name: string;
  tagline: string;
}

const BRAND_MAP: Record<string, BrandConfig> = {
  'totvogue.pk': {
    name: 'TotVogue',
    tagline: 'Premium Kids Fashion — Trendy Co-ord Sets & Dresses',
  },
  'zaynahs.pk': {
    name: 'Zaynahs E-Store',
    tagline: 'Your Premium Pakistani E-Commerce Store',
  },
};

export function getBrandConfig(hostOrUrl: string): BrandConfig | null {
  let host = hostOrUrl;
  try {
    if (host.startsWith('http')) {
      host = new URL(host).hostname;
    }
  } catch {}

  host = host.replace(/:\d+$/, '').replace(/^www\./, '');

  for (const [domain, config] of Object.entries(BRAND_MAP)) {
    if (host.includes(domain)) {
      return config;
    }
  }

  return null;
}
