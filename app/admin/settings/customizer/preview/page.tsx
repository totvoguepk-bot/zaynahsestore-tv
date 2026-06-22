import React from 'react';
import { getHomepageSections } from '@/lib/services/sections';
import { getProducts } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { getSettings } from '@/lib/services/settings';
import { getTopReviews } from '@/lib/services/reviews';
import PreviewClient from './PreviewClient';

export const revalidate = 0; // Dynamic server rendering

export default async function CustomizerPreviewPage() {
  const [sections, products, categories, settings, reviews] = await Promise.all([
    getHomepageSections(false),
    getProducts(),
    getCategories(),
    getSettings(),
    getTopReviews(8)
  ]);

  return (
    <PreviewClient
      initialSections={sections}
      products={products}
      categories={categories}
      initialSettings={settings}
      reviews={reviews}
    />
  );
}
