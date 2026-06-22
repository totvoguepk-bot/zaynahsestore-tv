'use client';

import Link from 'next/link';
import { Home, ShoppingBag, Store, ArrowRight } from '@/components/common/Icons';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] dark:bg-[#0f0f1b] p-4 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="max-w-md w-full text-center space-y-8 p-8 rounded-3xl bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden">
        {/* Decorative background grid/gradient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#e94560]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#e94560]/10 text-[#e94560] mb-2 animate-bounce">
            <span className="text-4xl font-black">404</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto">
            Oops! The page you are looking for does not exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="space-y-3 relative z-10 pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full min-h-[44px] px-6 py-3 rounded-xl bg-[#1a1a2e] dark:bg-[#e94560] text-white hover:bg-[#e94560] dark:hover:bg-[#e94560]/95 font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>

          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 w-full min-h-[44px] px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 w-full min-h-[44px] px-6 py-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 hover:border-gray-355 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 font-bold text-xs transition-all cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
