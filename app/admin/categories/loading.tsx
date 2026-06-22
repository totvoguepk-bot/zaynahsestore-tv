import React from 'react';

export default function CategoriesLoading() {
  return (
    <div className="space-y-6">
      {/* Header action loading */}
      <div className="flex justify-end animate-pulse">
        <div className="h-10 w-36 rounded-xl bg-gray-100 dark:bg-gray-800" />
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#16162a] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-5 w-28 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-12 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
              <div className="h-3 w-36 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
            </div>

            <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-800 justify-end">
              <div className="h-8 w-16 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-8 w-16 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
