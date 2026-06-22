import React from 'react';
import WishlistContainer from '@/components/store/WishlistContainer';
import { getProducts } from '@/lib/services/products';
import { getSettings } from '@/lib/services/settings';

export const revalidate = 0; // Dynamic server rendering

export default async function WishlistPage() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSettings()
  ]);

  return (
    <WishlistContainer
      products={products}
      settings={settings}
    />
  );
}
