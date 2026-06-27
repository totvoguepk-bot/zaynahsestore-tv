'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Play, Trash2 } from '@/components/common/Icons';

interface Props {
  orderId: string;
  onMoveToTrash?: () => void;
}

export default function OrderActionsDropdown({ orderId, onMoveToTrash }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [action, setAction] = useState('book-postex');

  const handleExecute = () => {
    if (action === 'book-postex') {
      router.push(`/admin/orders/postex-booking?id=${orderId}`);
    }
  };

  return (
    <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <span>Order actions</span>
        {expanded ? <ChevronUp className="h-3.5 w-3.5 text-gray-400" /> : <ChevronDown className="h-3.5 w-3.5 text-gray-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-gray-800/60 pt-3">
          <div className="flex items-center gap-2">
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f0f1b] px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white cursor-pointer"
            >
              <option value="book-postex">Book at PostEx</option>
            </select>
            <button
              type="button"
              onClick={handleExecute}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              title="Execute"
            >
              <Play className="h-4 w-4" />
            </button>
          </div>

          {onMoveToTrash && (
            <button
              type="button"
              onClick={onMoveToTrash}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Trash2 className="h-3.5 w-3.5" />
                Move to Trash
              </span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Update</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
