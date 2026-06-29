import React from 'react';
import Link from 'next/link';
import { ShoppingBag, FolderOpen, ClipboardList, TrendingUp } from '@/components/common/Icons';
import { getProducts } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { getOrders } from '@/lib/services/orders';
import { getSettings } from '@/lib/services/settings';
import { getAdminCustomers } from '@/lib/services/customers';
import { formatPrice } from '@/lib/utils/whatsapp';
import DashboardClient from '@/components/admin/DashboardClient';
import TrafficPanel from '@/components/admin/dashboard/TrafficPanel';

export const revalidate = 0;

export default async function DashboardPage() {
  const [products, categories, orders, settings, customers] = await Promise.all([
    getProducts(),
    getCategories(),
    getOrders(),
    getSettings(),
    getAdminCustomers()
  ]);

  const totalSales = orders
    .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: 'Total Products', value: products.length, icon: ShoppingBag, color: 'bg-blue-500/10 text-blue-600', href: '/admin/products' },
    { label: 'Total Categories', value: categories.length, icon: FolderOpen, color: 'bg-amber-500/10 text-amber-600', href: '/admin/categories' },
    { label: 'Total Orders Logged', value: orders.length, icon: ClipboardList, color: 'bg-emerald-500/10 text-emerald-600', href: '/admin/orders' },
    { label: 'Total Sales (All Time)', value: formatPrice(totalSales, settings.currencySymbol), icon: TrendingUp, color: 'bg-indigo-500/10 text-indigo-600', href: '/admin/orders' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              href={stat.href}
              className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between group text-gray-900 dark:text-white"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {stat.label}
                </span>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
              </div>
            </Link>
          );
        })}
      </div>

      <DashboardClient orders={orders} products={products} customers={customers} settings={settings} />

      <TrafficPanel />
    </div>
  );
}
