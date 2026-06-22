'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, Mail, Phone, Calendar, ShoppingBag, LogOut, 
  ChevronDown, ChevronUp, Package, MapPin, Truck, ExternalLink, Shield 
} from '@/components/common/Icons';
import { customerLogout, changeCustomerPassword } from '@/lib/services/customers';
import { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils/whatsapp';
import { toast } from 'sonner';

interface AccountDashboardProps {
  profile: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
  orders: Order[];
}

export default function AccountDashboard({ profile, orders }: AccountDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Change password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleLogout = () => {
    startTransition(async () => {
      const res = await customerLogout();
      if (res.success) {
        toast.success('Logged out successfully');
        router.push('/');
        router.refresh();
      } else {
        toast.error('Logout failed');
      }
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('All password fields are required.');
    }
    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New password and confirmation do not match.');
    }

    try {
      setChangingPassword(true);
      const res = await changeCustomerPassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.error || 'Failed to change password.');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/30';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-gray-800/85';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/30';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300 border border-gray-200 dark:border-gray-700/30';
    }
  };

  const toggleOrderExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f1b] py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Details Header Card */}
        <div className="bg-white dark:bg-[#16162a] rounded-3xl border border-gray-100 dark:border-gray-800/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e94560]/10 text-[#e94560] border border-[#e94560]/20 shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                {profile.name}
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">Customer Profile Account</p>
            </div>
          </div>

          {/* Contact Badges */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {profile.email && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0f0f1b] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                {profile.email}
              </span>
            )}
            {profile.phone && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0f0f1b] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                {profile.phone}
              </span>
            )}
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/30 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Dynamic Multi-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left / Center 2 Columns: Orders History */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#e94560]" />
              Order History ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white dark:bg-[#16162a] rounded-3xl border border-gray-100 dark:border-gray-800/80 p-12 text-center space-y-4 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 dark:bg-[#0f0f1b] border border-gray-100 dark:border-gray-800 mx-auto">
                  <Package className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">No orders found</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs mx-auto">
                    If you recently placed an order, it will appear here as soon as we link it to your profile.
                  </p>
                </div>
                <Link href="/" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#e94560] text-white text-xs font-bold shadow-md hover:bg-[#d8344e] transition-all">
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => {
                  const isExpanded = expandedOrderId === order.id;
                  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-PK', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  });

                  return (
                    <div 
                      key={order.id}
                      className="bg-white dark:bg-[#16162a] rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-sm overflow-hidden transition-all duration-200"
                    >
                      {/* Order Summary Trigger Row */}
                      <div 
                        onClick={() => toggleOrderExpand(order.id)}
                        className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-[#16162a]/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-[#0f0f1b] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-gray-900 dark:text-white text-sm">
                                {order.orderNumber}
                              </span>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{orderDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-gray-800">
                          <div className="text-right">
                            <div className="text-xs text-gray-400 font-semibold">{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</div>
                            <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">
                              {formatPrice(order.total)}
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Order Details Accordion Content */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/20 dark:bg-[#16162a]/10 space-y-4">
                          
                          {/* Items Breakdown */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">Ordered Items</h4>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                              {order.items.map((item, idx) => {
                                const img = item.product.images?.find((i: any) => i.isPrimary)?.url || item.product.images?.[0]?.url || '';
                                const parts = [];
                                if (item.selectedVariant?.color) parts.push(item.selectedVariant.color);
                                if (item.selectedVariant?.size) parts.push(item.selectedVariant.size);
                                const variantStr = parts.join(' · ');

                                return (
                                  <div key={idx} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
                                    <div className="relative h-12 w-12 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shrink-0 bg-gray-50 dark:bg-[#0f0f1b]">
                                      {img ? (
                                        <Image src={img} alt={item.product.name} fill sizes="48px" className="object-cover" unoptimized />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center"><Package className="h-5 w-5 text-gray-300" /></div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-bold text-gray-900 dark:text-white text-xs truncate">
                                        {item.product.name}
                                      </h5>
                                      {variantStr && (
                                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{variantStr}</p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-gray-400 font-semibold">Qty {item.quantity}</div>
                                      <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{formatPrice(item.unitPrice * item.quantity)}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Shipping Info & Subtotal Summary Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-gray-100 dark:border-gray-800/60">
                            
                            {/* Shipping address info */}
                            {order.notes && (
                              <div className="space-y-1.5 text-xs">
                                <h4 className="font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 text-[10px] flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  Delivery Address
                                </h4>
                                <div className="bg-gray-50 dark:bg-[#0f0f1b]/50 border border-gray-100 dark:border-gray-800/80 rounded-xl p-3 text-gray-600 dark:text-gray-300 font-semibold leading-relaxed whitespace-pre-line">
                                  {order.notes}
                                </div>
                              </div>
                            )}

                            {/* Subtotal table summary */}
                            <div className="space-y-2 text-xs">
                              <h4 className="font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 text-[10px] flex items-center gap-1.5">
                                  <Truck className="h-3.5 w-3.5" />
                                  Order Summary
                              </h4>
                              <div className="bg-gray-50 dark:bg-[#0f0f1b]/50 border border-gray-100 dark:border-gray-800/80 rounded-xl p-3.5 space-y-2 text-gray-500 dark:text-gray-400 font-semibold">
                                <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span className="font-bold text-gray-900 dark:text-white">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Delivery / Shipping</span>
                                  <span className="font-bold text-gray-900 dark:text-white">Included</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-800 text-sm font-black text-gray-900 dark:text-white">
                                  <span>Total Paid</span>
                                  <span>{formatPrice(order.total)}</span>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Account Security / Change Password */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#e94560]" />
              Account Security
            </h2>
            
            <div className="bg-white dark:bg-[#16162a] rounded-3xl border border-gray-100 dark:border-gray-800/80 p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
                Change Password
              </h3>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3.5 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#e94560] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3.5 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#e94560] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-3.5 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#e94560] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full py-3 px-4 rounded-xl bg-[#e94560] hover:bg-[#d8344e] disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md active:scale-97 cursor-pointer"
                >
                  {changingPassword ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin mx-auto" />
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
