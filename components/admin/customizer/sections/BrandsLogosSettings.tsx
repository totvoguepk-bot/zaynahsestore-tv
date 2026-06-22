'use client';

import React from 'react';
import { HomepageSection } from '@/lib/types';

interface BrandsLogosSettingsProps {
  section: HomepageSection;
  onUpdateSection: (updates: Partial<HomepageSection>) => void;
}

export default function BrandsLogosSettings({
  section,
  onUpdateSection
}: BrandsLogosSettingsProps) {
  const contentData = section.content_data || {};
  const logos = contentData.logos || [];

  const handleLogosChange = (value: string) => {
    const splitLogos = value.split('\n').filter(Boolean);
    onUpdateSection({
      content_data: { ...contentData, logos: splitLogos }
    });
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
        Partner Logo URLs
      </label>
      <textarea
        value={logos.join('\n')}
        onChange={e => handleLogosChange(e.target.value)}
        placeholder="Enter one image URL per line"
        rows={4}
        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
      />
    </div>
  );
}
