'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Globe, ChevronRight } from '@/components/common/Icons';
import TrafficGlobe from './TrafficGlobe';
import { KNOWN_CITIES } from '@/lib/traffic/cities';

interface TrafficData {
  liveCount: number;
  totalVisitors: number;
  totalPageviews: number;
  countries: { code: string; name: string; visitors: number; percent: number }[];
  cities: { city: string; country: string; visitors: number }[];
  orderCities: { city: string; country: string; orders: number; revenue: number }[];
}

const typeColors: Record<string, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-red-500',
};

function getCountryFlag(code: string): string {
  if (!code || code.length !== 2) return '';
  return code
    .toUpperCase()
    .split('')
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join('');
}

export default function TrafficPanel() {
  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [range, setRange] = useState<string>('24h');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/traffic?range=${range}`);
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchData();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Pusher real-time subscription (optional)
    let pusher: any = null;
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (pusherKey && pusherCluster && typeof window !== 'undefined') {
      import('pusher-js').then(({ default: Pusher }) => {
        pusher = new Pusher(pusherKey, { cluster: pusherCluster });
        const channel = pusher.subscribe('traffic-channel');
        channel.bind('traffic-update', (incoming: any) => {
          setData((prev) => prev ? { ...prev, liveCount: incoming.liveCount, totalVisitors: incoming.totalVisitors, totalPageviews: incoming.totalPageviews } : prev);
          setLastUpdated(new Date());
        });
      });
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (pusher) {
        pusher.unsubscribe('traffic-channel');
        pusher.disconnect();
      }
    };
  }, [fetchData]);

  const visitorDotMap = new Map<string, number>();
  if (data) {
    for (const c of data.cities) {
      const coords = KNOWN_CITIES[c.city];
      if (coords) {
        visitorDotMap.set(c.city, (visitorDotMap.get(c.city) || 0) + c.visitors);
      }
    }
  }

  const visitorDots = Array.from(visitorDotMap.entries()).map(([city, count]) => {
    const coords = KNOWN_CITIES[city];
    return { city, lat: coords.lat, lng: coords.lng, count };
  });

  const orderDotMap = new Map<string, number>();
  if (data) {
    for (const oc of data.orderCities) {
      const coords = KNOWN_CITIES[oc.city];
      if (coords) {
        orderDotMap.set(oc.city, (orderDotMap.get(oc.city) || 0) + oc.orders);
      }
    }
  }

  const orderDots = Array.from(orderDotMap.entries()).map(([city, count]) => {
    const coords = KNOWN_CITIES[city];
    return { city, lat: coords.lat, lng: coords.lng, count };
  });

  const topCountry = data?.countries?.[0];

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-black text-gray-900 dark:text-white">Live Traffic</h3>
        </div>
        <div className="flex items-center gap-3">
          {!error && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ~{Math.max(0, data?.liveCount ?? 0)} online
            </span>
          )}
          {error && (
            <span className="text-[11px] font-bold text-amber-500">API unavailable</span>
          )}
          <select
            value={range}
            onChange={e => { setRange(e.target.value); setLoading(true); }}
            className="text-[11px] font-bold bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg px-2 py-1 focus:outline-none text-gray-600 dark:text-gray-300 cursor-pointer"
          >
            <option value="1h">1h</option>
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-5 pb-4">
        <div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Visitors</span>
          <span className="text-lg font-black text-gray-950 dark:text-white block mt-0.5">{data?.totalVisitors ?? 0}</span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Pageviews</span>
          <span className="text-lg font-black text-gray-950 dark:text-white block mt-0.5">{data?.totalPageviews ?? 0}</span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Top Country</span>
          {topCountry ? (
            <span className="text-base font-black text-gray-950 dark:text-white block mt-0.5">
              {getCountryFlag(topCountry.code)} {topCountry.code} {topCountry.percent}%
            </span>
          ) : (
            <span className="text-sm font-bold text-gray-400 block mt-0.5">—</span>
          )}
        </div>
      </div>

      {/* Globe */}
      <TrafficGlobe visitorDots={visitorDots} orderDots={orderDots} countries={data?.countries || []} height={280} />

      {/* Country list */}
      <div className="px-5 py-4 space-y-1.5">
        {data?.countries.slice(0, 5).map(c => (
          <div key={c.code} className="flex items-center gap-2 text-xs">
            <span className="text-base">{getCountryFlag(c.code)}</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300 flex-1">{c.name}</span>
            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden max-w-[80px]">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${c.percent}%` }} />
            </div>
            <span className="font-bold text-gray-900 dark:text-white w-8 text-right">{c.visitors}</span>
            <span className="text-gray-400 w-8 text-right">{c.percent}%</span>
          </div>
        ))}
        {(!data?.countries || data.countries.length === 0) && (
          <div className="text-xs text-gray-400 text-center py-2">No country data yet</div>
        )}
      </div>

      {/* Footer link */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800/80">
        <Link
          href="/admin/traffic"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#e94560] hover:underline"
        >
          View Full Traffic Report
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
        {lastUpdated && (
          <span className="float-right text-[10px] text-gray-400 font-medium">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
