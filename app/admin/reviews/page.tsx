'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { getAllReviews, approveReview, deleteReview, hideShowReview } from '@/lib/services/reviews';
import { Review } from '@/lib/types';
import StarRating from '@/components/store/StarRating';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Check, Trash2, MessageSquare, Eye, EyeOff } from '@/components/common/Icons';
import { toast } from 'sonner';
import { useAdminTab } from '@/lib/hooks/useAdminTab';

type ReviewWithProduct = Review & { productName?: string };

function AdminReviewsPageInner() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useAdminTab<'all' | 'pending' | 'approved'>('all');

  const refreshReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getAllReviews();
        if (active) {
          setReviews(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
        if (active) {
          toast.error('Failed to load reviews');
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleApprove = async (id: string, currentApproved: boolean) => {
    try {
      await approveReview(id, !currentApproved);
      toast.success(!currentApproved ? 'Review approved successfully' : 'Review unapproved successfully');
      refreshReviews();
    } catch (err) {
      console.error('Failed to update review approval status:', err);
      toast.error('Failed to update review approval status');
    }
  };

  const handleToggleHide = async (id: string, currentHidden: boolean) => {
    try {
      await hideShowReview(id, !currentHidden);
      toast.success(!currentHidden ? 'Review is now hidden from storefront' : 'Review is now visible on storefront');
      refreshReviews();
    } catch (err) {
      console.error('Failed to toggle review visibility:', err);
      toast.error('Failed to toggle review visibility');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to move this review to Trash?')) return;
    try {
      await deleteReview(id);
      toast.success('Review moved to Trash successfully');
      refreshReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
      toast.error('Failed to move review to Trash');
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'pending') return !review.approved;
    if (activeTab === 'approved') return review.approved;
    return true;
  });

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Product Reviews</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Moderate customer ratings and feedback</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-1.5 overflow-x-auto">
        {(['all', 'pending', 'approved'] as const).map((tab) => {
          const count = reviews.filter(r => {
            if (tab === 'pending') return !r.approved;
            if (tab === 'approved') return r.approved;
            return true;
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#e94560] text-[#e94560]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-1.5 text-xs bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center space-y-3">
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-full text-gray-400">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No reviews found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">There are no reviews in this category.</p>
        </div>
      ) : (
        <>
          {/* Desktop view Table */}
          <div className="hidden md:block overflow-hidden bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Comment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50/50 dark:hover:bg-white/1 flex-row transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {review.productName || 'Unknown Product'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{review.customerName}</div>
                        {review.customerPhone && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">{review.customerPhone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StarRating rating={review.rating} showText={true} starSize={14} />
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate" title={review.comment}>
                        {review.comment || <span className="text-gray-300 dark:text-gray-700 italic">No comment</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
                          !review.approved
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                            : review.hidden
                            ? 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400'
                            : 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        }`}>
                          {!review.approved ? 'Pending' : review.hidden ? 'Hidden' : 'Approved'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleApprove(review.id, review.approved)}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all cursor-pointer ${
                              review.approved
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600'
                                : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600'
                            }`}
                            title={review.approved ? "Unapprove Review" : "Approve Review"}
                          >
                            <Check className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleToggleHide(review.id, review.hidden ?? false)}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all cursor-pointer ${
                              review.hidden
                                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600'
                                : 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600'
                            }`}
                            title={review.hidden ? "Show Review" : "Hide Review"}
                          >
                            {review.hidden ? <Eye className="h-4.5 w-4.5" /> : <EyeOff className="h-4.5 w-4.5" />}
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card list */}
          <div className="md:hidden space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-[#16162a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3 transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                      {review.productName || 'Unknown Product'}
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      by <span className="font-semibold text-gray-700 dark:text-gray-300">{review.customerName}</span>
                      {review.customerPhone && ` (${review.customerPhone})`}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    !review.approved
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                      : review.hidden
                      ? 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400'
                      : 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                  }`}>
                    {!review.approved ? 'Pending' : review.hidden ? 'Hidden' : 'Approved'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <StarRating rating={review.rating} showText={false} starSize={12} />
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                {review.comment && (
                  <p className="text-xs text-gray-650 dark:text-gray-300 italic bg-gray-50 dark:bg-[#0f0f1b]/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/20">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-1.5 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => handleToggleApprove(review.id, review.approved)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      review.approved
                        ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{review.approved ? 'Approved' : 'Approve'}</span>
                  </button>
                  <button
                    onClick={() => handleToggleHide(review.id, review.hidden ?? false)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      review.hidden
                        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600'
                        : 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600'
                    }`}
                  >
                    {review.hidden ? (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>Show</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Hide</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl" />}>
      <AdminReviewsPageInner />
    </Suspense>
  );
}
