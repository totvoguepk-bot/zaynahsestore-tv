import React from 'react';
import CategoryManager from '@/components/admin/CategoryManager';
import { getAllCategories } from '@/lib/services/categories';
import { getSettings } from '@/lib/services/settings';

export const revalidate = 0; // Dynamic server rendering

export default async function AdminCategoriesPage() {
  const [categories, settings] = await Promise.all([
    getAllCategories(),
    getSettings()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Manage Categories</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Organize products into categories for easy filtering</p>
      </div>
      <CategoryManager initialCategories={categories} aiEnabled={settings.ai_enabled} storeUrl={settings.storeUrl || undefined} />
    </div>
  );
}
