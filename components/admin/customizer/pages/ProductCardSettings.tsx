'use client';

import React from 'react';
import { StoreSettings } from '@/lib/types';
import { ChevronUp, ChevronDown, Eye, Check } from '@/components/common/Icons';

interface ProductCardSettingsProps {
  settings: StoreSettings;
  onUpdateSettings: (updates: Partial<StoreSettings>) => void;
}

export default function ProductCardSettings({ settings, onUpdateSettings }: ProductCardSettingsProps) {
  const activeStyle = settings.card_style || 'style1';
  const activeVariant = settings.card_variant || 'v1';
  const showStars = settings.card_show_stars !== false;
  const showQuickview = settings.card_show_quickview !== false;
  const showWishlist = settings.card_show_wishlist !== false;
  const showQuickcart = settings.card_show_quickcart !== false;
  const alignment = settings.card_alignment || 'left';
  const elementsOrder = settings.card_elements_order || ['title', 'rating', 'price', 'swatches'];


  const elementLabels: Record<string, string> = {
    title: 'Product Title',
    rating: 'Star Rating',
    price: 'Price Tag',
    swatches: 'Color Swatches'
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...elementsOrder];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex >= 0 && swapIndex < newOrder.length) {
      const temp = newOrder[index];
      newOrder[index] = newOrder[swapIndex];
      newOrder[swapIndex] = temp;
      onUpdateSettings({ card_elements_order: newOrder });
    }
  };


  return (
    <div className="space-y-6">
      {/* Templates Selector */}
      <div className="space-y-3.5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
            Product Card Style Template
          </label>
          <select
            value={activeStyle}
            onChange={(e) => onUpdateSettings({ card_style: e.target.value as any })}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-[#f8f8f8] dark:bg-[#0f0f1b] px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
          >
            <optgroup label="Default Base Template">
              <option value="style1">00 — Classic Standard</option>
            </optgroup>

            <optgroup label="Modern Showcase Layouts">
              <option value="showcase_1">Showcase 1 — Neumorphic Soft Grey</option>
              <option value="showcase_2">Showcase 2 — Color Block Neon</option>
              <option value="showcase_3">Showcase 3 — Glassmorphism Glow</option>
              <option value="showcase_4">Showcase 4 — Claymorphism Coral</option>
              <option value="showcase_5">Showcase 5 — Detailed E-Commerce</option>
              <option value="showcase_6">Showcase 6 — Dark Elegance Gold</option>
              <option value="showcase_7">Showcase 7 — Typographic Brutalist</option>
              <option value="showcase_8">Showcase 8 — Geometric Mondrian</option>
              <option value="showcase_9">Showcase 9 — Material M3 Dynamic</option>
              <option value="showcase_10">Showcase 10 — Organic & Wavy</option>
            </optgroup>
          </select>
        </div>

        {/* Mobile Columns Option */}
        <div className="space-y-1.5 pt-2">
          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
            Mobile Grid Columns
          </label>
          <div className="flex gap-2">
            {[
              { id: 1, label: '1 Column (Large Cards)' },
              { id: 2, label: '2 Columns (Standard Grid)' }
            ].map(colOption => {
              const isActive = (settings.card_mobile_columns || 2) === colOption.id;
              return (
                <button
                  key={colOption.id}
                  type="button"
                  onClick={() => onUpdateSettings({ card_mobile_columns: colOption.id })}
                  className={`flex-1 py-2 rounded-xl border text-[10px] font-extrabold tracking-wide uppercase transition-all cursor-pointer ${isActive
                    ? 'border-[#e94560] bg-[#e94560]/5 text-[#e94560] font-black'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 text-gray-500 bg-white dark:bg-[#16162a]'
                    }`}
                >
                  {colOption.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visibility Toggles */}
      <div className="space-y-3 border-t border-gray-150 dark:border-gray-800 pt-5">
        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
          Card Features Visibility
        </label>
        <div className="bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-3.5">
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">Show Rating Stars</span>
            <input
              type="checkbox"
              checked={showStars}
              onChange={e => onUpdateSettings({ card_show_stars: e.target.checked })}
              className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">Show Wishlist Button</span>
            <input
              type="checkbox"
              checked={showWishlist}
              onChange={e => onUpdateSettings({ card_show_wishlist: e.target.checked })}
              className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">Show Quick View Button</span>
            <input
              type="checkbox"
              checked={showQuickview}
              onChange={e => onUpdateSettings({ card_show_quickview: e.target.checked })}
              className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">Show Quick Cart Button</span>
            <input
              type="checkbox"
              checked={showQuickcart}
              onChange={e => onUpdateSettings({ card_show_quickcart: e.target.checked })}
              className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">Show Short Description</span>
            <input
              type="checkbox"
              checked={settings.card_show_description !== false}
              onChange={e => onUpdateSettings({ card_show_description: e.target.checked })}
              className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">Show Variation 1 Swatches</span>
            <input
              type="checkbox"
              checked={settings.card_show_swatches !== false}
              onChange={e => onUpdateSettings({ card_show_swatches: e.target.checked })}
              className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">Show Variation 2 Swatches</span>
            <input
              type="checkbox"
              checked={settings.card_show_sizes !== false}
              onChange={e => onUpdateSettings({ card_show_sizes: e.target.checked })}
              className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">Show Variation 3 Swatches</span>
            <input
              type="checkbox"
              checked={settings.card_show_materials !== false}
              onChange={e => onUpdateSettings({ card_show_materials: e.target.checked })}
              className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">Show Variation 4 Swatches</span>
            <input
              type="checkbox"
              checked={settings.card_show_custom !== false}
              onChange={e => onUpdateSettings({ card_show_custom: e.target.checked })}
              className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">Show Variation 5 Swatches</span>
            <input
              type="checkbox"
              checked={settings.card_show_custom_2 !== false}
              onChange={e => onUpdateSettings({ card_show_custom_2: e.target.checked })}
              className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
          </label>

          <div className="border-t border-gray-150 dark:border-gray-800 pt-3 mt-3 space-y-3.5">
            <label className="flex items-center justify-between cursor-pointer select-none text-xs">
              <span className="font-bold text-gray-700 dark:text-gray-300">Enable Color Swatches</span>
              <input
                type="checkbox"
                checked={settings.card_show_type_color !== false}
                onChange={e => onUpdateSettings({ card_show_type_color: e.target.checked })}
                className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none text-xs">
              <span className="font-bold text-gray-700 dark:text-gray-300">Enable Size Swatches</span>
              <input
                type="checkbox"
                checked={settings.card_show_type_size !== false}
                onChange={e => onUpdateSettings({ card_show_type_size: e.target.checked })}
                className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none text-xs">
              <span className="font-bold text-gray-700 dark:text-gray-300">Enable Material Swatches</span>
              <input
                type="checkbox"
                checked={settings.card_show_type_material !== false}
                onChange={e => onUpdateSettings({ card_show_type_material: e.target.checked })}
                className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none text-xs">
              <span className="font-bold text-gray-700 dark:text-gray-300">Enable Custom Swatches</span>
              <input
                type="checkbox"
                checked={settings.card_show_type_custom !== false}
                onChange={e => onUpdateSettings({ card_show_type_custom: e.target.checked })}
                className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Swatch Customization */}
      <div className="space-y-4 border-t border-gray-150 dark:border-gray-800 pt-5">
        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-black">
          Swatch Style & Settings
        </label>

        <div className="bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-4 shadow-sm">
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">Enable Variant Swatches</span>
            <input
              type="checkbox"
              checked={settings.enableVariantSwatches !== false}
              onChange={e => onUpdateSettings({ enableVariantSwatches: e.target.checked })}
              className="rounded border-gray-350 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
          </label>

          {settings.enableVariantSwatches !== false && (
            <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-3">
              {/* Swatch Shape */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Swatch Shape</label>
                <div className="flex gap-2">
                  {['circle', 'square'].map(shape => {
                    const isActive = (settings.swatchShape || 'circle') === shape;
                    return (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => onUpdateSettings({ swatchShape: shape as any })}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${isActive
                          ? 'border-[#e94560] bg-[#e94560]/5 text-[#e94560] font-black'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 text-gray-500 bg-white dark:bg-[#16162a]'
                          }`}
                      >
                        {shape}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Swatch Limit */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Swatch Limit on Cards</label>
                <select
                  value={settings.swatchLimit || 8}
                  onChange={(e) => onUpdateSettings({ swatchLimit: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-55 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                    <option key={num} value={num}>{num} swatches</option>
                  ))}
                </select>
              </div>

              {/* Archive Swatch Size */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Archive Swatch Size</label>
                <div className="grid grid-cols-7 gap-1">
                  {['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(size => {
                    const isActive = (settings.archiveSwatchSize || 'md') === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => onUpdateSettings({ archiveSwatchSize: size as any })}
                        className={`py-1 rounded-lg border text-[9px] font-extrabold uppercase transition-all cursor-pointer ${isActive
                          ? 'border-[#e94560] bg-[#e94560]/5 text-[#e94560]'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 text-gray-500 bg-white dark:bg-[#16162a]'
                          }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Archive Swatch Alignment */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Archive Swatch Alignment</label>
                <div className="flex gap-2">
                  {['left', 'center', 'right'].map(align => {
                    const isActive = (settings.archiveSwatchAlign || 'left') === align;
                    return (
                      <button
                        key={align}
                        type="button"
                        onClick={() => onUpdateSettings({ archiveSwatchAlign: align as any })}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${isActive
                          ? 'border-[#e94560] bg-[#e94560]/5 text-[#e94560] font-black'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 text-gray-500 bg-white dark:bg-[#16162a]'
                          }`}
                      >
                        {align}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alignment Selector */}
      <div className="space-y-3 border-t border-gray-150 dark:border-gray-800 pt-5">
        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
          Content Alignment
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['left', 'center', 'right'].map(align => {
            const isActive = alignment === align;
            return (
              <button
                key={align}
                onClick={() => onUpdateSettings({ card_alignment: align as any })}
                className={`py-2 text-center rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${isActive
                  ? 'border-[#e94560] bg-[#e94560]/5 text-[#e94560]'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16162a] hover:border-gray-300 dark:hover:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {align}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vertical Element Ordering */}
      <div className="space-y-3 border-t border-gray-150 dark:border-gray-800 pt-5">
        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
          Vertical Elements Sorting
        </label>
        <div className="space-y-2">
          {elementsOrder.map((element, idx) => (
            <div
              key={element}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16162a] rounded-xl shadow-sm"
            >
              <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                {elementLabels[element] || element}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="h-7 w-7 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === elementsOrder.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="h-7 w-7 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
