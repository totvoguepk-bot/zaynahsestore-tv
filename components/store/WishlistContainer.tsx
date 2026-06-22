'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from '@/components/common/Icons';
import { Product, StoreSettings } from '@/lib/types';
import ProductGrid from './ProductGrid';
import { useScrollRestoration } from '@/lib/hooks/useScrollRestoration';

interface WishlistContainerProps {
  products: Product[];
  settings: StoreSettings;
}

export default function WishlistContainer({ products, settings }: WishlistContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [wishlistedProducts, setWishlistedProducts] = useState<Product[]>([]);
  useScrollRestoration();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadWishlist = () => {
      const wishlistIds: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const filtered = products.filter(p => wishlistIds.includes(p.id));
      setWishlistedProducts(filtered);
    };

    loadWishlist();

    // Listen for changes
    window.addEventListener('wishlist-updated', loadWishlist);
    return () => {
      window.removeEventListener('wishlist-updated', loadWishlist);
    };
  }, [mounted, products]);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto" />
          <div className="h-64 w-full bg-gray-100 dark:bg-gray-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 min-h-[60vh]">
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          My Wishlist
        </h1>
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
          {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {wishlistedProducts.length > 0 ? (
        <div className="animate-fade-in">
          <ProductGrid products={wishlistedProducts} currencySymbol={settings.currencySymbol} settings={settings} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-white dark:bg-[#16162a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-8 transition-colors">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 text-red-500">
            <Heart className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your wishlist is empty</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Explore our catalog and tap the heart icon on your favorite items to save them here.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1a1a2e] hover:bg-[#e94560] active:scale-95 text-white px-5 py-3 text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span>Go Shopping</span>
          </Link>
        </div>
      )}
    </div>
  );
}
