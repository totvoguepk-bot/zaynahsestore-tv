'use client';

import React from 'react';

interface HeaderTabProps {
  headerSticky: boolean;
  setHeaderSticky: (val: boolean) => void;
  headerStickyDesktop: boolean;
  setHeaderStickyDesktop: (val: boolean) => void;
  headerStickyMobile: boolean;
  setHeaderStickyMobile: (val: boolean) => void;
  headerShowTopBar: boolean;
  setHeaderShowTopBar: (val: boolean) => void;
  headerShowNewsletter: boolean;
  setHeaderShowNewsletter: (val: boolean) => void;
  headerTopBarPhone: string;
  setHeaderTopBarPhone: (val: string) => void;
  headerTopBarEmail: string;
  setHeaderTopBarEmail: (val: string) => void;
  headerNewsletterText: string;
  setHeaderNewsletterText: (val: string) => void;

  headerDesktopLogoAlign: 'left' | 'center' | 'right';
  setHeaderDesktopLogoAlign: (val: 'left' | 'center' | 'right') => void;
  headerDesktopSearchAlign: 'left' | 'right' | 'hidden';
  setHeaderDesktopSearchAlign: (val: 'left' | 'right' | 'hidden') => void;
  headerDesktopWishlistAlign: 'left' | 'right' | 'hidden';
  setHeaderDesktopWishlistAlign: (val: 'left' | 'right' | 'hidden') => void;
  headerDesktopCartAlign: 'left' | 'right' | 'hidden';
  setHeaderDesktopCartAlign: (val: 'left' | 'right' | 'hidden') => void;
  headerDesktopThemeAlign: 'left' | 'right' | 'hidden';
  setHeaderDesktopThemeAlign: (val: 'left' | 'right' | 'hidden') => void;

  headerMobileMenuAlign: 'left' | 'right' | 'hidden';
  setHeaderMobileMenuAlign: (val: 'left' | 'right' | 'hidden') => void;
  headerMobileLogoAlign: 'left' | 'center' | 'right';
  setHeaderMobileLogoAlign: (val: 'left' | 'center' | 'right') => void;
  headerMobileSearchAlign: 'left' | 'right' | 'hidden';
  setHeaderMobileSearchAlign: (val: 'left' | 'right' | 'hidden') => void;
  headerMobileCartAlign: 'left' | 'right' | 'hidden';
  setHeaderMobileCartAlign: (val: 'left' | 'right' | 'hidden') => void;
  headerMobileWishlistAlign: 'left' | 'right' | 'hidden';
  setHeaderMobileWishlistAlign: (val: 'left' | 'right' | 'hidden') => void;

  headerTopBarBg: string;
  setHeaderTopBarBg: (val: string) => void;
  headerTopBarTextColor: string;
  setHeaderTopBarTextColor: (val: string) => void;
  headerBg: string;
  setHeaderBg: (val: string) => void;
  headerTextColor: string;
  setHeaderTextColor: (val: string) => void;
  headerBorderColor: string;
  setHeaderBorderColor: (val: string) => void;
  popularSearches: string;
  setPopularSearches: (val: string) => void;
}

