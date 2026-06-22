import React from 'react';
import InventoryManager from '@/components/admin/InventoryManager';
import { getAllProductsAdmin } from '@/lib/services/products';
import { getAllCategories } from '@/lib/services/categories';

export const revalidate = 0; // Dynamic server rendering

export default async function AdminInventoryPage() {
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getAllCategories()
  ]);

  return (
    <InventoryManager products={products} categories={categories} />
  );
}
