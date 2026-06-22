import React from 'react';
import { AdminStatsSkeleton, AdminTableSkeleton } from '@/components/common/LoadingSkeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Grid of Stats Cards */}
      <AdminStatsSkeleton />

      {/* Table Loading Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <AdminTableSkeleton rows={5} />
      </div>
    </div>
  );
}
