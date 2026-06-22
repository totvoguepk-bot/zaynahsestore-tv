'use client';

import React from 'react';
import { StoreSettings } from '@/lib/types';

interface GlobalSettingsProps {
  settings: StoreSettings;
  onUpdateSettings: (updates: Partial<StoreSettings>) => void;
  subTab: 'header' | 'footer' | 'branding';
  onSelectMedia: (fieldKey: string) => void;
}

export default function GlobalSettings({
  settings,
  onUpdateSettings,
  subTab,
  onSelectMedia
}: GlobalSettingsProps) {
  if (subTab === 'branding') {
    return (
      <div className="space-y-4">
        {/* Favicon Selector */}
        <div className="space-y-1.5 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Favicon Icon URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={settings.faviconUrl || ''}
              onChange={(e) => onUpdateSettings({ faviconUrl: e.target.value })}
              placeholder="Favicon Image URL"
              className="flex-1 px-3 py-2 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => onSelectMedia('faviconUrl')}
              className="px-3 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 hover:dark:bg-white/15 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Select
            </button>
          </div>
          <span className="text-[9px] text-gray-400 dark:text-gray-500 block mt-1 leading-normal">
            PNG ya ICO formats dono support hote hain. Favicon update browser cache clear karne ke baad dikhta hai.
          </span>
        </div>

        {/* Logo Selector */}
        <div className="space-y-1.5 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Logo Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={settings.logoUrl || ''}
              onChange={(e) => onUpdateSettings({ logoUrl: e.target.value })}
              placeholder="Logo Image URL"
              className="flex-1 px-3 py-2 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => onSelectMedia('logoUrl')}
              className="px-3 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 hover:dark:bg-white/15 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Select
            </button>
          </div>

          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-[11px] font-bold text-gray-500">
              <span>Logo Display Width</span>
              <span className="text-[#e94560]">{settings.logoWidth || 120}px</span>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              step="10"
              value={settings.logoWidth || 120}
              onChange={(e) => onUpdateSettings({ logoWidth: parseInt(e.target.value) })}
              className="w-full accent-[#e94560]"
            />
          </div>
        </div>
      </div>
    );
  }

  if (subTab === 'header') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Sticky Header (Desktop)</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.headerStickyDesktop ?? true}
              onChange={(e) => onUpdateSettings({ headerStickyDesktop: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Sticky Header (Mobile)</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.headerStickyMobile ?? true}
              onChange={(e) => onUpdateSettings({ headerStickyMobile: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Show Contact Announcement Bar</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.headerShowTopBar}
              onChange={(e) => onUpdateSettings({ headerShowTopBar: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        {settings.headerShowTopBar && (
          <div className="space-y-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500">Header Bar Phone</label>
              <input
                type="text"
                value={settings.headerTopBarPhone || ''}
                onChange={(e) => onUpdateSettings({ headerTopBarPhone: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 rounded-lg text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500">Header Bar Email</label>
              <input
                type="text"
                value={settings.headerTopBarEmail || ''}
                onChange={(e) => onUpdateSettings({ headerTopBarEmail: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 rounded-lg text-xs"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Show Marketing Announcement Bar</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.headerShowNewsletter}
              onChange={(e) => onUpdateSettings({ headerShowNewsletter: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
          </label>
        </div>

        {settings.headerShowNewsletter && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Announcement Text</label>
            <textarea
              rows={2}
              value={settings.headerNewsletterText || ''}
              onChange={(e) => onUpdateSettings({ headerNewsletterText: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white resize-none"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Footer Copyright text</label>
        <input
          type="text"
          value={settings.footerBottomText || ''}
          onChange={(e) => onUpdateSettings({ footerBottomText: e.target.value })}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] px-3 py-2 text-xs font-semibold focus:outline-none"
        />
      </div>

      <div className="space-y-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block mb-1">Social Accounts</span>
        
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 block">Instagram Link</label>
          <input
            type="text"
            value={settings.socialInstagram || ''}
            onChange={(e) => onUpdateSettings({ socialInstagram: e.target.value })}
            placeholder="e.g. https://instagram.com/username"
            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 rounded-lg text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 block">Facebook Link</label>
          <input
            type="text"
            value={settings.socialFacebook || ''}
            onChange={(e) => onUpdateSettings({ socialFacebook: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 rounded-lg text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 block">TikTok Link</label>
          <input
            type="text"
            value={settings.socialTiktok || ''}
            onChange={(e) => onUpdateSettings({ socialTiktok: e.target.value })}
            placeholder="e.g. https://www.tiktok.com/@username"
            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 rounded-lg text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 block">Snapchat Link</label>
          <input
            type="text"
            value={settings.socialSnapchat || ''}
            onChange={(e) => onUpdateSettings({ socialSnapchat: e.target.value })}
            placeholder="e.g. https://snapchat.com/add/username"
            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 rounded-lg text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 block">Twitter (X) Link</label>
          <input
            type="text"
            value={settings.socialTwitter || ''}
            onChange={(e) => onUpdateSettings({ socialTwitter: e.target.value })}
            placeholder="e.g. https://twitter.com/username"
            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 rounded-lg text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 block">YouTube Link</label>
          <input
            type="text"
            value={settings.socialYoutube || ''}
            onChange={(e) => onUpdateSettings({ socialYoutube: e.target.value })}
            placeholder="e.g. https://youtube.com/@channel"
            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 rounded-lg text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 block">WhatsApp Contact Number</label>
          <input
            type="text"
            value={settings.socialWhatsapp || ''}
            onChange={(e) => onUpdateSettings({ socialWhatsapp: e.target.value })}
            placeholder="e.g. 923001234567"
            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 rounded-lg text-xs"
          />
          <p className="text-[9px] text-gray-400 leading-normal">
            Format: 923001234567 (no spaces or +).
          </p>
        </div>
      </div>
    </div>
  );
}
