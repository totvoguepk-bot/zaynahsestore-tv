import { Suspense } from 'react';
import MediaLibraryClient from './MediaLibraryClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function MediaLibraryPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl" />}>
      <MediaLibraryClient />
    </Suspense>
  );
}
