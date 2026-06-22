'use client';

import React from 'react';
import { toast } from 'sonner';
import * as CentralIcons from '@/components/common/Icons';

interface TrustTabProps {
  enableFakeViews: boolean;
  setEnableFakeViews: (val: boolean) => void;
  minViews: number;
  setMinViews: (val: number) => void;
  maxViews: number;
  setMaxViews: (val: number) => void;
  enableTrustBadges: boolean;
  setEnableTrustBadges: (val: boolean) => void;
  deliveryEstimateText: string;
  setDeliveryEstimateText: (val: string) => void;
  freeShippingText: string;
  setFreeShippingText: (val: string) => void;
  promoCodeText: string;
  setPromoCodeText: (val: string) => void;
  safeCheckoutText: string;
  setSafeCheckoutText: (val: string) => void;
  safeCheckoutMethods: string[];
  setSafeCheckoutMethods: (updateFn: (prev: string[]) => string[]) => void;
  
  trustBadge1Title: string;
  setTrustBadge1Title: (val: string) => void;
  trustBadge1Desc: string;
  setTrustBadge1Desc: (val: string) => void;
  trustBadge1Icon: string;
  setTrustBadge1Icon: (val: string) => void;
  trustBadge1Enabled: boolean;
  setTrustBadge1Enabled: (val: boolean) => void;

  trustBadge2Title: string;
  setTrustBadge2Title: (val: string) => void;
  trustBadge2Desc: string;
  setTrustBadge2Desc: (val: string) => void;
  trustBadge2Icon: string;
  setTrustBadge2Icon: (val: string) => void;
  trustBadge2Enabled: boolean;
  setTrustBadge2Enabled: (val: boolean) => void;

  trustBadge3Title: string;
  setTrustBadge3Title: (val: string) => void;
  trustBadge3Desc: string;
  setTrustBadge3Desc: (val: string) => void;
  trustBadge3Icon: string;
  setTrustBadge3Icon: (val: string) => void;
  trustBadge3Enabled: boolean;
  setTrustBadge3Enabled: (val: boolean) => void;

  trustBadge4Title: string;
  setTrustBadge4Title: (val: string) => void;
  trustBadge4Desc: string;
  setTrustBadge4Desc: (val: string) => void;
  trustBadge4Icon: string;
  setTrustBadge4Icon: (val: string) => void;
  trustBadge4Enabled: boolean;
  setTrustBadge4Enabled: (val: boolean) => void;
}

