'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Zap, Loader2, CheckCircle2 } from '@/components/common/Icons';
import { toast } from 'sonner';

interface BulkOptimizeCardProps {
  pPending: number;
  cPending: number;
}

export function BulkOptimizeCard({ pPending, cPending }: BulkOptimizeCardProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [complete, setComplete] = useState(false);

  const totalPending = pPending + cPending;

  const triggerBulkOptimize = async () => {
    try {
      setLoading(true);
      setComplete(false);
      
      const supabase = createClient();

      // 1. Fetch all pending products
      const { data: products } = await supabase
        .from('products')
        .select('id');
      
      // 2. Fetch all pending categories
      const { data: categories } = await supabase
        .from('categories')
        .select('id');

      // 3. Fetch all optimized IDs to filter them out
      const { data: optimized } = await supabase
        .from('seo_meta')
        .select('entity_id')
        .eq('is_optimized', true);

      const optimizedIds = new Set(optimized?.map(o => o.entity_id) || []);

      const pendingProducts = products?.filter(p => !optimizedIds.has(p.id)) || [];
      const pendingCategories = categories?.filter(c => !optimizedIds.has(c.id)) || [];

      const itemsToOptimize = [
        ...pendingProducts.map(p => ({ entity_type: 'product' as const, entity_id: p.id })),
        ...pendingCategories.map(c => ({ entity_type: 'category' as const, entity_id: c.id }))
      ];

      if (itemsToOptimize.length === 0) {
        toast.info('No pending products or categories require optimization.');
        setLoading(false);
        return;
      }

      setProgress({ current: 0, total: itemsToOptimize.length });
      console.log(`[Bulk Optimize] Queueing ${itemsToOptimize.length} items for optimization`);

      // Trigger sequential calls
      const response = await fetch('/api/seo/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: itemsToOptimize })
      });

      if (!response.ok) {
        throw new Error('Bulk API process failed');
      }

      const result = await response.json();
      toast.success(`Bulk optimization complete! Success: ${result.success}, Failed: ${result.failed}`);
      setComplete(true);
    } catch (error: any) {
      console.error('[Bulk Optimize] Process failed:', error);
      toast.error(error.message || 'Bulk optimization process failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            Bulk SEO Engine
          </h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Automatically write meta tags, long descriptions, and FAQ schemas for all {totalPending} pending items.
          </p>
        </div>
        
        <button
          onClick={triggerBulkOptimize}
          disabled={loading || totalPending === 0}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 active:scale-95 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 cursor-pointer min-h-[44px] text-sm transition-all w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Optimizing...</span>
            </>
          ) : complete ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Done!</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Bulk Optimize All Pending ({totalPending})</span>
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
            <span>Processing Bulk Queue</span>
            <span>{progress.current} / {progress.total} Items</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
