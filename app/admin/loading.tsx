import React from 'react';
import { AdminStatsSkeleton, AdminTableSkeleton } from '@/components/common/LoadingSkeleton';

export default function AdminLoading() {
  return (
    <div className="space-y-6 p-6 min-h-[80vh]">
      {/* Admin header skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-4 w-64 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-gray-100 dark:bg-gray-800" />
      </div>

      {/* Grid of Stats Cards */}
      <AdminStatsSkeleton />

      {/* Table Loading Skeleton */}
      <AdminTableSkeleton rows={5} />
    </div>
  );
}
