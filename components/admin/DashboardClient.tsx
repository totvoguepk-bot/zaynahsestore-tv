'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Order, StoreSettings, Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils/whatsapp';
import {
  TrendingUp, ShoppingBag, Layers, Package,
  User, Edit2, ChevronRight
} from '@/components/common/Icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Legend
} from 'recharts';

interface DashboardClientProps {
  orders: Order[];
  products: Product[];
  customers: { id: string; name: string; createdAt: string }[];
  settings: StoreSettings;
}

type DateRange = 'today' | 'last7' | 'last30' | 'thisMonth' | 'all';

const fulfilledStatuses = new Set(['shipped', 'out_for_delivery', 'delivered']);

function getStartOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
}

function getEndOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(23, 59, 59, 999);
  return copy.getTime();
}

function getPeriodBounds(filter: DateRange, now: Date): { start: number; end: number } {
  const end = getEndOfDay(now);
  let start: number;
  if (filter === 'today') {
    start = getStartOfDay(now);
  } else if (filter === 'last7') {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    start = getStartOfDay(d);
  } else if (filter === 'last30') {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    start = getStartOfDay(d);
  } else if (filter === 'thisMonth') {
    start = getStartOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
  } else {
    start = 0;
  }
  return { start, end };
}

function getPreviousPeriodBounds(filter: DateRange, now: Date): { start: number; end: number } {
  const current = getPeriodBounds(filter, now);
  if (current.start === 0) return { start: 0, end: 0 };
  const rangeMs = current.end - current.start;
  return { start: current.start - rangeMs, end: current.start - 1 };
}

function filterOrders(orders: Order[], start: number, end: number): Order[] {
  if (start === 0 && end === 0) return [];
  return orders.filter(o => {
    const t = new Date(o.createdAt).getTime();
    return t >= start && t <= end;
  });
}

function computeMetrics(filteredOrders: Order[]) {
  const revenueOrders = filteredOrders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded');
  let totalSales = 0, totalCOGS = 0, totalDeliveryCost = 0;
  revenueOrders.forEach(order => {
    totalSales += order.total;
    totalDeliveryCost += order.shippingAmount || 0;
    order.items.forEach(item => {
      const cost = item.product.cost ? parseFloat(item.product.cost.toString()) : 0;
      totalCOGS += cost * item.quantity;
    });
  });
  const grossProfit = totalSales - totalCOGS;
  const netProfit = totalSales - totalCOGS - totalDeliveryCost;
  return {
    sales: totalSales,
    cogs: totalCOGS,
    deliveryCost: totalDeliveryCost,
    grossProfit,
    netProfit,
    netMargin: totalSales > 0 ? (netProfit / totalSales) * 100 : 0,
    count: revenueOrders.length,
    avgOrderValue: revenueOrders.length > 0 ? totalSales / revenueOrders.length : 0,
    refundedCount: filteredOrders.filter(o => o.status === 'refunded').length,
    cancelledCount: filteredOrders.filter(o => o.status === 'cancelled').length,
    totalOrders: filteredOrders.length,
  };
}

