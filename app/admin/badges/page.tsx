import React from 'react';
import BadgeManager from '@/components/admin/BadgeManager';
import { getBadges } from '@/lib/services/badges';

export const revalidate = 0; // Dynamic server rendering

export default async function AdminBadgesPage() {
  const badges = await getBadges();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Custom Badges</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
          Create, edit, and configure custom promotional badges to overlay on product cards
        </p>
      </div>
      <BadgeManager initialBadges={badges} />
    </div>
  );
}
