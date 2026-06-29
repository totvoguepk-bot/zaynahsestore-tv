'use client';

import React, { useState, useMemo } from 'react';
import { Order, StoreSettings, Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils/whatsapp';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Calendar,
  Layers,
  Package
} from '@/components/common/Icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Legend
} from 'recharts';

interface ReportingDashboardProps {
  orders: Order[];
  settings: StoreSettings;
  products?: Product[];
  isEmbed?: boolean;
}

type DateRange = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'all' | 'custom';
type StatusFilter = 'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export default function ReportingDashboard({ orders, settings, products = [], isEmbed = false }: ReportingDashboardProps) {
  const [dateFilter, setDateFilter] = useState<DateRange>('last30');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const getStartOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy.getTime();
  };

  const getEndOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(23, 59, 59, 999);
    return copy.getTime();
  };

  const dateFilteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(o => {
      const orderTime = new Date(o.createdAt).getTime();

      if (dateFilter === 'today') {
        const start = getStartOfDay(now);
        const end = getEndOfDay(now);
        return orderTime >= start && orderTime <= end;
      } else if (dateFilter === 'yesterday') {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return orderTime >= getStartOfDay(yesterday) && orderTime <= getEndOfDay(yesterday);
      } else if (dateFilter === 'last7') {
        const d = new Date(now);
        d.setDate(d.getDate() - 7);
        return orderTime >= getStartOfDay(d) && orderTime <= getEndOfDay(now);
      } else if (dateFilter === 'last30') {
        const d = new Date(now);
        d.setDate(d.getDate() - 30);
        return orderTime >= getStartOfDay(d) && orderTime <= getEndOfDay(now);
      } else if (dateFilter === 'thisMonth') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return orderTime >= getStartOfDay(start) && orderTime <= getEndOfDay(now);
      } else if (dateFilter === 'lastMonth') {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return orderTime >= getStartOfDay(start) && orderTime <= getEndOfDay(end);
      } else if (dateFilter === 'custom') {
        const start = customStartDate ? getStartOfDay(new Date(customStartDate)) : 0;
        const end = customEndDate ? getEndOfDay(new Date(customEndDate)) : Infinity;
        return orderTime >= start && orderTime <= end;
      }

      return true;
    });
  }, [orders, dateFilter, customStartDate, customEndDate]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return dateFilteredOrders;
    return dateFilteredOrders.filter(o => o.status === statusFilter);
  }, [dateFilteredOrders, statusFilter]);

  const fulfilledStatuses = new Set(['shipped', 'out_for_delivery', 'delivered']);

  const metrics = useMemo(() => {
    const revenueOrders = filteredOrders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded');
    const fulfilledOrders = filteredOrders.filter(o => fulfilledStatuses.has(o.status));

    let totalSales = 0;
    let totalCOGS = 0;
    let totalDeliveryCost = 0;
    let fulfilledSales = 0;
    let fulfilledCOGS = 0;

    revenueOrders.forEach(order => {
      totalSales += order.total;
      totalDeliveryCost += order.shippingAmount || 0;
      order.items.forEach(item => {
        const cost = item.product.cost ? parseFloat(item.product.cost.toString()) : 0;
        totalCOGS += cost * item.quantity;
      });
    });

    fulfilledOrders.forEach(order => {
      fulfilledSales += order.total;
      order.items.forEach(item => {
        const cost = item.product.cost ? parseFloat(item.product.cost.toString()) : 0;
        fulfilledCOGS += cost * item.quantity;
      });
    });

    const totalCancelled = filteredOrders.filter(o => o.status === 'cancelled' || o.status === 'refunded')
      .reduce((s, o) => s + o.total, 0);

    const grossProfit = totalSales - totalCOGS;
    const netProfit = totalSales - totalCOGS - totalDeliveryCost;
    const grossMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
    const netMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
    const orderCount = revenueOrders.length;
    const aov = orderCount > 0 ? totalSales / orderCount : 0;

    const projectedCOGS = filteredOrders
      .filter(o => o.status === 'pending' || o.status === 'placed' || o.status === 'confirmed' || o.status === 'processing')
      .reduce((s, o) => {
        o.items.forEach(item => {
          const cost = item.product.cost ? parseFloat(item.product.cost.toString()) : 0;
          s += cost * item.quantity;
        });
        return s;
      }, 0);

    return {
      sales: totalSales,
      cogs: totalCOGS,
      deliveryCost: totalDeliveryCost,
      grossProfit,
      netProfit,
      grossMargin,
      netMargin,
      count: orderCount,
      aov,
      cancelledTotal: totalCancelled,
      fulfilledSales,
      fulfilledCOGS,
      projectedCOGS
    };
  }, [filteredOrders]);

  const topProducts = useMemo(() => {
    const productMap: Record<string, { id: string; name: string; qty: number; sales: number; profit: number; cost: number }> = {};

    filteredOrders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded').forEach(order => {
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

    return Object.values(productMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [filteredOrders]);

  const statusBreakdown = useMemo(() => {
    const statusMap: Record<string, { count: number; sales: number; cost: number; delivery: number }> = {
      pending: { count: 0, sales: 0, cost: 0, delivery: 0 },
      confirmed: { count: 0, sales: 0, cost: 0, delivery: 0 },
      shipped: { count: 0, sales: 0, cost: 0, delivery: 0 },
      delivered: { count: 0, sales: 0, cost: 0, delivery: 0 },
      cancelled: { count: 0, sales: 0, cost: 0, delivery: 0 }
    };

    filteredOrders.forEach(o => {
      if (statusMap[o.status]) {
        statusMap[o.status].count += 1;
        statusMap[o.status].sales += o.total;
        statusMap[o.status].delivery += o.shippingAmount || 0;
        o.items.forEach(item => {
          const cost = item.product.cost ? parseFloat(item.product.cost.toString()) : 0;
          statusMap[o.status].cost += cost * item.quantity;
        });
      }
    });

    return Object.entries(statusMap).map(([status, data]) => ({ status, ...data }));
  }, [filteredOrders]);

  const chartData = useMemo(() => {
    const dayMap: Record<string, { date: string; revenue: number; cogs: number; profit: number }> = {};

    filteredOrders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded').forEach(order => {
      const day = new Date(order.createdAt).toLocaleDateString('en-CA');
      if (!dayMap[day]) dayMap[day] = { date: day, revenue: 0, cogs: 0, profit: 0 };
      dayMap[day].revenue += order.total;
      let orderCogs = 0;
      order.items.forEach(item => {
        const cost = item.product.cost ? parseFloat(item.product.cost.toString()) : 0;
        orderCogs += cost * item.quantity;
      });
      dayMap[day].cogs += orderCogs;
      dayMap[day].profit += order.total - orderCogs;
    });

    return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredOrders]);

  const inventoryData = useMemo(() => {
    return products
      .filter(p => p.isActive)
      .map(p => {
        const stockUnits = p.variants && p.variants.length > 0
          ? p.variants.reduce((s, v) => s + (v.stock || 0), 0)
          : (p.stock || 0);
        const costVal = stockUnits * (p.cost || 0);
        const saleVal = stockUnits * p.price;
        return {
          id: p.id,
          name: p.name,
          variants: p.variants?.length || 0,
          stockUnits,
          costValue: costVal,
          saleValue: saleVal,
          potentialProfit: saleVal - costVal
        };
      })
      .filter(i => i.stockUnits > 0)
      .sort((a, b) => b.saleValue - a.saleValue);
  }, [products]);

  const salesMethod = statusFilter === 'all'
    ? filteredOrders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
    : filteredOrders;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#16162a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 transition-colors shadow-xs">
        <div>
          {!isEmbed && (
            <>
              <h1 className="text-xl font-black text-gray-900 dark:text-white">Financial & Sales Reporting</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">Track revenue, costs, profit margins, and inventory</p>
            </>
          )}
          {isEmbed && (
            <div className="text-sm font-bold text-gray-900 dark:text-white">Financial Summary & Performance Report</div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="text-xs font-bold bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 focus:outline-none text-gray-900 dark:text-white cursor-pointer"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateRange)}
              className="bg-transparent border-0 text-xs font-bold focus:outline-none text-gray-900 dark:text-white cursor-pointer py-1.5"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="all">All Time</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {dateFilter === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Start:</span>
            <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)}
              className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white focus:outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">End:</span>
            <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)}
              className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white focus:outline-none" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-[#16162a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Revenue</span>
          <span className="text-lg font-black text-gray-950 dark:text-white block mt-1">{formatPrice(metrics.sales, settings.currencySymbol)}</span>
          <span className="text-[9px] text-emerald-500 font-bold">Non-cancelled orders</span>
        </div>
        <div className="bg-white dark:bg-[#16162a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">COGS</span>
          <span className="text-lg font-black text-gray-950 dark:text-white block mt-1">{formatPrice(metrics.cogs, settings.currencySymbol)}</span>
          <span className="text-[9px] text-gray-400 font-bold">Product cost × qty</span>
        </div>
        <div className="bg-white dark:bg-[#16162a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivery Cost</span>
          <span className="text-lg font-black text-amber-500 block mt-1">{formatPrice(metrics.deliveryCost, settings.currencySymbol)}</span>
          <span className="text-[9px] text-gray-400 font-bold">Shipping charges</span>
        </div>
        <div className="bg-white dark:bg-[#16162a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Gross Profit</span>
          <span className="text-lg font-black text-emerald-500 block mt-1">{formatPrice(metrics.grossProfit, settings.currencySymbol)}</span>
          <span className="text-[9px] text-gray-400 font-bold">Rev − COGS</span>
        </div>
        <div className="bg-white dark:bg-[#16162a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Net Profit</span>
          <span className="text-lg font-black text-emerald-600 block mt-1">{formatPrice(metrics.netProfit, settings.currencySymbol)}</span>
          <span className="text-[9px] text-gray-400 font-bold">Rev − COGS − Delivery</span>
        </div>
        <div className="bg-white dark:bg-[#16162a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Net Margin</span>
          <span className="text-lg font-black text-indigo-500 block mt-1">{metrics.netMargin.toFixed(1)}%</span>
          <span className="text-[9px] text-gray-400 font-bold">Net profit %</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#16162a] p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Orders</span>
          <span className="text-base font-black text-gray-950 dark:text-white block mt-0.5">{metrics.count}</span>
        </div>
        <div className="bg-white dark:bg-[#16162a] p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">AOV</span>
          <span className="text-base font-black text-gray-950 dark:text-white block mt-0.5">{formatPrice(metrics.aov, settings.currencySymbol)}</span>
        </div>
        <div className="bg-white dark:bg-[#16162a] p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Projected COGS</span>
          <span className="text-base font-black text-amber-500 block mt-0.5">{formatPrice(metrics.projectedCOGS, settings.currencySymbol)}</span>
          <span className="text-[8px] text-gray-400 font-medium">Unfulfilled orders</span>
        </div>
        <div className="bg-white dark:bg-[#16162a] p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Cancelled Value</span>
          <span className="text-base font-black text-red-500 block mt-0.5">{formatPrice(metrics.cancelledTotal, settings.currencySymbol)}</span>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5">
          <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4">Revenue vs Cost vs Profit</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => {
                  const d = new Date(v + 'T00:00:00');
                  return d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
                }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatPrice(v, '')} />
                <Tooltip formatter={(value: any) => formatPrice(Number(value), settings.currencySymbol)} />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[3, 3, 0, 0]} />
                <Bar dataKey="cogs" fill="#ef4444" name="COGS" radius={[3, 3, 0, 0]} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 font-semibold text-gray-700 dark:text-gray-300">
                  {topProducts.map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-gray-50/30 dark:hover:bg-white/2 transition-colors">
                      <td className="py-3 font-bold text-gray-900 dark:text-white truncate max-w-xs">{p.name}</td>
                      <td className="py-3 text-center font-bold">{p.qty}</td>
                      <td className="py-3 text-right font-black text-gray-900 dark:text-white">{formatPrice(p.sales, settings.currencySymbol)}</td>
                      <td className="py-3 text-right text-gray-500">{formatPrice(p.cost, settings.currencySymbol)}</td>
                      <td className="py-3 text-right text-emerald-600 dark:text-emerald-400 font-black">{formatPrice(p.profit, settings.currencySymbol)}</td>
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
                <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-gray-100/50 dark:border-gray-800/50">
                  <div><span className="text-[9px] font-bold text-gray-400 block">Revenue</span><span className="font-extrabold text-gray-900 dark:text-white">{formatPrice(p.sales, settings.currencySymbol)}</span></div>
                  <div><span className="text-[9px] font-bold text-gray-400 block">Cost</span><span className="font-extrabold text-gray-500">{formatPrice(p.cost, settings.currencySymbol)}</span></div>
                  <div className="text-right"><span className="text-[9px] font-bold text-gray-400 block">Profit</span><span className="font-extrabold text-emerald-600 dark:text-emerald-400">{formatPrice(p.profit, settings.currencySymbol)}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800/80">
            <Layers className="h-4.5 w-4.5 text-gray-400" />
            <h3 className="text-sm font-black text-gray-900 dark:text-white">Status Breakdown</h3>
          </div>

          <div className="space-y-4">
            {statusBreakdown.map((row) => {
              const totalOrders = filteredOrders.length;
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
                  <div className="text-[9px] text-gray-400 font-medium">
                    Cost: {formatPrice(row.cost, settings.currencySymbol)} · Delivery: {formatPrice(row.delivery, settings.currencySymbol)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {inventoryData.length > 0 && (
        <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800/80">
            <Package className="h-4.5 w-4.5 text-gray-400" />
            <h3 className="text-sm font-black text-gray-900 dark:text-white">Inventory Report</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <th className="py-3">Product</th>
                  <th className="py-3 text-center">Variants</th>
                  <th className="py-3 text-right">Stock Units</th>
                  <th className="py-3 text-right">Cost Value</th>
                  <th className="py-3 text-right">Sale Value</th>
                  <th className="py-3 text-right">Potential Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 font-semibold text-gray-700 dark:text-gray-300">
                {inventoryData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 dark:hover:bg-white/2 transition-colors">
                    <td className="py-3 font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{item.name}</td>
                    <td className="py-3 text-center text-gray-500">{item.variants}</td>
                    <td className="py-3 text-right font-bold">{item.stockUnits}</td>
                    <td className="py-3 text-right text-gray-500">{formatPrice(item.costValue, settings.currencySymbol)}</td>
                    <td className="py-3 text-right font-black text-gray-900 dark:text-white">{formatPrice(item.saleValue, settings.currencySymbol)}</td>
                    <td className="py-3 text-right font-black text-emerald-600 dark:text-emerald-400">{formatPrice(item.potentialProfit, settings.currencySymbol)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-200 dark:border-gray-700">
                <tr className="font-black text-gray-900 dark:text-white text-xs">
                  <td className="py-3">Total ({inventoryData.length} products)</td>
                  <td></td>
                  <td className="py-3 text-right">{inventoryData.reduce((s, i) => s + i.stockUnits, 0)}</td>
                  <td className="py-3 text-right">{formatPrice(inventoryData.reduce((s, i) => s + i.costValue, 0), settings.currencySymbol)}</td>
                  <td className="py-3 text-right">{formatPrice(inventoryData.reduce((s, i) => s + i.saleValue, 0), settings.currencySymbol)}</td>
                  <td className="py-3 text-right text-emerald-600">{formatPrice(inventoryData.reduce((s, i) => s + i.potentialProfit, 0), settings.currencySymbol)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
