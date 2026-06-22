import React from 'react';
import { getHomepageSections } from '@/lib/services/sections';
import { getProducts } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { getSettings } from '@/lib/services/settings';
import { getTopReviews } from '@/lib/services/reviews';
import CustomizerEditor from '@/components/admin/CustomizerEditor';

export const revalidate = 0; // Dynamic server rendering

export default async function AdminCustomizerPage() {
  const [sections, products, categories, settings, reviews] = await Promise.all([
    getHomepageSections(false), // Fetch both active and inactive sections for customization
    getProducts(),
    getCategories(),
    getSettings(),
    getTopReviews(8)
  ]);

  return (
    <CustomizerEditor
      initialSections={sections}
      products={products}
      categories={categories}
      settings={settings}
      reviews={reviews}
    />
  );
}