function pctChange(current: number, previous: number): { pct: number; direction: 'up' | 'down' | 'flat' } {
  if (previous === 0) return { pct: current > 0 ? 100 : 0, direction: current > 0 ? 'up' : 'flat' };
  const pct = ((current - previous) / previous) * 100;
  return { pct: Math.abs(pct), direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat' };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function DashboardClient({ orders, products, customers, settings }: DashboardClientProps) {
  const [dateFilter, setDateFilter] = useState<DateRange>('all');

  const now = new Date();

  const currentBounds = useMemo(() => getPeriodBounds(dateFilter, now), [dateFilter]);
  const prevBounds = useMemo(() => getPreviousPeriodBounds(dateFilter, now), [dateFilter]);

  const currentOrders = useMemo(() => filterOrders(orders, currentBounds.start, currentBounds.end), [orders, currentBounds]);
  const prevOrders = useMemo(() => filterOrders(orders, prevBounds.start, prevBounds.end), [orders, prevBounds]);

  const metrics = useMemo(() => computeMetrics(currentOrders), [currentOrders]);
  const prevMetrics = useMemo(() => computeMetrics(prevOrders), [prevOrders]);

  const statusBreakdown = useMemo(() => {
    const statusMap: Record<string, { count: number; sales: number }> = {
      pending: { count: 0, sales: 0 },
      confirmed: { count: 0, sales: 0 },
      shipped: { count: 0, sales: 0 },
      delivered: { count: 0, sales: 0 },
      cancelled: { count: 0, sales: 0 }
    };
    currentOrders.forEach(o => {
      if (statusMap[o.status]) {
        statusMap[o.status].count += 1;
        statusMap[o.status].sales += o.total;
      }
    });
    return Object.entries(statusMap).map(([status, data]) => ({ status, ...data }));
  }, [currentOrders]);

  const topProducts = useMemo(() => {
    const productMap: Record<string, { id: string; name: string; qty: number; sales: number; profit: number; cost: number }> = {};
    const revenueOrders = currentOrders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded');
    revenueOrders.forEach(order => {
      order.items.forEach(item => {
        const pId = item.product.id;
        if (!productMap[pId]) {
          productMap[pId] = { id: pId, name: item.product.name, qty: 0, sales: 0, profit: 0, cost: 0 };
        }
        const cost = item.product.cost ? parseFloat(item.product.cost.toString()) : 0;
        productMap[pId].qty += item.quantity;
        productMap[pId].sales += item.total;
        productMap[pId].cost += cost * item.quantity;
        productMap[pId].profit += item.total - (cost * item.quantity);
      });
    });
    return Object.values(productMap).sort((a, b) => b.sales - a.sales).slice(0, 5);
  }, [currentOrders]);

  const chartData = useMemo(() => {
    const rangeDays = dateFilter === 'today' ? 1 : dateFilter === 'last7' ? 7 : dateFilter === 'last30' ? 30 : dateFilter === 'thisMonth' ? new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() : 365;
    const groupByWeek = rangeDays > 60;
    const groupByMonth = rangeDays > 180;
    const revenueOrders = currentOrders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded');

    const map: Record<string, { label: string; revenue: number; cogs: number; profit: number }> = {};
    revenueOrders.forEach(order => {
      const d = new Date(order.createdAt);
      let key: string;
      if (groupByMonth) {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      } else if (groupByWeek) {
        const startOfWeek = new Date(d);
        startOfWeek.setDate(d.getDate() - d.getDay());
        key = startOfWeek.toLocaleDateString('en-CA');
      } else {
        key = d.toLocaleDateString('en-CA');
      }
      if (!map[key]) map[key] = { label: key, revenue: 0, cogs: 0, profit: 0 };
      map[key].revenue += order.total;
      let orderCogs = 0;
      order.items.forEach(item => {
        const cost = item.product.cost ? parseFloat(item.product.cost.toString()) : 0;
        orderCogs += cost * item.quantity;
      });
      map[key].cogs += orderCogs;
      map[key].profit += order.total - orderCogs;
    });

    return Object.values(map).sort((a, b) => a.label.localeCompare(b.label)).map(d => ({
      ...d,
      label: groupByMonth
        ? (() => { const [y, m] = d.label.split('-'); const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${months[parseInt(m)-1]} ${y}`; })()
        : groupByWeek
        ? `Wk ${new Date(d.label + 'T00:00:00').toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}`
        : new Date(d.label + 'T00:00:00').toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
    }));
  }, [currentOrders, dateFilter]);

  const recentActivity = useMemo(() => {
    const events: { id: string; type: 'order' | 'customer' | 'product'; text: string; time: string }[] = [];
    orders.forEach(o => {
      events.push({
        id: `o-${o.id}`,
        type: 'order',
        text: `${o.orderNumber} placed — ${o.items.length} item${o.items.length !== 1 ? 's' : ''} · ${formatPrice(o.total, settings.currencySymbol)}`,
        time: o.createdAt
      });
    });
    customers.forEach(c => {
      events.push({
        id: `c-${c.id}`,
        type: 'customer',
        text: `${c.name} registered`,
        time: c.createdAt
      });
    });
    products.forEach(p => {
      events.push({
        id: `p-${p.id}`,
        type: 'product',
        text: `"${p.name}" updated`,
        time: p.updatedAt
      });
    });
    return events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);
  }, [orders, customers, products, settings.currencySymbol]);

  const inventorySnapshot = useMemo(() => {
    const active = products.filter(p => p.isActive);
    const totalSKUs = active.length;
    let totalStockUnits = 0;
    let totalCostValue = 0;
    let totalSaleValue = 0;

    active.forEach(p => {
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach(v => {
          const stock = v.stock || 0;
          totalStockUnits += stock;
          totalCostValue += stock * (p.cost || 0);
          totalSaleValue += stock * (v.price || p.price);
        });
      } else {
        const stock = p.stock || 0;
        totalStockUnits += stock;
        totalCostValue += stock * (p.cost || 0);
        totalSaleValue += stock * p.price;
      }
    });

    return { totalSKUs, totalStockUnits, totalCostValue, totalSaleValue };
  }, [products]);

  const filters: { key: DateRange; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'last7', label: '7d' },
    { key: 'last30', label: '30d' },
    { key: 'thisMonth', label: 'Month' },
    { key: 'all', label: 'All Time' },
  ];

  const chartEmpty = chartData.length === 0 || chartData.every(d => d.revenue === 0 && d.cogs === 0 && d.profit === 0);

  function MetricCard({ label, value, sub, prevValue, format }: { label: string; value: number | string; sub: string; prevValue: number; format?: (v: number) => string }) {
    const change = label === 'Net Margin' || label === 'Orders' ? undefined : pctChange(typeof value === 'number' ? value : 0, prevValue);
    return (
      <div className="bg-white dark:bg-[#16162a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{label}</span>
          {change && dateFilter !== 'all' && (
            <span className={`text-[10px] font-black flex items-center gap-0.5 ${
              change.direction === 'up' ? 'text-emerald-500' : change.direction === 'down' ? 'text-red-500' : 'text-gray-400'
            }`}>
              {change.direction === 'up' ? '↑' : change.direction === 'down' ? '↓' : '→'}
              {change.pct.toFixed(1)}%
            </span>
          )}
        </div>
        <span className="text-lg font-black text-gray-950 dark:text-white block mt-1">{value}</span>
        <span className="text-[9px] text-gray-400 font-bold">{sub}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setDateFilter(f.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              dateFilter === f.key
                ? 'bg-[#e94560] text-white shadow-md'
                : 'bg-white dark:bg-[#16162a] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Revenue"
          value={formatPrice(metrics.sales, settings.currencySymbol)}
          sub={`${metrics.count} orders`}
          prevValue={prevMetrics.sales}
        />
        <MetricCard
          label="COGS"
          value={formatPrice(metrics.cogs, settings.currencySymbol)}
          sub="Product cost × qty"
          prevValue={prevMetrics.cogs}
        />
        <MetricCard
          label="Delivery Cost"
          value={formatPrice(metrics.deliveryCost, settings.currencySymbol)}
          sub="Shipping charges"
          prevValue={prevMetrics.deliveryCost}
        />
        <MetricCard
          label="Gross Profit"
          value={formatPrice(metrics.grossProfit, settings.currencySymbol)}
          sub="Rev − COGS"
          prevValue={prevMetrics.grossProfit}
        />
        <MetricCard
          label="Net Profit"
          value={formatPrice(metrics.netProfit, settings.currencySymbol)}
          sub="Rev − COGS − Delivery"
          prevValue={prevMetrics.netProfit}
        />
        <MetricCard
          label="Net Margin"
          value={`${metrics.netMargin.toFixed(1)}%`}
          sub="Net profit %"
          prevValue={prevMetrics.netMargin}
        />
      </div>

      {/* Secondary metric row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#16162a] p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Orders</span>
          <span className="text-base font-black text-gray-950 dark:text-white block mt-0.5">{metrics.count}</span>
          {dateFilter !== 'all' && prevMetrics.count > 0 && (() => {
            const ch = pctChange(metrics.count, prevMetrics.count);
            return <span className={`text-[10px] font-black ${ch.direction === 'up' ? 'text-emerald-500' : ch.direction === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
              {ch.direction === 'up' ? '↑' : ch.direction === 'down' ? '↓' : '→'} {ch.pct.toFixed(1)}%
            </span>;
          })()}
        </div>
        <div className="bg-white dark:bg-[#16162a] p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">AOV</span>
          <span className="text-base font-black text-gray-950 dark:text-white block mt-0.5">{formatPrice(metrics.avgOrderValue, settings.currencySymbol)}</span>
          {dateFilter !== 'all' && (() => {
            const ch = pctChange(metrics.avgOrderValue, prevMetrics.avgOrderValue);
            return <span className={`text-[10px] font-black ${ch.direction === 'up' ? 'text-emerald-500' : ch.direction === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
              {ch.direction === 'up' ? '↑' : ch.direction === 'down' ? '↓' : '→'} {ch.pct.toFixed(1)}%
            </span>;
          })()}
        </div>
        <div className="bg-white dark:bg-[#16162a] p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Cancelled</span>
          <span className="text-base font-black text-red-500 block mt-0.5">{metrics.cancelledCount}</span>
          <span className="text-[8px] text-gray-400 font-medium">{metrics.totalOrders > 0 ? ((metrics.cancelledCount / metrics.totalOrders) * 100).toFixed(1) : '0'}% rate</span>
        </div>
        <div className="bg-white dark:bg-[#16162a] p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Refunded</span>
          <span className="text-base font-black text-rose-500 block mt-0.5">{metrics.refundedCount}</span>
          <span className="text-[8px] text-gray-400 font-medium">{metrics.totalOrders > 0 ? ((metrics.refundedCount / metrics.totalOrders) * 100).toFixed(1) : '0'}% rate</span>
        </div>
      </div>

      {/* Chart + Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#16162a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs p-5">
          <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4">Revenue vs Cost vs Profit</h3>
          {chartEmpty ? (
            <div className="h-72 flex items-center justify-center text-sm text-gray-400 font-semibold">
              No orders in this period
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatPrice(v, '')} />
                  <Tooltip
                    formatter={(value: any) => formatPrice(Number(value), settings.currencySymbol)}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="cogs" fill="#ef4444" name="COGS" radius={[3, 3, 0, 0]} />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800/80">
            <Layers className="h-4.5 w-4.5 text-gray-400" />
            <h3 className="text-sm font-black text-gray-900 dark:text-white">Status Breakdown</h3>
          </div>
          <div className="space-y-4">
            {statusBreakdown.map((row) => {
              const totalOrders = currentOrders.length;
              const pct = totalOrders > 0 ? (row.count / totalOrders) * 100 : 0;
              return (
                <div key={row.status} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="capitalize font-bold text-gray-800 dark:text-gray-200">{row.status}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {row.count} · {formatPrice(row.sales, settings.currencySymbol)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${row.status === 'delivered' ? 'bg-emerald-500' : row.status === 'confirmed' ? 'bg-blue-500' : row.status === 'pending' ? 'bg-amber-500' : row.status === 'cancelled' ? 'bg-red-500' : 'bg-purple-500'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-gray-400" />
              <h3 className="text-sm font-black text-gray-900 dark:text-white">Top Products</h3>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">By Revenue</span>
          </div>
          {topProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">No items sold in the selected period.</div>
          ) : (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <th className="py-3">Product</th>
                    <th className="py-3 text-center">Qty</th>
                    <th className="py-3 text-right">Revenue</th>
                    <th className="py-3 text-right">Cost</th>
                    <th className="py-3 text-right">Profit</th>
                    <th className="py-3 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 font-semibold text-gray-700 dark:text-gray-300">
                  {topProducts.map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-gray-50/30 dark:hover:bg-white/2 transition-colors">
                      <td className="py-3 font-bold text-gray-900 dark:text-white truncate max-w-[140px]">{p.name}</td>
                      <td className="py-3 text-center font-bold">{p.qty}</td>
                      <td className="py-3 text-right font-black text-gray-900 dark:text-white">{formatPrice(p.sales, settings.currencySymbol)}</td>
                      <td className="py-3 text-right text-gray-500">{formatPrice(p.cost, settings.currencySymbol)}</td>
                      <td className="py-3 text-right text-emerald-600 dark:text-emerald-400 font-black">{formatPrice(p.profit, settings.currencySymbol)}</td>
                      <td className="py-3 text-right font-black">{p.sales > 0 ? `${((p.profit / p.sales) * 100).toFixed(1)}%` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="md:hidden space-y-3">
            {topProducts.map((p, idx) => (
              <div key={p.id || idx} className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-xs space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2">{p.name}</span>
                  <span className="shrink-0 rounded-full bg-gray-100 dark:bg-gray-800/80 px-2 py-0.5 text-[9px] font-bold text-gray-700 dark:text-gray-300">Qty: {p.qty}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs pt-2 border-t border-gray-100/50 dark:border-gray-800/50">
                  <div><span className="text-[9px] font-bold text-gray-400 block">Rev</span><span className="font-extrabold text-gray-900 dark:text-white">{formatPrice(p.sales, settings.currencySymbol)}</span></div>
                  <div><span className="text-[9px] font-bold text-gray-400 block">Cost</span><span className="font-extrabold text-gray-500">{formatPrice(p.cost, settings.currencySymbol)}</span></div>
                  <div><span className="text-[9px] font-bold text-gray-400 block">Profit</span><span className="font-extrabold text-emerald-600 dark:text-emerald-400">{formatPrice(p.profit, settings.currencySymbol)}</span></div>
                  <div className="text-right"><span className="text-[9px] font-bold text-gray-400 block">Margin</span><span className="font-extrabold">{p.sales > 0 ? `${((p.profit / p.sales) * 100).toFixed(1)}%` : '—'}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800/80">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-gray-400" />
              <h3 className="text-sm font-black text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
          </div>
          <div className="space-y-1">
            {recentActivity.map((event) => (
              <div key={event.id} className="flex items-start gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                <span className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] ${
                  event.type === 'order' ? 'bg-blue-500' : event.type === 'customer' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}>
                  {event.type === 'order' ? <Package className="h-3 w-3" /> : event.type === 'customer' ? <User className="h-3 w-3" /> : <Edit2 className="h-3 w-3" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{event.text}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{timeAgo(event.time)}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="py-8 text-center text-xs text-gray-400">No activity yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Snapshot Widget */}
      <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800/80">
          <Package className="h-4.5 w-4.5 text-gray-400" />
          <h3 className="text-sm font-black text-gray-900 dark:text-white">Inventory Snapshot</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total SKUs</span>
            <span className="text-xl font-black text-gray-950 dark:text-white block mt-1">{inventorySnapshot.totalSKUs}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Stock Units</span>
            <span className="text-xl font-black text-gray-950 dark:text-white block mt-1">{inventorySnapshot.totalStockUnits.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Cost Value</span>
            <span className="text-xl font-black text-amber-500 block mt-1">{formatPrice(inventorySnapshot.totalCostValue, settings.currencySymbol)}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Sale Value</span>
            <span className="text-xl font-black text-emerald-500 block mt-1">{formatPrice(inventorySnapshot.totalSaleValue, settings.currencySymbol)}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/80">
          <Link
            href="/admin/reporting#inventory"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e94560] hover:underline"
          >
            View Full Inventory Report
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
