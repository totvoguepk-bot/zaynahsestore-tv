'use client';

import React from 'react';
import { Loader2, Check, Edit2, Trash2 } from 'lucide-react';
import { Coupon } from '@/lib/types';

interface CouponsTabProps {
  editingCouponId: string | null;
  setEditingCouponId: (v: string | null) => void;
  couponCode: string;
  setCouponCode: (v: string) => void;
  couponDiscountType: 'percentage' | 'fixed';
  setCouponDiscountType: (v: 'percentage' | 'fixed') => void;
  couponValue: number;
  setCouponValue: (v: number) => void;
  couponMinCartAmount: number;
  setCouponMinCartAmount: (v: number) => void;
  couponActive: boolean;
  setCouponActive: (v: boolean) => void;
  currencySymbol: string;
  loadingCoupons: boolean;
  coupons: Coupon[];

  handleSaveCoupon: (e: React.FormEvent) => void;
  handleEditCoupon: (coupon: Coupon) => void;
  handleDeleteCoupon: (id: string) => void;
}

export default function CouponsTab({
  editingCouponId,
  setEditingCouponId,
  couponCode,
  setCouponCode,
  couponDiscountType,
  setCouponDiscountType,
  couponValue,
  setCouponValue,
  couponMinCartAmount,
  setCouponMinCartAmount,
  couponActive,
  setCouponActive,
  currencySymbol,
  loadingCoupons,
  coupons,
  handleSaveCoupon,
  handleEditCoupon,
  handleDeleteCoupon
}: CouponsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Coupon Form */}
      <div className="bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm col-span-1 lg:col-span-5 space-y-6">
        <div>
          <h3 className="text-sm font-extrabold text-[#e94560] uppercase tracking-wider">
            {editingCouponId ? 'Edit Coupon Code' : 'Create Coupon Code'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Setup discounts for storefront checkouts.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-755 dark:text-gray-300 block">Coupon Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. WELCOME10"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] text-gray-955 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-[#e94560]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-755 dark:text-gray-300 block">Discount Type</label>
              <select
                value={couponDiscountType}
                onChange={(e) => setCouponDiscountType(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] text-gray-955 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-[#e94560]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Cash ({currencySymbol})</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-755 dark:text-gray-300 block">Discount Value *</label>
              <input
                type="number"
                required
                min="1"
                value={couponValue}
                onChange={(e) => setCouponValue(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] text-gray-955 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-[#e94560]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-755 dark:text-gray-300 block">Minimum Cart Subtotal Required ({currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={couponMinCartAmount}
              onChange={(e) => setCouponMinCartAmount(Number(e.target.value))}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] text-gray-955 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-[#e94560]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-white/5">
            <label className="text-xs font-bold text-gray-755 dark:text-gray-300">Active status (Enable coupon)</label>
            <input
              type="checkbox"
              checked={couponActive}
              onChange={(e) => setCouponActive(e.target.checked)}
              className="w-4 h-4 rounded text-[#e94560] focus:ring-[#e94560] cursor-pointer"
            />
          </div>

          <div className="flex gap-2 pt-2">
            {editingCouponId && (
              <button
                type="button"
                onClick={() => {
                  setEditingCouponId(null);
                  setCouponCode('');
                  setCouponDiscountType('percentage');
                  setCouponValue(0);
                  setCouponMinCartAmount(0);
                  setCouponActive(true);
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveCoupon}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#1a1a2e] dark:bg-[#e94560] hover:bg-[#e94560] text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              <Check className="h-4 w-4" />
              <span>{editingCouponId ? 'Update Coupon' : 'Save Coupon'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Coupon list */}
      <div className="bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm col-span-1 lg:col-span-7 space-y-4">
        <h3 className="text-sm font-extrabold text-[#e94560] uppercase tracking-wider">Existing Coupon Codes</h3>
        
        <div className="space-y-3">
          {loadingCoupons ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#e94560]" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-xs text-gray-400">
              No coupons found. Create your first coupon to offer checkouts discounts.
            </div>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f0f1b]/30"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold tracking-wider bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-850 dark:text-white">
                      {coupon.code}
                    </span>
                    <span className={`inline-block w-2 h-2 rounded-full ${coupon.active ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <p className="text-xs text-gray-500">
                    Discount: <span className="font-bold text-gray-700 dark:text-gray-300">
                      {coupon.discountType === 'percentage' ? `${coupon.value}%` : `${currencySymbol} ${coupon.value}`}
                    </span>
                    {coupon.minCartAmount ? ` (Min subtotal: ${currencySymbol} ${coupon.minCartAmount})` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditCoupon(coupon)}
                    className="p-2 text-gray-500 hover:text-gray-750 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="p-2 text-red-500 hover:text-red-400 hover:bg-gray-150 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
