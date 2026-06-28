'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Store, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type Step = 'exchanging' | 'expired' | 'ready' | 'done';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('exchanging');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    initSession();
  }, []);

  async function initSession() {
    try {
      const code = searchParams.get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (error.message?.toLowerCase().includes('expired') || error.message?.toLowerCase().includes('invalid')) {
            setStep('expired');
            setErrorMessage('This reset link has expired or is invalid. Please request a new one.');
            return;
          }
          throw error;
        }
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (data.session) {
        setStep('ready');
      } else {
        setStep('expired');
        setErrorMessage('No active session found. Please request a new password reset link.');
      }
    } catch (err) {
      console.error('Session exchange error:', err);
      setStep('expired');
      setErrorMessage('Failed to verify reset link. Please request a new one.');
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setStep('done');
      toast.success('Password updated successfully!');

      await supabase.auth.signOut({ scope: 'local' });

      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Failed to update password';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'exchanging') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0f0f1b] px-4 py-12 sm:px-6 lg:px-8 transition-colors">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="animate-spin mx-auto h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-[#e94560] rounded-full" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Verifying reset link...
          </p>
        </div>
      </div>
    );
  }

  if (step === 'expired') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0f0f1b] px-4 py-12 sm:px-6 lg:px-8 transition-colors">
        <div className="w-full max-w-md space-y-6 bg-white dark:bg-[#16162a] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Invalid or Expired Link
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {errorMessage || 'This password reset link is no longer valid.'}
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <Link
              href="/admin/forgot-password"
              className="block w-full rounded-xl bg-[#1a1a2e] dark:bg-[#e94560] hover:opacity-90 text-white px-5 py-3 text-sm font-bold transition-all text-center"
            >
              Request New Link
            </Link>
            <Link
              href="/admin/login"
              className="block text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#e94560] transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0f0f1b] px-4 py-12 sm:px-6 lg:px-8 transition-colors">
        <div className="w-full max-w-md space-y-6 bg-white dark:bg-[#16162a] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
            <CheckCircle className="h-7 w-7 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Password Updated
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your password has been reset successfully. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0f0f1b] px-4 py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#16162a] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a1a2e] dark:bg-[#e94560] text-white">
            <Store className="h-7 w-7 text-[#e94560] dark:text-white" />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Set your new admin dashboard access password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                New Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 py-2.5 pl-10 pr-10 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Confirm New Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 py-2.5 pl-10 pr-10 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-[#1a1a2e] dark:bg-[#e94560] hover:bg-[#e94560] dark:hover:bg-[#e94560]/80 active:scale-98 text-white px-5 py-3 text-sm font-bold transition-all duration-200 shadow-md cursor-pointer disabled:bg-gray-300 dark:disabled:bg-gray-700"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
