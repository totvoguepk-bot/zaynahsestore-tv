import React from 'react';
import { getOrders } from '@/lib/services/orders';
import { getSettings } from '@/lib/services/settings';
import ReportingDashboard from '@/components/admin/ReportingDashboard';

export const revalidate = 0; // Dynamic server component

export default async function AdminReportingPage() {
  const [orders, settings] = await Promise.all([
    getOrders(),
    getSettings()
  ]);

  return (
    <div className="space-y-6">
      <ReportingDashboard orders={orders} settings={settings} isEmbed={false} />
    </div>
  );
}
