import React from 'react';

export default function CustomizerLoading() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[80vh] animate-pulse">
      {/* Sidebar Editor Panel */}
      <div className="w-full lg:w-96 bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-6">
        <div className="h-6 w-48 rounded bg-gray-100 dark:bg-gray-800" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-10 w-full rounded-xl bg-gray-100 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="h-5 w-36 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
        <div className="flex-1 bg-gray-50/50 dark:bg-[#0f0f1b]/55 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center p-8 min-h-[400px]">
          <div className="h-8 w-32 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
