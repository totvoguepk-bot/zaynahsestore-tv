'use client';

import React, { useState, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight } from '@/components/common/Icons';
import { resetCustomerPasswordWithToken } from '@/lib/services/customers';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!token) {
    return (
      <div className="bg-white dark:bg-[#16162a] py-8 px-4 shadow-xl shadow-black/5 rounded-3xl border border-gray-100 dark:border-gray-800 sm:px-10 text-center">
        <p className="text-red-500 font-bold mb-4">Reset token is missing or invalid.</p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="text-xs font-bold text-[#e94560] hover:underline cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    startTransition(async () => {
      toast.loading('Resetting password...', { id: 'reset-pass' });
      const res = await resetCustomerPasswordWithToken(token, password);
      if (res.success) {
        toast.success('Password updated successfully! Please log in with your new password.', { id: 'reset-pass' });
        router.push('/login');
      } else {
        toast.error(res.error || 'Failed to reset password.', { id: 'reset-pass' });
      }
    });
  };

  return (
    <div className="bg-white dark:bg-[#16162a] py-8 px-4 shadow-xl shadow-black/5 rounded-3xl border border-gray-100 dark:border-gray-800 sm:px-10">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-650 dark:hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
            Confirm Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl bg-[#e94560] hover:bg-[#d8344e] text-white text-sm font-black transition-all duration-200 shadow-lg shadow-red-500/20 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Reset Password'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0f0f1b] animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e94560]/10 border border-[#e94560]/20 text-[#e94560]">
            <Lock className="h-7 w-7" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-gray-900 dark:text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-semibold px-4 mb-8">
          Enter your new password below to update your account.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={
          <div className="bg-white dark:bg-[#16162a] py-8 px-4 shadow-xl shadow-black/5 rounded-3xl border border-gray-100 dark:border-gray-800 sm:px-10 text-center text-sm text-gray-500">
            Loading reset form...
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
