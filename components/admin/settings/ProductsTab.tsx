'use client';

import React from 'react';

interface ProductsTabProps {
  enableVariantSwatches: boolean;
  setEnableVariantSwatches: (val: boolean) => void;
  swatchShape: 'circle' | 'square';
  setSwatchShape: (val: 'circle' | 'square') => void;
  swatchLimit: number;
  setSwatchLimit: (val: number) => void;
  archiveSwatchSize: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  setArchiveSwatchSize: (val: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl') => void;
  archiveSwatchAlign: 'left' | 'center' | 'right';
  setArchiveSwatchAlign: (val: 'left' | 'center' | 'right') => void;
  productSwatchSize: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  setProductSwatchSize: (val: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl') => void;
  defaultVariantIndex: number;
  setDefaultVariantIndex: (val: number) => void;
  imageHoverStyle: 'second_image' | 'zoom' | 'none';
  setImageHoverStyle: (val: 'second_image' | 'zoom' | 'none') => void;
  imageAspectRatio: string;
  setImageAspectRatio: (val: string) => void;
  titleLineLimit: '1' | '2' | 'none';
  setTitleLineLimit: (val: '1' | '2' | 'none') => void;
  cardShowDescription: boolean;
  setCardShowDescription: (val: boolean) => void;
  cardShowSwatches: boolean;
  setCardShowSwatches: (val: boolean) => void;
  cardShowSizes: boolean;
  setCardShowSizes: (val: boolean) => void;
  cardShowMaterials: boolean;
  setCardShowMaterials: (val: boolean) => void;
  cardShowCustom: boolean;
  setCardShowCustom: (val: boolean) => void;
  cardShowCustom2: boolean;
  setCardShowCustom2: (val: boolean) => void;
  cardShowTypeColor: boolean;
  setCardShowTypeColor: (val: boolean) => void;
  cardShowTypeSize: boolean;
  setCardShowTypeSize: (val: boolean) => void;
  cardShowTypeMaterial: boolean;
  setCardShowTypeMaterial: (val: boolean) => void;
  cardShowTypeCustom: boolean;
  setCardShowTypeCustom: (val: boolean) => void;
  cardMobileColumns: number;
  setCardMobileColumns: (val: number) => void;
}

export default function ProductsTab({
  enableVariantSwatches,
  setEnableVariantSwatches,
  swatchShape,
  setSwatchShape,
  swatchLimit,
  setSwatchLimit,
  archiveSwatchSize,
  setArchiveSwatchSize,
  archiveSwatchAlign,
  setArchiveSwatchAlign,
  productSwatchSize,
  setProductSwatchSize,
  defaultVariantIndex,
  setDefaultVariantIndex,
  imageHoverStyle,
  setImageHoverStyle,
  imageAspectRatio,
  setImageAspectRatio,
  titleLineLimit,
  setTitleLineLimit,
  cardShowDescription,
  setCardShowDescription,
  cardShowSwatches,
  setCardShowSwatches,
  cardShowSizes,
  setCardShowSizes,
  cardShowMaterials,
  setCardShowMaterials,
  cardShowCustom,
  setCardShowCustom,
  cardShowCustom2,
  setCardShowCustom2,
  cardShowTypeColor,
  setCardShowTypeColor,
  cardShowTypeSize,
  setCardShowTypeSize,
  cardShowTypeMaterial,
  setCardShowTypeMaterial,
  cardShowTypeCustom,
  setCardShowTypeCustom,
  cardMobileColumns,
  setCardMobileColumns,
}: ProductsTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Variant Swatch Display</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Control how color swatches appear in catalog lists and product details pages</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enableVariantSwatches}
              onChange={(e) => setEnableVariantSwatches(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        {enableVariantSwatches && (
          <div className="space-y-6">
            {/* Common Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Swatch Shape</label>
                <div className="flex gap-3">
                  {(['circle', 'square'] as const).map(shape => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => setSwatchShape(shape)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer flex-1 ${swatchShape === shape
                          ? 'border-[#e94560] bg-[#e94560]/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                    >
                      <div
                        className={`h-6 w-6 bg-[#1a1a2e] dark:bg-white ${
                          shape === 'circle' ? 'rounded-full' : 'rounded-sm'
                        }`}
                      />
                      <span className={`text-xs font-bold capitalize ${swatchShape === shape ? 'text-[#e94560]' : 'text-gray-500'}`}>
                        {shape}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Swatch Limit on Cards</label>
                <select
                  value={swatchLimit}
                  onChange={(e) => setSwatchLimit(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                    <option key={num} value={num}>{num} swatches</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">Maximum swatches shown on product catalog cards.</p>
              </div>
            </div>

            {/* Archive Specific Settings */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider text-gray-400">Archive (Catalog Cards) swatches</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Archive Swatch Size</label>
                  <div className="grid grid-cols-7 gap-1.5">
                    {(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map(size => {
                      const dimClass = size === 'xxs' ? 'h-2 w-2' : size === 'xs' ? 'h-2.5 w-2.5' : size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : size === 'lg' ? 'h-5 w-5' : size === 'xl' ? 'h-6 w-6' : 'h-7 w-7';
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setArchiveSwatchSize(size)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all cursor-pointer ${archiveSwatchSize === size
                              ? 'border-[#e94560] bg-[#e94560]/5'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                        >
                          <div className={`${dimClass} bg-[#1a1a2e] dark:bg-white rounded-full`} />
                          <span className={`text-[10px] font-bold uppercase ${archiveSwatchSize === size ? 'text-[#e94560]' : 'text-gray-500'}`}>
                            {size}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Archive Swatch Alignment</label>
                  <div className="flex gap-2">
                    {(['left', 'center', 'right'] as const).map(align => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => setArchiveSwatchAlign(align)}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-bold capitalize transition-all cursor-pointer ${archiveSwatchAlign === align
                            ? 'border-[#e94560] bg-[#e94560]/5 text-[#e94560]'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-500'
                          }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">Align variant swatch items to the left, center, or right of the product cards.</p>
                </div>
              </div>
            </div>

            {/* Product Page Specific Settings */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider text-gray-400">Product details page swatches</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Product Swatch Size</label>
                  <div className="grid grid-cols-7 gap-1.5">
                    {(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map(size => {
                      const dimClass = size === 'xxs' ? 'h-2 w-2' : size === 'xs' ? 'h-3 w-3' : size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : size === 'lg' ? 'h-6 w-6' : size === 'xl' ? 'h-7 w-7' : 'h-8 w-8';
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setProductSwatchSize(size)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all cursor-pointer ${productSwatchSize === size
                              ? 'border-[#e94560] bg-[#e94560]/5'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                        >
                          <div className={`${dimClass} bg-[#1a1a2e] dark:bg-white rounded-full`} />
                          <span className={`text-[10px] font-bold uppercase ${productSwatchSize === size ? 'text-[#e94560]' : 'text-gray-500'}`}>
                            {size}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Default Variant on Catalog</label>
                  <select
                    value={defaultVariantIndex}
                    onChange={(e) => setDefaultVariantIndex(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num === 1 ? '1st Variant (Default)' : num === 2 ? '2nd Variant' : num === 3 ? '3rd Variant' : `${num}th Variant`}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">Show this variant index's price and image as initial card view in catalog.</p>

                  <div className="mt-5 space-y-3.5 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Catalog Card Variations</h4>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Show Variation 1 Swatches</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cardShowSwatches}
                          onChange={(e) => setCardShowSwatches(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Show Variation 2 Swatches</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cardShowSizes}
                          onChange={(e) => setCardShowSizes(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Show Variation 3 Swatches</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cardShowMaterials}
                          onChange={(e) => setCardShowMaterials(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Show Variation 4 Swatches</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cardShowCustom}
                          onChange={(e) => setCardShowCustom(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Show Variation 5 Swatches</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cardShowCustom2}
                          onChange={(e) => setCardShowCustom2(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                      </label>
                    </div>

                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pt-4 border-t border-gray-100 dark:border-gray-800/50 mt-4">Catalog Swatch Type Visibility</h4>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Enable Color Swatches</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cardShowTypeColor}
                          onChange={(e) => setCardShowTypeColor(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Enable Size Swatches</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cardShowTypeSize}
                          onChange={(e) => setCardShowTypeSize(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Enable Material Swatches</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cardShowTypeMaterial}
                          onChange={(e) => setCardShowTypeMaterial(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Enable Custom Option Swatches</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cardShowTypeCustom}
                          onChange={(e) => setCardShowTypeCustom(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 transition-colors">
        <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Design & Catalog Layout</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Configure product image styles, aspect ratios, and card layouts in lists</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Image Hover Style</label>
            <select
              value={imageHoverStyle}
              onChange={(e) => setImageHoverStyle(e.target.value as any)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
            >
              <option value="second_image">Show Second Image</option>
              <option value="zoom">Zoom Effect</option>
              <option value="none">None</option>
            </select>
            <p className="text-[10px] text-gray-400 mt-1">Select the visual effect when hovering over product catalog images.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Image Aspect Ratio</label>
            <select
              value={imageAspectRatio}
              onChange={(e) => setImageAspectRatio(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
            >
              <option value="1:1">1:1 (Square - Recommended)</option>
              <option value="3:4">3:4 (Portrait - Fashion)</option>
              <option value="4:3">4:3 (Landscape)</option>
              <option value="16:9">16:9 (Wide)</option>
              <option value="auto">Auto (Original height)</option>
            </select>
            <p className="text-[10px] text-gray-400 mt-1">Specify aspect sizing for product card images in grids.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Archive Title Line Limit</label>
            <select
              value={titleLineLimit}
              onChange={(e) => setTitleLineLimit(e.target.value as any)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
            >
              <option value="1">1 Line Limit</option>
              <option value="2">2 Lines Limit (Default)</option>
              <option value="none">Unlimited / Full Title</option>
            </select>
            <p className="text-[10px] text-gray-400 mt-1">Clamp long titles to save space or display the full product title.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Mobile Grid Columns</label>
            <select
              value={cardMobileColumns}
              onChange={(e) => setCardMobileColumns(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
            >
              <option value={1}>1 Column (Large Cards)</option>
              <option value={2}>2 Columns (Standard Grid)</option>
            </select>
            <p className="text-[10px] text-gray-400 mt-1">Select column count for storefront product grids on mobile screens.</p>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-3 cursor-pointer select-none text-sm">
            <input
              type="checkbox"
              checked={cardShowDescription}
              onChange={(e) => setCardShowDescription(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
            <div>
              <span className="font-bold text-gray-700 dark:text-gray-300 block">Show Catalog Descriptions</span>
              <span className="text-[10px] text-gray-400">Display short descriptions below titles on catalog grids.</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
