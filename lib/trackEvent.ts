'use client';

/**
 * Fires standard e-commerce events across all loaded third-party tracking pixels.
 * Safe to call in client-side components.
 * 
 * Supported events: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase, Search
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  try {
    const w = window as any;

    // 1. Meta Pixel (Facebook)
    if (typeof w.fbq === 'function') {
      w.fbq('track', eventName, params);
    }

    // 2. Google Analytics (GA4)
    if (typeof w.gtag === 'function') {
      // Map meta events to standard ga4 event names if necessary
      let gaEvent = eventName;
      if (eventName === 'ViewContent') gaEvent = 'view_item';
      else if (eventName === 'AddToCart') gaEvent = 'add_to_cart';
      else if (eventName === 'InitiateCheckout') gaEvent = 'begin_checkout';
      else if (eventName === 'Purchase') gaEvent = 'purchase';
      else if (eventName === 'Search') gaEvent = 'search';

      w.gtag('event', gaEvent, params);
    }

    // 3. TikTok Pixel
    if (typeof w.ttq === 'object' && typeof w.ttq.track === 'function') {
      w.ttq.track(eventName, params);
    }

    // 4. Snapchat Pixel
    if (typeof w.snaptr === 'function') {
      // Map standard snapchat event names
      let snapEvent = eventName;
      if (eventName === 'PageView') snapEvent = 'PAGE_VIEW';
      else if (eventName === 'ViewContent') snapEvent = 'VIEW_CONTENT';
      else if (eventName === 'AddToCart') snapEvent = 'ADD_CART';
      else if (eventName === 'InitiateCheckout') snapEvent = 'START_CHECKOUT';
      else if (eventName === 'Purchase') snapEvent = 'PURCHASE';
      else if (eventName === 'Search') snapEvent = 'SEARCH';

      w.snaptr('track', snapEvent, params);
    }

    // 5. Pinterest Tag
    if (typeof w.pintrk === 'function') {
      w.pintrk('track', eventName, params);
    }

    // 6. Twitter/X Pixel
    if (typeof w.twq === 'function') {
      w.twq('track', eventName, params);
    }

    console.log(`[Tracking] Event "${eventName}" fired with params:`, params);
  } catch (error) {
    console.error(`[Tracking] Error triggering event "${eventName}":`, error);
  }
}
