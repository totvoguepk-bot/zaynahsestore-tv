import React from 'react';
import { redirect } from 'next/navigation';
import PostExBookingManifestPage from './PostExBookingManifestPage';
import { getSettings } from '@/lib/services/settings';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { normalizeCity } from '@/lib/utils/normalizeCity';

export const revalidate = 0;

export default async function PostExBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) redirect('/admin/orders');

  // id can be a single order id or comma-separated
  const ids = id.split(',').filter(Boolean);

  const { data: ordersRaw, error: ordersError } = await supabaseAdmin
    .from('orders')
    .select('id, order_number, customer_name, customer_phone, notes, total, items')
    .in('id', ids);

  if (ordersError) {
    console.error('[PostExBooking] Supabase query failed:', ordersError);
  }

  const settings = await getSettings();

  const orders = (ordersRaw ?? []).map(o => {
    const notes = o.notes || '';
    const lines = notes.split('\n');
    let address = '', aptSuite = '', city = '';

    lines.forEach((line: string) => {
      const lower = line.toLowerCase().trim();
      if (lower.startsWith('address:')) {
        address = line.substring('address:'.length).trim();
      } else if (lower.startsWith('apt/suite:') || lower.startsWith('apt:')) {
        aptSuite = line.substring(line.indexOf(':') + 1).trim();
      } else if (lower.startsWith('city:')) {
        city = line.substring('city:'.length).trim();
      }
    });

    if (!address) {
      for (const line of lines) {
        const t = line.trim();
        if (!t) continue;
        const l = t.toLowerCase();
        if (l.startsWith('apt/suite:') || l.startsWith('apt:') ||
            l.startsWith('city:') || l.startsWith('phone:') ||
            l.startsWith('payment method:') || l.startsWith('postal:')) {
          continue;
        }
        address = t;
        break;
      }
    }

    const cleanCity = normalizeCity(city);
    const fullAddress = [address, aptSuite].filter(Boolean).join(', ');

    return {
      id: o.id,
      orderNumber: o.order_number || o.id.slice(0, 8),
      customerName: o.customer_name || '',
      customerPhone: o.customer_phone || '',
      shippingAddress: fullAddress,
      shippingCity: cleanCity,
      notes: notes,
      total: parseFloat(o.total?.toString() || '0'),
      items: (o.items || []) as any[],
    };
  });

  return <PostExBookingManifestPage orders={orders} settings={settings} />;
}
