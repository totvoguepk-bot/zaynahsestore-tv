'use client';

import React from 'react';

interface WhatsappTabProps {
  whatsappGreeting: string;
  setWhatsappGreeting: (val: string) => void;
  whatsappFooter: string;
  setWhatsappFooter: (val: string) => void;
}

export default function WhatsappTab({
  whatsappGreeting,
  setWhatsappGreeting,
  whatsappFooter,
  setWhatsappFooter,
}: WhatsappTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 transition-colors">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">WhatsApp Message Customization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">WhatsApp Greeting / Header</label>
            <textarea
              value={whatsappGreeting}
              onChange={(e) => setWhatsappGreeting(e.target.value)}
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all resize-none"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-1">This goes above the cart item list in the WhatsApp message text</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">WhatsApp Footer / Confirmation line</label>
            <textarea
              value={whatsappFooter}
              onChange={(e) => setWhatsappFooter(e.target.value)}
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all resize-none"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-1">This goes at the very end of the message as a confirmation prompt</p>
          </div>
        </div>
      </div>
    </div>
  );
}
