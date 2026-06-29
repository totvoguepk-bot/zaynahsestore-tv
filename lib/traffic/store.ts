// In-memory store for Vercel edge visitor headers
// Resets on server restart — acceptable for live view

interface VisitorEntry {
  city: string;
  country: string;
  lastSeen: number;
}

const visitors = new Map<string, VisitorEntry>();

export function recordVisitor(city: string, country: string) {
  const key = `${city}-${country}`;
  visitors.set(key, { city, country, lastSeen: Date.now() });
}

export function getVisitors(since: number): { city: string; country: string; count: number }[] {
  const now = Date.now();
  const countMap = new Map<string, { city: string; country: string; count: number }>();

  for (const entry of visitors.values()) {
    if (entry.lastSeen < now - since) continue;
    const key = `${entry.city}-${entry.country}`;
    const existing = countMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      countMap.set(key, { city: entry.city, country: entry.country, count: 1 });
    }
  }

  return Array.from(countMap.values()).sort((a, b) => b.count - a.count);
}

export function clearOldEntries() {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [key, entry] of visitors) {
    if (entry.lastSeen < cutoff) visitors.delete(key);
  }
}
