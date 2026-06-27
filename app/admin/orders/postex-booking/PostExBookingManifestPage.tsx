'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StoreSettings } from '@/lib/types';
import PostExBookingManifestTable from '@/components/admin/PostExBookingManifestTable';

interface ManifestOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  notes: string;
  total: number;
  items: any[];
}

interface Props {
  orders: ManifestOrder[];
  settings: StoreSettings;
}

export default function PostExBookingManifestPage({ orders, settings }: Props) {
  const router = useRouter();

  return (
    <PostExBookingManifestTable
      orders={orders}
      settings={settings}
      onGoBack={() => router.push('/admin/orders')}
    />
  );
}
