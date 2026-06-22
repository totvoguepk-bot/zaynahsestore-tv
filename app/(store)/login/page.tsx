'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Lock, Eye, EyeOff, Store, ArrowRight } from '@/components/common/Icons';
import { customerLogin, requestCustomerPasswordReset } from '@/lib/services/customers';
import { getSettings } from '@/lib/services/settings';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  
  // Login form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Forgot password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmailOrPhone, setForgotEmailOrPhone] = useState('');
  const [storeSettings, setStoreSettings] = useState<any>(null);
  const [isForgotPending, startForgotTransition] = useTransition();

  useEffect(() => {
    getSettings().then(setStoreSettings).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrPhone.trim()) {
      toast.error('Email or Phone number is required.');
      return;
    }
    if (!password) {
      toast.error('Password is required.');
      return;
    }

    startTransition(async () => {
      const res = await customerLogin({ emailOrPhone, password });
      if (res.success) {
        toast.success(`Welcome back, ${res.customer.name}!`);
        router.push('/account');
        router.refresh();
      } else {
        toast.error(res.error || 'Login failed.');
      }
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmailOrPhone.trim()) {
      return toast.error('Please enter your email.');
    }

    startForgotTransition(async () => {
      toast.loading('Sending reset request...', { id: 'forgot-pass' });
      const res = await requestCustomerPasswordReset(forgotEmailOrPhone.trim());
      if (res.success) {
        toast.success('If your email is registered, you will receive a password reset link shortly.', { id: 'forgot-pass' });
        setIsForgotPassword(false);
      } else {
        toast.error(res.error || 'Failed to send reset link.', { id: 'forgot-pass' });
      }
    });
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0f0f1b] animate-fade-in">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e94560]/10 border border-[#e94560]/20 text-[#e94560]">
              <Lock className="h-7 w-7" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Forgot Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-semibold px-4">
            Enter your account email to request a secure password reset link.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-[#16162a] py-8 px-4 shadow-xl shadow-black/5 rounded-3xl border border-gray-100 dark:border-gray-800/80 sm:px-10">
            <form onSubmit={handleForgotSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={forgotEmailOrPhone}
                    onChange={(e) => setForgotEmailOrPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isForgotPending}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl bg-[#e94560] hover:bg-[#d8344e] text-white text-sm font-black transition-all duration-200 shadow-lg shadow-red-500/20 active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isForgotPending ? 'Sending...' : 'Send Reset Link'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0f0f1b] animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e94560]/10 border border-[#e94560]/20 text-[#e94560]">
            <Store className="h-7 w-7" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-semibold">
          Access your profile, address book, and track orders
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#16162a] py-8 px-4 shadow-xl shadow-black/5 rounded-3xl border border-gray-100 dark:border-gray-800/80 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email/Phone Input */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="name@example.com or 03001234567"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  disabled={isPending}
                  className="block w-full pl-10 pr-3 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs font-bold text-[#e94560] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  className="block w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl bg-[#e94560] hover:bg-[#d8344e] disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-sm font-black transition-all duration-200 shadow-lg shadow-red-500/20 active:scale-98 cursor-pointer"
              >
                {isPending ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Prominent Create Account Section for New Buyers */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/85 text-center">
            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-550">
                New to our store?
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold px-4">
                Create an account to save your delivery addresses and track orders in real time.
              </p>
              <Link
                href="/signup"
                className="mt-2 w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-2xl border-2 border-dashed border-[#e94560] hover:bg-[#e94560]/5 text-[#e94560] hover:text-[#d8344e] text-xs font-black transition-all duration-200 cursor-pointer"
              >
                Create a New Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
