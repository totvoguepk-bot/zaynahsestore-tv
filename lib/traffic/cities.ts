export const KNOWN_CITIES: Record<string, { lat: number; lng: number }> = {
  Lahore: { lat: 31.5497, lng: 74.3436 },
  Karachi: { lat: 24.8607, lng: 67.0011 },
  Islamabad: { lat: 33.6844, lng: 73.0479 },
  Faisalabad: { lat: 31.4504, lng: 73.135 },
  Rawalpindi: { lat: 33.5651, lng: 73.0169 },
  Peshawar: { lat: 34.0151, lng: 71.5249 },
  Multan: { lat: 30.1575, lng: 71.5249 },
  Quetta: { lat: 30.2, lng: 67.0 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  Riyadh: { lat: 24.7136, lng: 46.6753 },
  London: { lat: 51.5074, lng: -0.1278 },
};

export function getCityCoords(city: string): { lat: number; lng: number } | null {
  if (KNOWN_CITIES[city]) return KNOWN_CITIES[city];
  const lower = city.toLowerCase();
  for (const [name, coords] of Object.entries(KNOWN_CITIES)) {
    if (name.toLowerCase() === lower) return coords;
  }
  return null;
}
