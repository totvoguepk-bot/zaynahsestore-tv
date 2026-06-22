'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

/**
 * RULE NAV1 — ADMIN TAB STATE PERSISTENCE
 * 
 * Feature name: "URL-Based Tab State Persistence"
 * 
 * How it works:
 * - Active tab is stored in URL as a search param: `?tab=xxx`
 * - On refresh: URL already has the tab → page opens on the same tab
 * - On back button: browser restores previous URL → tab auto-restores
 * - No sessionStorage needed — URL IS the state
 * 
 * Usage:
 *   const [activeTab, setActiveTab] = useAdminTab('tab', 'all');
 * 
 * @param paramName  - URL param name (default: 'tab')
 * @param defaultTab - Default tab value if no param in URL
 */
export function useAdminTab<T extends string>(
  defaultTab: T,
  paramName: string = 'tab'
): [T, (tab: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = (searchParams.get(paramName) as T) || defaultTab;

  const setTab = useCallback(
    (tab: T) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === defaultTab) {
        params.delete(paramName);
      } else {
        params.set(paramName, tab);
      }
      const query = params.toString();
      router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
    },
    [router, pathname, searchParams, paramName, defaultTab]
  );

  return [currentTab, setTab];
}

/**
 * For components that cannot use useSearchParams directly (non-Suspense contexts),
 * use sessionStorage as a fallback for tab persistence.
 * 
 * Usage:
 *   const [activeTab, setActiveTab] = useAdminTabSession('products-tab', 'all');
 */
export function useAdminTabSession<T extends string>(
  storageKey: string,
  defaultTab: T
): [T, (tab: T) => void] {
  const [activeTab, setActiveTabState] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultTab;
    return (sessionStorage.getItem(storageKey) as T) || defaultTab;
  });

  const setTab = useCallback((tab: T) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(storageKey, tab);
    }
  }, [storageKey]);

  // Sync on mount (handles tab closing and re-opening same page)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = sessionStorage.getItem(storageKey) as T | null;
    if (saved) setActiveTabState(saved);
  }, [storageKey]);

  return [activeTab, setTab];
}
