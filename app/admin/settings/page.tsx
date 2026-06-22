import React, { Suspense } from 'react';
import SettingsForm from '@/components/admin/SettingsForm';
import { getSettings } from '@/lib/services/settings';

export const revalidate = 0; // Dynamic server rendering

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Shop Settings</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Customize WhatsApp checkout variables, branding and layout</p>
      </div>
      <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl" />}>
        <SettingsForm initialSettings={settings} />
      </Suspense>
    </div>
  );
}
