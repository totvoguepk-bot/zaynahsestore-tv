import React from 'react';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-[80vh]">
      <DetailSkeleton />
    </div>
  );
}
