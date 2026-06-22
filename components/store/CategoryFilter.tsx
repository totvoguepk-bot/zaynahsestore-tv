'use client';

import React from 'react';
import { Category } from '@/lib/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (id?: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory
}: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-none pb-2">
      <div className="flex gap-2.5 px-1 min-w-max">
        <button
          onClick={() => onSelectCategory(undefined)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            selectedCategoryId === undefined
              ? 'bg-[#1a1a2e] dark:bg-[#e94560] text-white shadow-sm'
              : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
          }`}
        >
          All Items
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              selectedCategoryId === cat.id
                ? 'bg-[#1a1a2e] dark:bg-[#e94560] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
