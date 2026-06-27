import React from 'react';
import { notFound } from 'next/navigation';
import { getOrderById } from '@/lib/services/orders';
import { getSettings } from '@/lib/services/settings';
import OrderDetailCanvas from '@/components/admin/OrderDetailCanvas';

export const revalidate = 0; // Dynamic server rendering

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function AdminOrderDetailPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const orderId = searchParams.id;
  
  if (!orderId) {
    notFound();
  }

  const [order, settings] = await Promise.all([
    getOrderById(orderId),
    getSettings()
  ]);

  if (!order) {
    notFound();
  }

  return (
    <OrderDetailCanvas order={order} settings={settings} />
  );
}
