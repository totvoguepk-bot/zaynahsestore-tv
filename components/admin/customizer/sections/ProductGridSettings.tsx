'use client';

import React from 'react';
import { HomepageSection, Category } from '@/lib/types';

interface ProductGridSettingsProps {
  section: HomepageSection;
  categories: Category[];
  onUpdateSection: (updates: Partial<HomepageSection>) => void;
}

export default function ProductGridSettings({
  section,
  categories,
  onUpdateSection
}: ProductGridSettingsProps) {
  const settings = section.settings || {};

  const handleSettingsChange = (key: string, value: any) => {
    onUpdateSection({
      settings: { ...settings, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
          Product Source
        </label>
        <select
          value={settings.source || 'all'}
          onChange={e => handleSettingsChange('source', e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
        >
          <option value="all">All Products</option>
          <option value="featured">Featured Products Only</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              Category: {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
            Product Limit
          </label>
          <span className="text-xs font-bold text-[#e94560]">
            {settings.limit || 8}
          </span>
        </div>
        <input
          type="range"
          min="2"
          max="24"
          step="2"
          value={settings.limit || 8}
          onChange={e => handleSettingsChange('limit', parseInt(e.target.value))}
          className="w-full accent-[#e94560]"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
          View All Button Text
        </label>
        <input
          type="text"
          value={settings.viewAllText || ''}
          onChange={e => handleSettingsChange('viewAllText', e.target.value)}
          placeholder="View All"
          className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
          View All Custom Link
        </label>
        <input
          type="text"
          value={settings.viewAllUrl || ''}
          onChange={e => handleSettingsChange('viewAllUrl', e.target.value)}
          placeholder="e.g. /shop?category=co-ord-sets"
          className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
        />
        <p className="text-[10px] text-gray-400 leading-normal">
          If left blank, it will automatically link to the selected category page.
        </p>
      </div>
    </div>
  );
}
