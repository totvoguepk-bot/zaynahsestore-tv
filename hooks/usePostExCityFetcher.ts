'use client';

import { useState, useEffect, useCallback } from 'react';
import { StoreSettings } from '@/lib/types';

export function usePostExCityFetcher(settings: StoreSettings | null) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCities = useCallback(async () => {
    setLoading(true);
    try {
      const token = settings?.postex_api_token;
      const res = await fetch('/api/courier/postex/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiToken: token || '' }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.cities)) {
        setCities(data.cities);
      }
    } catch {}
    setLoading(false);
  }, [settings?.postex_api_token]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return { cities, loading, refetch: fetchCities };
}
