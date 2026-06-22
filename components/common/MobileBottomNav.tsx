'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, ShoppingBag, Heart, ShoppingCart } from '@/components/common/Icons';
import { useCart } from '@/lib/hooks/useCart';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const totalItems = useCart((state) => state.totalItems());
  const [mounted, setMounted] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [customerSession, setCustomerSession] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };

    updateWishlistCount();

    window.addEventListener('wishlist-updated', updateWishlistCount);
    return () => {
      window.removeEventListener('wishlist-updated', updateWishlistCount);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadSession() {
      try {
        const { getCustomerProfile } = await import('@/lib/services/customers');
        const profile = await getCustomerProfile();
        setCustomerSession(profile);
      } catch (err) {
        console.error('Failed to load session in bottom nav:', err);
      }
    }
    loadSession();
  }, [mounted]);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Account', href: customerSession ? '/account' : '/login', icon: User },
    { label: 'Shop', href: '/shop', icon: ShoppingBag },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badgeCount: wishlistCount },
    { label: 'Cart', href: '/cart', icon: ShoppingCart, badgeCount: totalItems },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#16162a] border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden transition-colors duration-200">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === 'Account'
            ? (pathname === '/account' || pathname === '/login' || pathname === '/signup')
            : pathname === item.href || (item.href === '/shop' && pathname === '/shop');
          return (
            <Link
              key={item.href}
              href={item.href}
              id={
                item.label === 'Wishlist' ? 'mobile-bottom-wishlist-icon' :
                item.label === 'Cart' ? 'mobile-bottom-cart-icon' :
                undefined
              }
              className={`flex flex-col items-center justify-center flex-1 h-full relative text-[10px] font-bold transition-colors ${
                isActive
                  ? 'text-[#e94560]'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className="h-5.5 w-5.5 mb-0.5 shrink-0" />
                {mounted && item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#e94560] text-[8px] font-black text-white ring-2 ring-white dark:ring-[#16162a]">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span className="mt-0.5 tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
