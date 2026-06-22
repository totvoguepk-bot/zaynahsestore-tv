'use client';

import React from 'react';

interface PixelsTabProps {
  metaPixelId: string;
  setMetaPixelId: (val: string) => void;
  ga4MeasurementId: string;
  setGa4MeasurementId: (val: string) => void;
  gtmContainerId: string;
  setGtmContainerId: (val: string) => void;
  tiktokPixelId: string;
  setTiktokPixelId: (val: string) => void;
  twitterPixelId: string;
  setTwitterPixelId: (val: string) => void;
  snapchatPixelId: string;
  setSnapchatPixelId: (val: string) => void;
  pinterestTagId: string;
  setPinterestTagId: (val: string) => void;
  twitterHandle: string;
  setTwitterHandle: (val: string) => void;
  metaTitleSuffix: string;
  setMetaTitleSuffix: (val: string) => void;
  metaTitle: string;
  setMetaTitle: (val: string) => void;
  metaDescription: string;
  setMetaDescription: (val: string) => void;
  metaSyncEnabled: boolean;
  setMetaSyncEnabled: (val: boolean) => void;
}

export default function PixelsTab({
  metaPixelId,
  setMetaPixelId,
  ga4MeasurementId,
  setGa4MeasurementId,
  gtmContainerId,
  setGtmContainerId,
  tiktokPixelId,
  setTiktokPixelId,
  twitterPixelId,
  setTwitterPixelId,
  snapchatPixelId,
  setSnapchatPixelId,
  pinterestTagId,
  setPinterestTagId,
  twitterHandle,
  setTwitterHandle,
  metaTitleSuffix,
  setMetaTitleSuffix,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  metaSyncEnabled,
  setMetaSyncEnabled,
}: PixelsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Search Engine Optimization (SEO) & Social Settings */}
      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 transition-colors">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">SEO & Social Meta</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Configure how your site title is displayed in search results and social cards.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Homepage Meta Title (SEO Title)
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="e.g. Zaynahs E-Store | Kids Premium Clothing"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
            />
            <span className="text-[10px] text-gray-450 dark:text-gray-500 mt-1 block">
              Leave blank to default to Store Name (e.g. "{metaTitle || 'TotVogue.pk'}").
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Homepage Meta Description (SEO Description)
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="e.g. Shop the best premium quality kids wear, boys and girls clothing in Pakistan. Best fabric and designs with fast WhatsApp checkout."
              rows={4}
              maxLength={160}
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all resize-none"
            />
            <div className="flex justify-between text-[10px] text-gray-450 dark:text-gray-500 mt-1">
              <span>Google search snippets main show hone wali summary text.</span>
              <span className={metaDescription.length > 160 ? 'text-red-500 font-bold' : ''}>
                {metaDescription.length} / 160 chars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Meta Title Suffix (e.g. " | Zaynahs")
            </label>
            <input
              type="text"
              value={metaTitleSuffix}
              onChange={(e) => setMetaTitleSuffix(e.target.value)}
              placeholder="e.g.  | Zaynahs"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Twitter / X Handle (e.g. "@zaynahs_pk")
            </label>
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              placeholder="e.g. @zaynahs_pk"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Analytics & Tracking Pixels */}
      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 transition-colors">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Tracking & Analytics Pixels</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter pixel IDs to automatically capture PageView, ViewContent, AddToCart, InitiateCheckout, and Purchase events.
        </p>

        <div className="space-y-4">
          {/* Meta Catalog Sync Toggle */}
          <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-gray-50/50 dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 transition-colors">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Meta Catalog Syncing
              </label>
              <span className="text-[10px] text-gray-450 dark:text-gray-550 block mt-0.5 font-semibold">
                Sync store products and categories directly to Meta Product Catalog.
              </span>
            </div>
            <input
              type="checkbox"
              checked={metaSyncEnabled}
              onChange={(e) => setMetaSyncEnabled(e.target.checked)}
              className="w-10 h-6 rounded-full bg-gray-200 dark:bg-gray-800 checked:bg-[#e94560] appearance-none cursor-pointer transition-all relative after:content-[''] after:absolute after:h-5 after:w-5 after:bg-white after:rounded-full after:top-[2px] after:left-[2px] checked:after:left-[18px] after:transition-all shrink-0"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Meta Pixel ID (Facebook)
            </label>
            <input
              type="text"
              value={metaPixelId}
              onChange={(e) => setMetaPixelId(e.target.value)}
              placeholder="e.g. 1234567890"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Google Analytics 4 (GA4) Measurement ID
            </label>
            <input
              type="text"
              value={ga4MeasurementId}
              onChange={(e) => setGa4MeasurementId(e.target.value)}
              placeholder="e.g. G-XXXXXXX"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Google Tag Manager (GTM) Container ID
            </label>
            <input
              type="text"
              value={gtmContainerId}
              onChange={(e) => setGtmContainerId(e.target.value)}
              placeholder="e.g. GTM-XXXXXXX"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              TikTok Pixel ID
            </label>
            <input
              type="text"
              value={tiktokPixelId}
              onChange={(e) => setTiktokPixelId(e.target.value)}
              placeholder="e.g. CXXXXXXXXXXXXXXXXXXX"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Snapchat Pixel ID
            </label>
            <input
              type="text"
              value={snapchatPixelId}
              onChange={(e) => setSnapchatPixelId(e.target.value)}
              placeholder="e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Pinterest Tag ID
            </label>
            <input
              type="text"
              value={pinterestTagId}
              onChange={(e) => setPinterestTagId(e.target.value)}
              placeholder="e.g. 26XXXXXXXXXXX"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Twitter / X Pixel ID
            </label>
            <input
              type="text"
              value={twitterPixelId}
              onChange={(e) => setTwitterPixelId(e.target.value)}
              placeholder="e.g. xxxxx"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
