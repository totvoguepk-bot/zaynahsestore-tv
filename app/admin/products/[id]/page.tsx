import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById } from '@/lib/services/products';
import { getAllCategories } from '@/lib/services/categories';
import { getSettings } from '@/lib/services/settings';

export const revalidate = 0; // Dynamic server rendering

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  
  const [product, categories, settings] = await Promise.all([
    getProductById(id),
    getAllCategories(),
    getSettings()
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Update product details, variants and custom modifiers</p>
        </div>
        <Link
          href="/admin/products"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#16162a] text-gray-700 dark:text-gray-200 text-xs font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>
      <ProductForm categories={categories} initialProduct={product} aiEnabled={settings.ai_enabled} storeUrl={settings.storeUrl || undefined} />
    </div>
  );
}
