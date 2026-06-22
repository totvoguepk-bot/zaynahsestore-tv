import React from 'react';
import { ShoppingBag } from '@/components/common/Icons';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No products found",
  description = "Try adjusting your search or filters to find what you are looking for."
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-100 mb-4">
        <ShoppingBag className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-[#1a1a2e]">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">{description}</p>
    </div>
  );
}
