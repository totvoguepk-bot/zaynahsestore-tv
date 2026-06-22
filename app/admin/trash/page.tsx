import React, { Suspense } from 'react';
import TrashConsole from '@/components/admin/TrashConsole';
import { getDeletedProducts } from '@/lib/services/products';
import { getDeletedCategories } from '@/lib/services/categories';
import { getDeletedReviews } from '@/lib/services/reviews';
import { getDeletedOrders } from '@/lib/services/orders';
import { getDeletedCustomers } from '@/lib/services/customers';
import { getDeletedMedia } from '@/lib/services/media';
import { getDeletedWhatsAppSubscribers, getDeletedEmailSubscribers } from '@/lib/services/sections';

export const revalidate = 0; // Dynamic server rendering

export default async function AdminTrashPage() {
  const [
    products, 
    categories, 
    reviews,
    orders,
    customers,
    media,
    whatsappSubscribers,
    emailSubscribers
  ] = await Promise.all([
    getDeletedProducts(),
    getDeletedCategories(),
    getDeletedReviews(),
    getDeletedOrders(),
    getDeletedCustomers(),
    getDeletedMedia(),
    getDeletedWhatsAppSubscribers(),
    getDeletedEmailSubscribers()
  ]);

  return (
    <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl" />}>
      <TrashConsole 
        initialProducts={products} 
        initialCategories={categories} 
        initialReviews={reviews}
        initialOrders={orders}
        initialCustomers={customers}
        initialMedia={media}
        initialWhatsAppSubscribers={whatsappSubscribers}
        initialEmailSubscribers={emailSubscribers}
      />
    </Suspense>
  );
}
