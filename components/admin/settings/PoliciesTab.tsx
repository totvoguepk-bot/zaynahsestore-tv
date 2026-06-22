'use client';

import React from 'react';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface PoliciesTabProps {
  faqContent: string;
  setFaqContent: (val: string) => void;
  returnPolicyContent: string;
  setReturnPolicyContent: (val: string) => void;
  privacyPolicyContent: string;
  setPrivacyPolicyContent: (val: string) => void;
  
  showFaqInNav: boolean;
  setShowFaqInNav: (val: boolean) => void;
  showReturnsInNav: boolean;
  setShowReturnsInNav: (val: boolean) => void;
  showPrivacyInNav: boolean;
  setShowPrivacyInNav: (val: boolean) => void;
  
  showFaqInFooter: boolean;
  setShowFaqInFooter: (val: boolean) => void;
  showReturnsInFooter: boolean;
  setShowReturnsInFooter: (val: boolean) => void;
  showPrivacyInFooter: boolean;
  setShowPrivacyInFooter: (val: boolean) => void;
}

export default function PoliciesTab({
  faqContent,
  setFaqContent,
  returnPolicyContent,
  setReturnPolicyContent,
  privacyPolicyContent,
  setPrivacyPolicyContent,
  showFaqInNav,
  setShowFaqInNav,
  showReturnsInNav,
  setShowReturnsInNav,
  showPrivacyInNav,
  setShowPrivacyInNav,
  showFaqInFooter,
  setShowFaqInFooter,
  showReturnsInFooter,
  setShowReturnsInFooter,
  showPrivacyInFooter,
  setShowPrivacyInFooter,
}: PoliciesTabProps) {

  // Helper toggle commands
  const handleToggleAllNav = (show: boolean) => {
    setShowFaqInNav(show);
    setShowReturnsInNav(show);
    setShowPrivacyInNav(show);
  };

  const handleToggleAllFooter = (show: boolean) => {
    setShowFaqInFooter(show);
    setShowReturnsInFooter(show);
    setShowPrivacyInFooter(show);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ====== VISIBILITY CONTROLS ====== */}
      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Policy Pages Visibility settings</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Control which policy links are displayed in the customer storefront Navbar (mobile drawer) and Footer columns.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Navbar Visibility group */}
          <div className="space-y-4 border-r border-gray-100 dark:border-gray-800/80 pr-0 md:pr-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#e94560] block uppercase tracking-wider">Mobile Navbar Menu links</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAllNav(true)}
                  className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-[#e94560] dark:hover:text-white cursor-pointer transition-colors"
                >
                  Show All
                </button>
                <span className="text-gray-300 dark:text-gray-700 text-xs">|</span>
                <button
                  type="button"
                  onClick={() => handleToggleAllNav(false)}
                  className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-[#e94560] dark:hover:text-white cursor-pointer transition-colors"
                >
                  Hide All
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* FAQ in Nav */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 transition-colors">
                <div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">FAQ Link</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Show FAQ link in mobile navigation</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showFaqInNav}
                    onChange={(e) => setShowFaqInNav(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                </label>
              </div>

              {/* Returns in Nav */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 transition-colors">
                <div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Return Policy Link</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Show Return Policy link in mobile navigation</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showReturnsInNav}
                    onChange={(e) => setShowReturnsInNav(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                </label>
              </div>

              {/* Privacy in Nav */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 transition-colors">
                <div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Privacy Policy Link</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Show Privacy Policy link in mobile navigation</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPrivacyInNav}
                    onChange={(e) => setShowPrivacyInNav(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                </label>
              </div>
            </div>
          </div>

          {/* Footer Visibility group */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#e94560] block uppercase tracking-wider">Footer Quick Links</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAllFooter(true)}
                  className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-[#e94560] dark:hover:text-white cursor-pointer transition-colors"
                >
                  Show All
                </button>
                <span className="text-gray-300 dark:text-gray-700 text-xs">|</span>
                <button
                  type="button"
                  onClick={() => handleToggleAllFooter(false)}
                  className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-[#e94560] dark:hover:text-white cursor-pointer transition-colors"
                >
                  Hide All
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* FAQ in Footer */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 transition-colors">
                <div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">FAQ Link</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Show FAQ link in Column 3 (Quick Links)</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showFaqInFooter}
                    onChange={(e) => setShowFaqInFooter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                </label>
              </div>

              {/* Returns in Footer */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 transition-colors">
                <div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Return Policy Link</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Show Return Policy link in Column 3 (Quick Links)</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showReturnsInFooter}
                    onChange={(e) => setShowReturnsInFooter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                </label>
              </div>

              {/* Privacy in Footer */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 transition-colors">
                <div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Privacy Policy Link</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Show Privacy Policy link in Column 3 (Quick Links)</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPrivacyInFooter}
                    onChange={(e) => setShowPrivacyInFooter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e94560]" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== POLICIES TEXT CONTENT EDITORS ====== */}
      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Policies & FAQ Content</h3>
        
        <div className="space-y-6">
          {/* FAQ Content Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Frequently Asked Questions (FAQ) Content</label>
            <RichTextEditor
              value={faqContent}
              onChange={setFaqContent}
              placeholder="<h3>Q: What is the delivery time?</h3><p>A: 3-5 working days.</p>"
              minHeight="240px"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-1">Supports HTML syntax. Displayed on the dynamic FAQ page route and product detail page tabs.</p>
          </div>

          {/* Return Policy Content Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Return & Exchange Policy Content</label>
            <RichTextEditor
              value={returnPolicyContent}
              onChange={setReturnPolicyContent}
              placeholder="<h3>Return Policy</h3><p>We offer 30 days free returns and exchanges.</p>"
              minHeight="240px"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-1">Supports HTML syntax. Displayed on the dynamic Return Policy page route and product detail page tabs.</p>
          </div>

          {/* Privacy Policy Content Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Privacy Policy Content</label>
            <RichTextEditor
              value={privacyPolicyContent}
              onChange={setPrivacyPolicyContent}
              placeholder="<h3>Privacy Policy</h3><p>We take your privacy seriously...</p>"
              minHeight="240px"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-1">Supports HTML syntax. Displayed on the dynamic Privacy Policy page route.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