export default function TrustTab({
  enableFakeViews,
  setEnableFakeViews,
  minViews,
  setMinViews,
  maxViews,
  setMaxViews,
  enableTrustBadges,
  setEnableTrustBadges,
  deliveryEstimateText,
  setDeliveryEstimateText,
  freeShippingText,
  setFreeShippingText,
  promoCodeText,
  setPromoCodeText,
  safeCheckoutText,
  setSafeCheckoutText,
  safeCheckoutMethods,
  setSafeCheckoutMethods,
  
  trustBadge1Title,
  setTrustBadge1Title,
  trustBadge1Desc,
  setTrustBadge1Desc,
  trustBadge1Icon,
  setTrustBadge1Icon,
  trustBadge1Enabled,
  setTrustBadge1Enabled,

  trustBadge2Title,
  setTrustBadge2Title,
  trustBadge2Desc,
  setTrustBadge2Desc,
  trustBadge2Icon,
  setTrustBadge2Icon,
  trustBadge2Enabled,
  setTrustBadge2Enabled,

  trustBadge3Title,
  setTrustBadge3Title,
  trustBadge3Desc,
  setTrustBadge3Desc,
  trustBadge3Icon,
  setTrustBadge3Icon,
  trustBadge3Enabled,
  setTrustBadge3Enabled,

  trustBadge4Title,
  setTrustBadge4Title,
  trustBadge4Desc,
  setTrustBadge4Desc,
  trustBadge4Icon,
  setTrustBadge4Icon,
  trustBadge4Enabled,
  setTrustBadge4Enabled,
}: TrustTabProps) {
  
  const renderSettingsBadgeIcon = (iconName: string) => {
    const IconComponent = (CentralIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="h-5 w-5 text-[#e94560]" />;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Live Views & Trust Badge Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Fake Views Config */}
          <div className="space-y-4 border-r border-gray-100 dark:border-gray-800/80 pr-0 md:pr-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Enable Live Viewer Counter</span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enableFakeViews}
                  onChange={(e) => setEnableFakeViews(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e94560]" />
              </label>
            </div>

            {enableFakeViews && (
              <div className="grid grid-cols-2 gap-4 pt-2 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Minimum Viewers</label>
                  <input
                    type="number"
                    min="1"
                    value={minViews}
                    onChange={(e) => setMinViews(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Maximum Viewers</label>
                  <input
                    type="number"
                    min="1"
                    value={maxViews}
                    onChange={(e) => setMaxViews(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Trust Badges Config */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Enable Trust Badges</span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enableTrustBadges}
                  onChange={(e) => setEnableTrustBadges(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e94560]" />
              </label>
            </div>

            {enableTrustBadges && (
              <div className="space-y-3 pt-1 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Delivery Estimate Text</label>
                  <input
                    type="text"
                    value={deliveryEstimateText}
                    onChange={(e) => setDeliveryEstimateText(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Free Shipping & Returns Text</label>
                  <input
                    type="text"
                    value={freeShippingText}
                    onChange={(e) => setFreeShippingText(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Promo Code Discount Text</label>
                  <input
                    type="text"
                    value={promoCodeText}
                    onChange={(e) => setPromoCodeText(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                  />
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Safe Checkout Title</label>
                  <input
                    type="text"
                    value={safeCheckoutText}
                    onChange={(e) => setSafeCheckoutText(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                  />

                  {/* Checkboxes for payment methods */}
                  <div className="pt-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Payment Badges to Display</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1.5">
                      {([
                        { code: 'visa', label: 'Visa' },
                        { code: 'mastercard', label: 'Mastercard' },
                        { code: 'amex', label: 'Amex' },
                        { code: 'paypal', label: 'PayPal' },
                        { code: 'klarna', label: 'Klarna' },
                        { code: 'cirrus', label: 'Cirrus' },
                        { code: 'westernunion', label: 'Western Union' },
                        { code: 'cod', label: '💵 Cash on Delivery' },
                        { code: 'easypaisa', label: 'EasyPaisa' },
                        { code: 'jazzcash', label: 'JazzCash' },
                        { code: 'banktransfer', label: '🏦 Bank Transfer' },
                      ] as { code: string; label: string }[]).map(({ code, label }) => {
                        const isChecked = safeCheckoutMethods.includes(code);
                        return (
                          <label key={code} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300 select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setSafeCheckoutMethods(prev =>
                                  isChecked ? prev.filter(m => m !== code) : [...prev, code]
                                );
                              }}
                              className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-3.5 w-3.5"
                            />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Homepage Trust Badges Config */}
          <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors mt-6 col-span-1 md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Shopify-Style Homepage Trust Badges</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Configure the 4 feature/trust badge cards displayed above the footer on the storefront landing page.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setTrustBadge1Enabled(true);
                    setTrustBadge2Enabled(true);
                    setTrustBadge3Enabled(true);
                    setTrustBadge4Enabled(true);
                    toast.success('All homepage trust badges enabled');
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Enable All
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrustBadge1Enabled(false);
                    setTrustBadge2Enabled(false);
                    setTrustBadge3Enabled(false);
                    setTrustBadge4Enabled(false);
                    toast.success('All homepage trust badges disabled');
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Disable All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Card 1 */}
              <div className={`p-4 border rounded-xl space-y-3 transition-all ${trustBadge1Enabled ? 'border-gray-200 dark:border-gray-800 bg-gray-50/20 dark:bg-white/5' : 'border-gray-200 dark:border-gray-800/40 bg-gray-50/5 dark:bg-white/1 opacity-50'}`}>
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="text-xs font-bold text-[#e94560] uppercase tracking-wider">Badge Card 1</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={trustBadge1Enabled}
                      onChange={(e) => setTrustBadge1Enabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="mt-4 p-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center shrink-0">
                        {renderSettingsBadgeIcon(trustBadge1Icon)}
                      </div>
                      <div className="flex-grow">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Title</label>
                        <input
                          type="text"
                          disabled={!trustBadge1Enabled}
                          value={trustBadge1Title}
                          onChange={(e) => setTrustBadge1Title(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Icon</label>
                    <select
                      disabled={!trustBadge1Enabled}
                      value={trustBadge1Icon}
                      onChange={(e) => setTrustBadge1Icon(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                    >
                      {['Truck', 'Shield', 'RefreshCw', 'Phone', 'HelpCircle', 'Award', 'Star', 'Lock', 'Clock', 'Gift', 'Headphones'].map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Description</label>
                  <input
                    type="text"
                    disabled={!trustBadge1Enabled}
                    value={trustBadge1Desc}
                    onChange={(e) => setTrustBadge1Desc(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Card 2 */}
              <div className={`p-4 border rounded-xl space-y-3 transition-all ${trustBadge2Enabled ? 'border-gray-200 dark:border-gray-800 bg-gray-50/20 dark:bg-white/5' : 'border-gray-200 dark:border-gray-800/40 bg-gray-50/5 dark:bg-white/1 opacity-50'}`}>
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="text-xs font-bold text-[#e94560] uppercase tracking-wider">Badge Card 2</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={trustBadge2Enabled}
                      onChange={(e) => setTrustBadge2Enabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="mt-4 p-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center shrink-0">
                        {renderSettingsBadgeIcon(trustBadge2Icon)}
                      </div>
                      <div className="flex-grow">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Title</label>
                        <input
                          type="text"
                          disabled={!trustBadge2Enabled}
                          value={trustBadge2Title}
                          onChange={(e) => setTrustBadge2Title(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Icon</label>
                    <select
                      disabled={!trustBadge2Enabled}
                      value={trustBadge2Icon}
                      onChange={(e) => setTrustBadge2Icon(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                    >
                      {['Truck', 'Shield', 'RefreshCw', 'Phone', 'HelpCircle', 'Award', 'Star', 'Lock', 'Clock', 'Gift', 'Headphones'].map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Description</label>
                  <input
                    type="text"
                    disabled={!trustBadge2Enabled}
                    value={trustBadge2Desc}
                    onChange={(e) => setTrustBadge2Desc(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Card 3 */}
              <div className={`p-4 border rounded-xl space-y-3 transition-all ${trustBadge3Enabled ? 'border-gray-200 dark:border-gray-800 bg-gray-50/20 dark:bg-white/5' : 'border-gray-200 dark:border-gray-800/40 bg-gray-50/5 dark:bg-white/1 opacity-50'}`}>
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="text-xs font-bold text-[#e94560] uppercase tracking-wider">Badge Card 3</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={trustBadge3Enabled}
                      onChange={(e) => setTrustBadge3Enabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="mt-4 p-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center shrink-0">
                        {renderSettingsBadgeIcon(trustBadge3Icon)}
                      </div>
                      <div className="flex-grow">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Title</label>
                        <input
                          type="text"
                          disabled={!trustBadge3Enabled}
                          value={trustBadge3Title}
                          onChange={(e) => setTrustBadge3Title(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Icon</label>
                    <select
                      disabled={!trustBadge3Enabled}
                      value={trustBadge3Icon}
                      onChange={(e) => setTrustBadge3Icon(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                    >
                      {['Truck', 'Shield', 'RefreshCw', 'Phone', 'HelpCircle', 'Award', 'Star', 'Lock', 'Clock', 'Gift', 'Headphones'].map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Description</label>
                  <input
                    type="text"
                    disabled={!trustBadge3Enabled}
                    value={trustBadge3Desc}
                    onChange={(e) => setTrustBadge3Desc(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Card 4 */}
              <div className={`p-4 border rounded-xl space-y-3 transition-all ${trustBadge4Enabled ? 'border-gray-200 dark:border-gray-800 bg-gray-50/20 dark:bg-white/5' : 'border-gray-200 dark:border-gray-800/40 bg-gray-50/5 dark:bg-white/1 opacity-50'}`}>
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="text-xs font-bold text-[#e94560] uppercase tracking-wider">Badge Card 4</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={trustBadge4Enabled}
                      onChange={(e) => setTrustBadge4Enabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="mt-4 p-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center shrink-0">
                        {renderSettingsBadgeIcon(trustBadge4Icon)}
                      </div>
                      <div className="flex-grow">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Title</label>
                        <input
                          type="text"
                          disabled={!trustBadge4Enabled}
                          value={trustBadge4Title}
                          onChange={(e) => setTrustBadge4Title(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Icon</label>
                    <select
                      disabled={!trustBadge4Enabled}
                      value={trustBadge4Icon}
                      onChange={(e) => setTrustBadge4Icon(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                    >
                      {['Truck', 'Shield', 'RefreshCw', 'Phone', 'HelpCircle', 'Award', 'Star', 'Lock', 'Clock', 'Gift', 'Headphones'].map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Description</label>
                  <input
                    type="text"
                    disabled={!trustBadge4Enabled}
                    value={trustBadge4Desc}
                    onChange={(e) => setTrustBadge4Desc(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
