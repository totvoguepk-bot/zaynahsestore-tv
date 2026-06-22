import React, { Suspense } from 'react';
import { Metadata } from 'next';
import CartContainer from '@/components/store/CartContainer';
import { getSettings } from '@/lib/services/settings';

export const revalidate = 0; // Dynamic server rendering

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function CartPage() {
  const settings = await getSettings();

  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="h-10 w-10 rounded-full border-2 border-[#e94560] border-t-transparent animate-spin" />
      </div>
    }>
      <CartContainer settings={settings} />
    </Suspense>
  );
}
