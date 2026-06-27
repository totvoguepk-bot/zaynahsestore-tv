import React from 'react';
import CourierManager from '@/components/admin/CourierManager';
import { getSettings } from '@/lib/services/settings';

export const revalidate = 0;

export default async function CourierSettingsPage() {
  const settings = await getSettings();

  return (
    <CourierManager settings={settings} />
  );
}
