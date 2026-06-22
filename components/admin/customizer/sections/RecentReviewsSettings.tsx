'use client';

import React from 'react';
import { HomepageSection } from '@/lib/types';

interface RecentReviewsSettingsProps {
  section: HomepageSection;
  onUpdateSection: (updates: Partial<HomepageSection>) => void;
}

export default function RecentReviewsSettings({
  section,
  onUpdateSection
}: RecentReviewsSettingsProps) {
  const settings = section.settings || {};

  const handleSettingsChange = (key: string, value: any) => {
    onUpdateSection({
      settings: { ...settings, [key]: value }
    });
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
          Reviews Limit
        </label>
        <span className="text-xs font-bold text-[#e94560]">
          {settings.limit || 3}
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="9"
        step="1"
        value={settings.limit || 3}
        onChange={e => handleSettingsChange('limit', parseInt(e.target.value))}
        className="w-full accent-[#e94560]"
      />
    </div>
  );
}
