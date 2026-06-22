import React from 'react';
import OrderLog from '@/components/admin/OrderLog';
import { getOrders } from '@/lib/services/orders';
import { getSettings } from '@/lib/services/settings';

export const revalidate = 0; // Dynamic server rendering

export default async function AdminOrdersPage() {
  const [orders, settings] = await Promise.all([
    getOrders(),
    getSettings()
  ]);

  return (
    <OrderLog initialOrders={orders} settings={settings} />
  );
}
