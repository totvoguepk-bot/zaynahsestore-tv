import React from 'react';
import { notFound } from 'next/navigation';
import CategoryDetailManager from '@/components/admin/CategoryDetailManager';
import { getCategoryById } from '@/lib/services/categories';
import { getProductsByCategoryId } from '@/lib/services/products';

export const revalidate = 0; // Dynamic server rendering

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [category, products] = await Promise.all([
    getCategoryById(id),
    getProductsByCategoryId(id)
  ]);

  if (!category) {
    notFound();
  }

  return (
    <CategoryDetailManager category={category} initialProducts={products} />
  );
}
