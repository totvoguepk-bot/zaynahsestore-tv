import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { getAllCategories } from '@/lib/services/categories';
import { getSettings } from '@/lib/services/settings';

export const revalidate = 0; // Dynamic server rendering

export default async function NewProductPage() {
  const [categories, settings] = await Promise.all([
    getAllCategories(),
    getSettings()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Create a new product in the shop catalog</p>
        </div>
        <Link
          href="/admin/products"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#16162a] text-gray-700 dark:text-gray-200 text-xs font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>
      <ProductForm categories={categories} aiEnabled={settings.ai_enabled} storeUrl={settings.storeUrl || undefined} />
    </div>
  );
}
