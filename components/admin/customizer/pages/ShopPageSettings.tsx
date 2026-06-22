'use client';

import React from 'react';
import { StoreSettings } from '@/lib/types';

interface ShopPageSettingsProps {
  settings: StoreSettings;
  onUpdateSettings: (updates: Partial<StoreSettings>) => void;
  subTab: 'swatches' | 'layout';
}

export default function ShopPageSettings({
  settings,
  onUpdateSettings,
  subTab
}: ShopPageSettingsProps) {
  if (subTab === 'swatches') {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Enable Variant Swatches</span>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.enableVariantSwatches}
                onChange={(e) => onUpdateSettings({ enableVariantSwatches: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
            </label>
          </div>

          {settings.enableVariantSwatches && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Swatch Shape</label>
                <div className="flex gap-2">
                  {(['circle', 'square'] as const).map(shape => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => onUpdateSettings({ swatchShape: shape })}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.swatchShape === shape
                          ? 'border-[#e94560] bg-[#e94560]/5 text-[#e94560]'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 text-gray-500'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Swatch Limit on Cards</label>
                <select
                  value={settings.swatchLimit}
                  onChange={(e) => onUpdateSettings({ swatchLimit: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                    <option key={num} value={num}>{num} swatches</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Archive Swatch Size</label>
                <select
                  value={settings.archiveSwatchSize || 'md'}
                  onChange={(e) => onUpdateSettings({ archiveSwatchSize: e.target.value as any })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                >
                  {['sm', 'md', 'lg', 'xl', 'xxl'].map((sz) => (
                    <option key={sz} value={sz}>{sz.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Archive Swatch Alignment</label>
                <div className="flex gap-2">
                  {(['left', 'center', 'right'] as const).map(align => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => onUpdateSettings({ archiveSwatchAlign: align })}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.archiveSwatchAlign === align
                          ? 'border-[#e94560] bg-[#e94560]/5 text-[#e94560]'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 text-gray-500'
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Image Hover Style</label>
          <select
            value={settings.imageHoverStyle || 'second_image'}
            onChange={(e) => onUpdateSettings({ imageHoverStyle: e.target.value as any })}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
          >
            <option value="second_image">Show Second Image</option>
            <option value="zoom">Zoom Effect</option>
            <option value="none">None</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Image Aspect Ratio</label>
          <select
            value={settings.imageAspectRatio || '1:1'}
            onChange={(e) => onUpdateSettings({ imageAspectRatio: e.target.value })}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
          >
            <option value="1:1">1:1 (Square)</option>
            <option value="3:4">3:4 (Portrait)</option>
            <option value="4:3">4:3 (Landscape)</option>
            <option value="auto">Auto (Original height)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Title Line Limit</label>
          <select
            value={settings.titleLineLimit || '2'}
            onChange={(e) => onUpdateSettings({ titleLineLimit: e.target.value as any })}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
          >
            <option value="1">1 Line</option>
            <option value="2">2 Lines</option>
            <option value="none">Full Title</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Default Variant Index</label>
          <select
            value={settings.defaultVariantIndex}
            onChange={(e) => onUpdateSettings({ defaultVariantIndex: Number(e.target.value) })}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num === 1 ? '1st Variant (Default)' : `${num}nd Variant`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Show Variations on Catalog</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.card_show_swatches !== false}
              onChange={(e) => onUpdateSettings({ card_show_swatches: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>
      </div>
    </div>
  );
}
