import React from 'react';
import ProductList from '@/components/admin/ProductList';
import { getAllProductsAdmin } from '@/lib/services/products';
import { getSettings } from '@/lib/services/settings';

export const revalidate = 0; // Dynamic server rendering

export default async function AdminProductsPage() {
  const [products, settings] = await Promise.all([
    getAllProductsAdmin(),
    getSettings()
  ]);

  return (
    <ProductList initialProducts={products} settings={settings} />
  );
}
