import React from 'react';
import { Product, StoreSettings } from '@/lib/types';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';

interface ProductGridProps {
  products: Product[];
  currencySymbol?: string;
  settings?: StoreSettings | null;
}

export default function ProductGrid({ products, currencySymbol, settings }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState />;
  }

  const mobileCols = settings?.card_mobile_columns === 1 ? 'grid-cols-1' : 'grid-cols-2';

  return (
    <div className={`grid ${mobileCols} gap-4 sm:grid-cols-3 lg:grid-cols-4`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} currencySymbol={currencySymbol} settings={settings} />
      ))}
    </div>
  );
}