export default function HeaderTab({
  headerSticky,
  setHeaderSticky,
  headerStickyDesktop,
  setHeaderStickyDesktop,
  headerStickyMobile,
  setHeaderStickyMobile,
  headerShowTopBar,
  setHeaderShowTopBar,
  headerShowNewsletter,
  setHeaderShowNewsletter,
  headerTopBarPhone,
  setHeaderTopBarPhone,
  headerTopBarEmail,
  setHeaderTopBarEmail,
  headerNewsletterText,
  setHeaderNewsletterText,
  headerDesktopLogoAlign,
  setHeaderDesktopLogoAlign,
  headerDesktopSearchAlign,
  setHeaderDesktopSearchAlign,
  headerDesktopWishlistAlign,
  setHeaderDesktopWishlistAlign,
  headerDesktopCartAlign,
  setHeaderDesktopCartAlign,
  headerDesktopThemeAlign,
  setHeaderDesktopThemeAlign,
  headerMobileMenuAlign,
  setHeaderMobileMenuAlign,
  headerMobileLogoAlign,
  setHeaderMobileLogoAlign,
  headerMobileSearchAlign,
  setHeaderMobileSearchAlign,
  headerMobileCartAlign,
  setHeaderMobileCartAlign,
  headerMobileWishlistAlign,
  setHeaderMobileWishlistAlign,
  headerTopBarBg,
  setHeaderTopBarBg,
  headerTopBarTextColor,
  setHeaderTopBarTextColor,
  headerBg,
  setHeaderBg,
  headerTextColor,
  setHeaderTextColor,
  headerBorderColor,
  setHeaderBorderColor,
  popularSearches,
  setPopularSearches,
}: HeaderTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
        <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Header Layout & Appearance Customizer</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Customize your storefront header's mobile and desktop structures, top bar info, newsletter, and color styling.</p>
        </div>

        {/* Sticky Behavior Option */}
        <div className="space-y-4 border-b border-gray-100 dark:border-gray-800 pb-4">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider text-gray-400">Sticky Behavior</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none text-gray-750 dark:text-gray-200">
              <input
                type="checkbox"
                checked={headerStickyDesktop}
                onChange={(e) => setHeaderStickyDesktop(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enable Sticky Header (Desktop)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none text-gray-750 dark:text-gray-200">
              <input
                type="checkbox"
                checked={headerStickyMobile}
                onChange={(e) => setHeaderStickyMobile(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enable Sticky Header (Mobile)</span>
            </label>
          </div>
        </div>

        {/* Part 1: Top Bar & Announcement */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider text-gray-400">Top Contact & Announcement Bar</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none text-gray-750 dark:text-gray-200">
              <input
                type="checkbox"
                checked={headerShowTopBar}
                onChange={(e) => setHeaderShowTopBar(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enable Contact Top Bar</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none text-gray-750 dark:text-gray-200">
              <input
                type="checkbox"
                checked={headerShowNewsletter}
                onChange={(e) => setHeaderShowNewsletter(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enable Announcement Ticker</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Top Bar Phone / WhatsApp</label>
              <input
                type="text"
                disabled={!headerShowTopBar}
                value={headerTopBarPhone}
                onChange={(e) => setHeaderTopBarPhone(e.target.value)}
                placeholder="e.g. 0328-4114551"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Top Bar Email</label>
              <input
                type="email"
                disabled={!headerShowTopBar}
                value={headerTopBarEmail}
                onChange={(e) => setHeaderTopBarEmail(e.target.value)}
                placeholder="e.g. support@store.com"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex justify-between items-center">
              <span>Announcement Ticker Text</span>
              <span className="text-[10px] text-gray-400 font-semibold lowercase">Enter multiple lines (one per line) to rotate them</span>
            </label>
            <textarea
              disabled={!headerShowNewsletter}
              value={headerNewsletterText}
              onChange={(e) => setHeaderNewsletterText(e.target.value)}
              placeholder="e.g. Free Delivery across Pakistan!&#10;Summer Sale Off 50%!&#10;Shop our new arrivals now!"
              rows={3}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white disabled:opacity-50 font-semibold"
            />
          </div>
        </div>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Part 2: Desktop Layout Customizer */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider text-gray-400">Desktop Header Element Placement</h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Logo</label>
              <select
                value={headerDesktopLogoAlign}
                onChange={(e) => setHeaderDesktopLogoAlign(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs focus:outline-none focus:border-[#e94560] text-gray-950 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Search Icon</label>
              <select
                value={headerDesktopSearchAlign}
                onChange={(e) => setHeaderDesktopSearchAlign(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs focus:outline-none focus:border-[#e94560] text-gray-955 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Wishlist Icon</label>
              <select
                value={headerDesktopWishlistAlign}
                onChange={(e) => setHeaderDesktopWishlistAlign(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs focus:outline-none focus:border-[#e94560] text-gray-955 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Cart Icon</label>
              <select
                value={headerDesktopCartAlign}
                onChange={(e) => setHeaderDesktopCartAlign(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs focus:outline-none focus:border-[#e94560] text-gray-955 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Theme Toggle</label>
              <select
                value={headerDesktopThemeAlign}
                onChange={(e) => setHeaderDesktopThemeAlign(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs focus:outline-none focus:border-[#e94560] text-gray-955 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Part 3: Mobile Layout Customizer */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider text-gray-400">Mobile Header Element Placement</h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Menu Button</label>
              <select
                value={headerMobileMenuAlign}
                onChange={(e) => setHeaderMobileMenuAlign(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs focus:outline-none focus:border-[#e94560] text-gray-955 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Logo</label>
              <select
                value={headerMobileLogoAlign}
                onChange={(e) => setHeaderMobileLogoAlign(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs focus:outline-none focus:border-[#e94560] text-gray-955 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Search Icon</label>
              <select
                value={headerMobileSearchAlign}
                onChange={(e) => setHeaderMobileSearchAlign(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs focus:outline-none focus:border-[#e94560] text-gray-955 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Cart Icon</label>
              <select
                value={headerMobileCartAlign}
                onChange={(e) => setHeaderMobileCartAlign(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs focus:outline-none focus:border-[#e94560] text-gray-955 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Wishlist Icon</label>
              <select
                value={headerMobileWishlistAlign}
                onChange={(e) => setHeaderMobileWishlistAlign(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs focus:outline-none focus:border-[#e94560] text-gray-955 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Popular Searches Config */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider text-gray-400">Popular Search Suggestions</h4>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Popular Searches (Comma-separated)
            </label>
            <input
              type="text"
              value={popularSearches}
              onChange={(e) => setPopularSearches(e.target.value)}
              placeholder="e.g. Co-ord Sets, Sonic, Graphic Tee, T-shirt, Kids"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
              style={{ borderWidth: 0 }}
            />
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Enter keywords separated by commas. These will appear in the search popup modal on the storefront under "Popular Searches".
            </p>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Part 4: Header Aesthetics & Styling */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider text-gray-400">Header Color Palette Customizer</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Color Item */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                <input
                  type="color"
                  value={headerTopBarBg}
                  onChange={(e) => setHeaderTopBarBg(e.target.value)}
                  className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Top Bar Background</label>
                <input
                  type="text"
                  value={headerTopBarBg}
                  onChange={(e) => setHeaderTopBarBg(e.target.value)}
                  className="mt-0.5 w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-850 focus:border-[#e94560] focus:ring-0 text-xs font-mono font-semibold text-gray-900 dark:text-white p-0"
                />
              </div>
            </div>

            {/* Color Item */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                <input
                  type="color"
                  value={headerTopBarTextColor}
                  onChange={(e) => setHeaderTopBarTextColor(e.target.value)}
                  className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Top Bar Text / Icons</label>
                <input
                  type="text"
                  value={headerTopBarTextColor}
                  onChange={(e) => setHeaderTopBarTextColor(e.target.value)}
                  className="mt-0.5 w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-850 focus:border-[#e94560] focus:ring-0 text-xs font-mono font-semibold text-gray-900 dark:text-white p-0"
                />
              </div>
            </div>

            {/* Color Item */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                <input
                  type="color"
                  value={headerBg}
                  onChange={(e) => setHeaderBg(e.target.value)}
                  className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Header Background</label>
                <input
                  type="text"
                  value={headerBg}
                  onChange={(e) => setHeaderBg(e.target.value)}
                  className="mt-0.5 w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-850 focus:border-[#e94560] focus:ring-0 text-xs font-mono font-semibold text-gray-900 dark:text-white p-0"
                />
              </div>
            </div>

            {/* Color Item */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                <input
                  type="color"
                  value={headerTextColor}
                  onChange={(e) => setHeaderTextColor(e.target.value)}
                  className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Header Text / Icons</label>
                <input
                  type="text"
                  value={headerTextColor}
                  onChange={(e) => setHeaderTextColor(e.target.value)}
                  className="mt-0.5 w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-850 focus:border-[#e94560] focus:ring-0 text-xs font-mono font-semibold text-gray-900 dark:text-white p-0"
                />
              </div>
            </div>

            {/* Color Item */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                <input
                  type="color"
                  value={headerBorderColor}
                  onChange={(e) => setHeaderBorderColor(e.target.value)}
                  className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Header Border Color</label>
                <input
                  type="text"
                  value={headerBorderColor}
                  onChange={(e) => setHeaderBorderColor(e.target.value)}
                  className="mt-0.5 w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-850 focus:border-[#e94560] focus:ring-0 text-xs font-mono font-semibold text-gray-900 dark:text-white p-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
