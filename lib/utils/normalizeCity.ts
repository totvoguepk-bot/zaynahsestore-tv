const CITY_ALIASES: Record<string, string> = {
  lhr: 'Lahore',
  lhe: 'Lahore',
  khi: 'Karachi',
  isb: 'Islamabad',
  rwp: 'Rawalpindi',
  fsd: 'Faisalabad',
  pew: 'Peshawar',
  'multan city': 'Multan',
};

function capitalizeWords(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

export function normalizeCity(raw: string): string {
  let city = raw.trim();

  city = city.replace(/,?\s*(?:Pakistan|PK|pk)\s*$/i, '');
  city = city.replace(/\s*,\s*$/, '');
  city = city.trim();

  city = city.toLowerCase();

  if (CITY_ALIASES[city]) {
    return CITY_ALIASES[city];
  }

  const hasVowel = /[aeiou]/.test(city);
  if (city.length < 6 && !hasVowel) return 'Unknown';

  if (city.length < 3 || !/^[a-z\s-]+$/.test(city)) {
    return 'Unknown';
  }

  return capitalizeWords(city);
}
