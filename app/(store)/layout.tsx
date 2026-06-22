import React from 'react';
import Navbar from '@/components/common/Navbar';
import CartBar from '@/components/store/CartBar';
import Footer from '@/components/common/Footer';
import MobileBottomNav from '@/components/common/MobileBottomNav';
import FloatingContacts from '@/components/common/FloatingContacts';
import PremiumFeaturesProvider from '@/components/store/PremiumFeaturesProvider';
import { getSettings } from '@/lib/services/settings';

export default async function StoreLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-[#0f0f1b] text-gray-900 dark:text-gray-100 pb-20 md:pb-0 transition-colors duration-200">
      <Navbar settings={settings} />
      <main className="flex-grow bg-gray-50 dark:bg-[#0f0f1b] transition-colors duration-200">
        {children}
      </main>
      <Footer settings={settings} />
      <CartBar currencySymbol={settings.currencySymbol} />
      <MobileBottomNav />
      <FloatingContacts settings={settings} />
      <PremiumFeaturesProvider settings={settings} />
    </div>
  );
}
