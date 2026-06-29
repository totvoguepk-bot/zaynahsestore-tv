'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Globe, TrendingUp, ShoppingBag, MapPin, Download } from '@/components/common/Icons';
import { formatPrice } from '@/lib/utils/whatsapp';
import { KNOWN_CITIES } from '@/lib/traffic/cities';
import dynamic from 'next/dynamic';

const TrafficMap = dynamic(() => import('./MapView'), { ssr: false });

interface TrafficData {
  liveCount: number;
  totalVisitors: number;
  totalPageviews: number;
  countries: { code: string; name: string; visitors: number; pageviews: number; percent: number }[];
  cities: { city: string; country: string; visitors: number }[];
  orderCities: { city: string; country: string; orders: number; revenue: number }[];
}

function getCountryFlag(code: string): string {
  if (!code || code.length !== 2) return '';
  return code
    .toUpperCase()
    .split('')
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join('');
}

function exportCSV(data: TrafficData | null) {
  if (!data) return;
  const rows: string[] = ['Type,City/Country,Visitors/Orders,Revenue'];
  for (const c of data.countries) {
    rows.push(`Country,${c.name},${c.visitors},`);
  }
  for (const c of data.cities) {
    rows.push(`City,${c.city},${c.visitors},`);
  }
  for (const oc of data.orderCities) {
    rows.push(`Order,${oc.city},${oc.orders},${oc.revenue}`);
  }
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `traffic-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TrafficPage() {
  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('24h');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/traffic?range=${range}`);
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch {
      // Silently fail — keep last data
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 30000);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchData, 30000);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [fetchData]);

  const visitorDotMap = new Map<string, number>();
  if (data) {
    for (const c of data.cities) {
      const coords = KNOWN_CITIES[c.city];
      if (coords) visitorDotMap.set(c.city, (visitorDotMap.get(c.city) || 0) + c.visitors);
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
      if (coords) orderDotMap.set(oc.city, (orderDotMap.get(oc.city) || 0) + oc.orders);
    }
  }

  const orderDots = Array.from(orderDotMap.entries()).map(([city, count]) => {
    const coords = KNOWN_CITIES[city];
    return { city, lat: coords.lat, lng: coords.lng, count };
  });

  const ranges = [
    { key: '1h', label: '1h' },
    { key: '24h', label: '24h' },
    { key: '7d', label: '7d' },
    { key: '30d', label: '30d' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white">Traffic & Visitors</h1>
            <p className="text-xs text-gray-500 font-semibold">Real-time visitor locations and order cities</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(data)}
            disabled={!data}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-white dark:bg-[#16162a] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 flex items-center gap-1.5"
            title="Export CSV"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          {ranges.map(r => (
            <button
              key={r.key}
              onClick={() => { setRange(r.key); setLoading(true); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                range === r.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#16162a] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          </div>
        </div>
      ) : (
        <>
          {/* Map + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden" style={{ minHeight: 500 }}>
              <TrafficMap visitorDots={visitorDots} orderDots={orderDots} />
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5 space-y-4">
                <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  Live Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-semibold text-gray-500">Live Now</span>
                    <span className="text-sm font-black text-emerald-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      ~{Math.max(0, data?.liveCount ?? 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-semibold text-gray-500">Total Visitors</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">{data?.totalVisitors ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-semibold text-gray-500">Pageviews</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">{data?.totalPageviews ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs font-semibold text-gray-500">Top City</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      {data?.cities?.[0] ? `${data.cities[0].city} (${data.cities[0].visitors})` : '—'}
                    </span>
                  </div>
                </div>
                {lastUpdated && (
                  <p className="text-[10px] text-gray-400 font-medium text-center">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Countries + Cities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Globe className="h-4 w-4 text-gray-400" />
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Countries</h3>
              </div>
              {data?.countries && data.countries.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {data.countries.map(c => (
                    <div key={c.code} className="flex items-center gap-3 py-1.5">
                      <span className="text-lg">{getCountryFlag(c.code)}</span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-24 truncate">{c.name}</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${c.percent}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white w-10 text-right">{c.visitors}</span>
                      <span className="text-[11px] text-gray-400 w-8 text-right">{c.percent}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">No country data yet</div>
              )}
            </div>

            <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <MapPin className="h-4 w-4 text-gray-400" />
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Cities</h3>
              </div>
              {data?.cities && data.cities.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {data.cities.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 py-1.5">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex-1">{c.city}</span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase">{c.country}</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden max-w-[80px]">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, c.visitors * 5)}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white w-8 text-right">{c.visitors}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">No city data yet</div>
              )}
            </div>
          </div>

          {/* Orders by City */}
          <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <ShoppingBag className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-black text-gray-900 dark:text-white">Orders by City</h3>
            </div>
            {data?.orderCities && data.orderCities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-wider text-gray-400">
                      <th className="py-3">City</th>
                      <th className="py-3 text-right">Orders</th>
                      <th className="py-3 text-right">Revenue</th>
                      <th className="py-3 text-right">Avg Order Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 font-semibold text-gray-700 dark:text-gray-300">
                    {data.orderCities.map((c, i) => (
                      <tr key={i} className="hover:bg-gray-50/30 dark:hover:bg-white/2 transition-colors">
                        <td className={`py-3 font-bold ${c.city === 'Unknown' ? 'text-gray-400 italic' : 'text-gray-900 dark:text-white'}`}>{c.city}</td>
                        <td className="py-3 text-right font-bold">{c.orders}</td>
                        <td className="py-3 text-right font-black text-gray-900 dark:text-white">{formatPrice(c.revenue, 'Rs.')}</td>
                        <td className="py-3 text-right text-gray-500">{formatPrice(c.orders > 0 ? c.revenue / c.orders : 0, 'Rs.')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-400">No orders yet</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
