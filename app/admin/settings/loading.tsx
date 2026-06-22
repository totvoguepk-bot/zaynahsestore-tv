import React from 'react';
import { AdminSettingsSkeleton } from '@/components/common/LoadingSkeleton';

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Horizontal Tabs skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 dark:border-gray-800 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0" />
        ))}
      </div>

      {/* Settings Form Loading Skeleton */}
      <AdminSettingsSkeleton />
    </div>
  );
}
