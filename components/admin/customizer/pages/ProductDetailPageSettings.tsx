'use client';

import React from 'react';
import { StoreSettings, Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils/whatsapp';

import SocialFeedItemsEditor from '../../customizer/sections/SocialFeedItemsEditor';

interface ProductDetailPageSettingsProps {
  settings: StoreSettings;
  onUpdateSettings: (updates: Partial<StoreSettings>) => void;
  subTab: 'swatches' | 'urgency' | 'delivery' | 'layout' | 'ticker' | 'recently_viewed' | 'social_feed' | 'product_sale';
  currentProduct?: Product | null;
  onUpdateProduct?: (id: string, updates: Partial<Product>) => void;
  onSelectMedia: (onSelect: (url: string) => void) => void;
}

export default function ProductDetailPageSettings({
  settings,
  onUpdateSettings,
  subTab,
  currentProduct = null,
  onUpdateProduct = () => {},
  onSelectMedia
}: ProductDetailPageSettingsProps) {
  const parsedItems = React.useMemo(() => {
    const rawItems = settings.social_feeds_items;
    if (!rawItems) return [];
    try {
      const arr = typeof rawItems === 'string' ? JSON.parse(rawItems) : rawItems;
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }, [settings.social_feeds_items]);

  if (subTab === 'product_sale') {
    if (settings.flash_sale_enabled === false) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-white/2 py-10">
          <span className="text-2xl">🔒</span>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Flash Sale Locked</h4>
          <p className="text-[11px] text-gray-500 leading-normal max-w-[200px]">
            This feature is disabled in your store settings. Please enable &quot;Flash Sale Timers&quot; in Settings &gt; Premium Tab first.
          </p>
        </div>
      );
    }

    if (!currentProduct) {
      return (
        <div className="p-4 text-center text-xs text-gray-500 font-semibold">
          Please navigate to a product details page to set its sale.
        </div>
      );
    }

    const isSaleEnabled = currentProduct.flashSaleEnabled ?? false;
    const discountType = currentProduct.flashSaleDiscountType || 'fixed';
    const discountValue = currentProduct.flashSaleDiscountValue || 0;
    const startTime = currentProduct.flashSaleStartDate ? new Date(new Date(currentProduct.flashSaleStartDate).getTime() - new Date(currentProduct.flashSaleStartDate).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
    const endTime = currentProduct.flashSaleEndDate ? new Date(new Date(currentProduct.flashSaleEndDate).getTime() - new Date(currentProduct.flashSaleEndDate).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';

    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Enable Sale for this Product</span>
            <span className="text-[10px] text-[#e94560] font-bold uppercase tracking-wider">{currentProduct.name}</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSaleEnabled}
              onChange={(e) => onUpdateProduct(currentProduct.id, { flashSaleEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        {isSaleEnabled && (
          <div className="border border-gray-200 dark:border-gray-800 p-3.5 rounded-2xl bg-[#e94560]/5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => onUpdateProduct(currentProduct.id, { flashSaleDiscountType: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 rounded-lg text-xs text-gray-900 dark:text-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (Rs.)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Discount Value</label>
                <input
                  type="number"
                  value={discountValue || ''}
                  onChange={(e) => onUpdateProduct(currentProduct.id, { flashSaleDiscountValue: parseFloat(e.target.value) || 0 })}
                  placeholder={discountType === 'percentage' ? 'e.g. 15' : 'e.g. 200'}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => onUpdateProduct(currentProduct.id, { flashSaleStartDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full px-2 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => onUpdateProduct(currentProduct.id, { flashSaleEndDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  className="w-full px-2 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <p className="text-[10px] text-gray-400 leading-normal italic">
              Note: Start/End Time na select karne pe ye sale infinite active rahegi.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (subTab === 'recently_viewed') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Enable Recently Viewed</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.recently_viewed_limit !== 0}
              onChange={(e) => onUpdateSettings({ recently_viewed_limit: e.target.checked ? 4 : 0 })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        {settings.recently_viewed_limit !== 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-gray-500">
              <span>Display Limit</span>
              <span className="text-[#e94560]">{settings.recently_viewed_limit || 4} items</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={settings.recently_viewed_limit || 4}
              onChange={(e) => onUpdateSettings({ recently_viewed_limit: parseInt(e.target.value) })}
              className="w-full accent-[#e94560]"
            />
          </div>
        )}
      </div>
    );
  }

  if (subTab === 'social_feed') {
    if (settings.social_feeds_enabled === false) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-white/2 py-10">
          <span className="text-2xl">🔒</span>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Social Feed Locked</h4>
          <p className="text-[11px] text-gray-500 leading-normal max-w-[200px]">
            This feature is disabled in your store settings. Please enable &quot;Social Feeds Embeds&quot; in Settings &gt; Premium Tab first.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Enable Social Feed Ribbon</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.social_feeds_product_enabled ?? true}
              onChange={(e) => onUpdateSettings({ social_feeds_product_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Title</label>
          <input
            type="text"
            value={settings.social_feeds_title || ''}
            onChange={(e) => onUpdateSettings({ social_feeds_title: e.target.value })}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Subtitle</label>
          <input
            type="text"
            value={settings.social_feeds_subtitle || ''}
            onChange={(e) => onUpdateSettings({ social_feeds_subtitle: e.target.value })}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Description</label>
          <textarea
            rows={2}
            value={settings.social_feeds_desc || ''}
            onChange={(e) => onUpdateSettings({ social_feeds_desc: e.target.value })}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white resize-none"
          />
        </div>

        <div className="pt-2 border-t border-gray-250 dark:border-gray-800">
          <SocialFeedItemsEditor
            items={parsedItems}
            onChangeItems={(newItems) => onUpdateSettings({ social_feeds_items: newItems })}
            onSelectMedia={onSelectMedia}
          />
        </div>
      </div>
    );
  }

  if (subTab === 'ticker') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Enable Scrolling Ticker</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.productDetailEnableTicker}
              onChange={(e) => onUpdateSettings({ productDetailEnableTicker: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        {settings.productDetailEnableTicker && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Ticker Lines (One per line)</label>
            <textarea
              rows={4}
              value={settings.productDetailTickerText || ''}
              onChange={(e) => onUpdateSettings({ productDetailTickerText: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white resize-none"
              placeholder="Free returns within 30 days&#10;Unlimited delivery for only Rs. 175"
            />
          </div>
        )}
      </div>
    );
  }

  if (subTab === 'swatches') {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Product Swatch Size</label>
          <select
            value={settings.productSwatchSize || 'md'}
            onChange={(e) => onUpdateSettings({ productSwatchSize: e.target.value as any })}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
          >
            {['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((sz) => (
              <option key={sz} value={sz}>{sz.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  if (subTab === 'urgency') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Show Remaining Stock</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.showStock}
              onChange={(e) => onUpdateSettings({ showStock: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Enable Stock Urgency Bar</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.stock_urgency_enabled}
              onChange={(e) => onUpdateSettings({ stock_urgency_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Enable Simulated Views</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.enableFakeViews}
              onChange={(e) => onUpdateSettings({ enableFakeViews: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        {settings.enableFakeViews && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Min Views</label>
              <input
                type="number"
                value={settings.minViews}
                onChange={(e) => onUpdateSettings({ minViews: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-gray-50 dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Max Views</label>
              <input
                type="number"
                value={settings.maxViews}
                onChange={(e) => onUpdateSettings({ maxViews: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-gray-50 dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (subTab === 'layout') {
    const layout = settings.productPageLayout || ['details', 'ticker', 'reviews', 'related', 'recently_viewed', 'social_feed'];
    
    const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === layout.length - 1) return;
      
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const newLayout = [...layout];
      const temp = newLayout[index];
      newLayout[index] = newLayout[targetIndex];
      newLayout[targetIndex] = temp;
      
      onUpdateSettings({ productPageLayout: newLayout });
    };

    const blockLabels: Record<string, string> = {
      details: 'Product Details Component',
      ticker: 'Scrolling Announcement Ticker',
      reviews: 'Reviews & FAQ Feed',
      related: 'Related Products Grid',
      recently_viewed: 'Recently Viewed Products',
      social_feed: 'Social Feed Ribbon'
    };

    return (
      <div className="space-y-4">
        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
          Product Page Layout Order
        </label>
        <div className="space-y-2">
          {layout.map((block, idx) => (
            <div
              key={block}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16162a] rounded-xl shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {blockLabels[block] || block}
                </div>
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                  {block}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveBlock(idx, 'up')}
                  className="p-1 text-gray-400 hover:text-gray-750 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={idx === layout.length - 1}
                  onClick={() => handleMoveBlock(idx, 'down')}
                  className="p-1 text-gray-400 hover:text-gray-750 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Delivery Estimate Text</label>
        <textarea
          rows={2}
          value={settings.deliveryEstimateText}
          onChange={(e) => onUpdateSettings({ deliveryEstimateText: e.target.value })}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Free Shipping Threshold (PKR)</label>
        <input
          type="number"
          value={settings.free_shipping_threshold || 2000}
          onChange={(e) => onUpdateSettings({ free_shipping_threshold: Number(e.target.value) })}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Enable Trust Badges</span>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={settings.enableTrustBadges}
            onChange={(e) => onUpdateSettings({ enableTrustBadges: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
        </label>
      </div>

      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Enable Safe Checkout Info</span>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={settings.enableSafeCheckout}
            onChange={(e) => onUpdateSettings({ enableSafeCheckout: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
        </label>
      </div>
    </div>
  );
}
