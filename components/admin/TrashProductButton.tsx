'use client';

import React from 'react';
import { Trash2 } from '@/components/common/Icons';
import { useRouter } from 'next/navigation';
import { deleteProduct } from '@/lib/services/products';
import { toast } from 'sonner';

interface TrashProductButtonProps {
  productId: string;
}

export default function TrashProductButton({ productId }: TrashProductButtonProps) {
  const router = useRouter();

  const handleTrash = async () => {
    if (!confirm('Are you sure you want to move this product to Trash?')) return;
    try {
      await deleteProduct(productId);
      toast.success('Product moved to Trash');
      router.push('/admin/products');
      router.refresh();
    } catch {
      toast.error('Failed to move product to Trash');
    }
  };

  return (
    <button
      type="button"
      onClick={handleTrash}
      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold transition-all hover:bg-red-100 dark:hover:bg-red-500/20 shadow-sm cursor-pointer"
    >
      <Trash2 className="h-4 w-4" />
      <span>Move to Trash</span>
    </button>
  );
}
