import React from 'react';
import { AdminTableSkeleton } from '@/components/common/LoadingSkeleton';

export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      {/* Header action loading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
        <div className="h-9 w-64 rounded-xl bg-gray-100 dark:bg-gray-800" />
        <div className="h-10 w-32 rounded-xl bg-gray-100 dark:bg-gray-800" />
      </div>

      {/* Table Loading Skeleton */}
      <AdminTableSkeleton rows={8} />
    </div>
  );
}
