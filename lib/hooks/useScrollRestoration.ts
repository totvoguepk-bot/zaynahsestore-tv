'use client';

import { useEffect } from 'react';

const SCROLL_KEY = 'store_scroll_restore';

export interface ScrollRestoreData {
  scrollY: number;
  productId: string;
  path: string;
}

/** Call before navigating to product detail — saves current scroll + product id */
export const saveScrollPosition = (productId: string) => {
  if (typeof window === 'undefined') return;
  const data: ScrollRestoreData = {
    scrollY: window.scrollY,
    productId,
    path: window.location.pathname + window.location.search,
  };
  sessionStorage.setItem(SCROLL_KEY, JSON.stringify(data));
};

/** Used in listing pages — restores scroll & focuses product card on back navigation */
export const useScrollRestoration = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = sessionStorage.getItem(SCROLL_KEY);
    if (!raw) return;

    try {
      const data: ScrollRestoreData = JSON.parse(raw);
      const currentPath = window.location.pathname + window.location.search;

      // Only restore if we came back to the same page
      if (data.path !== currentPath) return;

      sessionStorage.removeItem(SCROLL_KEY);

      // Wait for DOM/images to settle
      const restore = () => {
        // 1. Scroll to saved position
        window.scrollTo({ top: data.scrollY, behavior: 'instant' });

        // 2. Focus/highlight the product card that was clicked
        const card = document.getElementById(`product-card-${data.productId}`);
        if (card) {
          card.focus({ preventScroll: true });
          card.classList.add('scroll-restore-highlight');
          setTimeout(() => card.classList.remove('scroll-restore-highlight'), 1200);
        }
      };

      // Double RAF ensures layout is painted
      requestAnimationFrame(() => requestAnimationFrame(restore));
    } catch {
      sessionStorage.removeItem(SCROLL_KEY);
    }
  }, []);
};
