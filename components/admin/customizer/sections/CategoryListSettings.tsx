'use client';

import React from 'react';
import { HomepageSection } from '@/lib/types';

interface CategoryListSettingsProps {
  section: HomepageSection;
  onUpdateSection: (updates: Partial<HomepageSection>) => void;
}

export default function CategoryListSettings({
  section,
  onUpdateSection
}: CategoryListSettingsProps) {
  const settings = section.settings || {};

  const handleSettingsChange = (key: string, value: any) => {
    onUpdateSection({
      settings: { ...settings, [key]: value }
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
          Cols Mobile
        </label>
        <select
          value={settings.columns_mobile || 3}
          onChange={e => handleSettingsChange('columns_mobile', parseInt(e.target.value))}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
        >
          <option value="2">2 Columns</option>
          <option value="3">3 Columns</option>
          <option value="4">4 Columns</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
          Cols Desktop
        </label>
        <select
          value={settings.columns_desktop || 6}
          onChange={e => handleSettingsChange('columns_desktop', parseInt(e.target.value))}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
        >
          <option value="3">3 Columns</option>
          <option value="4">4 Columns</option>
          <option value="6">6 Columns</option>
          <option value="8">8 Columns</option>
        </select>
      </div>
    </div>
  );
}
