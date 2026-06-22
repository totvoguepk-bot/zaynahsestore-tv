'use client';

import React from 'react';
import { Review } from '@/lib/types';
import StarRating from './StarRating';
import { MessageSquare } from '@/components/common/Icons';

interface ReviewsListProps {
  reviews: Review[];
  loading?: boolean;
}

export default function ReviewsList({ reviews, loading = false }: ReviewsListProps) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarColorClass = (name: string) => {
    const colors = [
      'bg-[#FF8B3D]', // Orange
      'bg-[#10b981]', // Green
      'bg-[#3b82f6]', // Blue
      'bg-[#8b5cf6]', // Purple
      'bg-[#e94560]', // Red
      'bg-[#06b6d4]', // Cyan
      'bg-[#f59e0b]'  // Amber
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));
    } catch { return dateStr; }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#16162a] animate-pulse flex gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3.5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="space-y-2">
                <div className="h-3.5 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3.5 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 px-4 border border-dashed border-gray-200 dark:border-gray-850 rounded-2xl bg-gray-50/30 dark:bg-[#16162a]/10 flex flex-col items-center justify-center space-y-2">
        <div className="p-3 bg-white dark:bg-[#16162a] rounded-xl border border-gray-100 dark:border-gray-800 text-gray-400">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">No reviews yet</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">Be the first to share your experience with this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="flex gap-4 p-4 rounded-xl border border-gray-150 dark:border-gray-850 bg-white dark:bg-[#16162a] shadow-sm text-gray-900 dark:text-white transition-colors duration-200"
        >
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm ${getAvatarColorClass(review.customerName)}`}>
            {getInitials(review.customerName)}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-1.5">
            {/* Stars & Date */}
            <div className="flex items-center justify-between gap-4">
              <StarRating rating={review.rating} showText={false} starSize={12} />
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500" suppressHydrationWarning>
                {formatDate(review.createdAt)}
              </span>
            </div>

            {/* Name & Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-gray-950 dark:text-white">
                {review.customerName}
              </span>
              <div className="flex items-center gap-0.5 text-[9px] font-bold text-[#10b981] bg-[#10b981]/10 dark:bg-[#10b981]/15 px-1.5 py-0.5 rounded-full select-none">
                <span className="text-[8px] font-bold">✓</span>
                <span>Verified Buyer</span>
              </div>
            </div>

            {/* Review Comment */}
            {review.comment && (
              <p className="text-sm text-gray-700 dark:text-gray-350 leading-relaxed font-semibold pt-0.5">
                {review.comment}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
