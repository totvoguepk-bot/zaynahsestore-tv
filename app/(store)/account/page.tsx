import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCustomerSession } from '@/lib/utils/customer-auth';
import { getCustomerOrders } from '@/lib/services/customers';
import AccountDashboard from '@/components/store/AccountDashboard';
import { Metadata } from 'next';

export const revalidate = 0; // Force server-rendering on every request

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function AccountPage() {
  const session = await getCustomerSession();
  
  if (!session) {
    redirect('/login');
  }

  const orders = await getCustomerOrders();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f0f1b]">
        <div className="h-8 w-8 rounded-full border-2 border-[#e94560] border-t-transparent animate-spin" />
      </div>
    }>
      <AccountDashboard profile={session} orders={orders} />
    </Suspense>
  );
}
