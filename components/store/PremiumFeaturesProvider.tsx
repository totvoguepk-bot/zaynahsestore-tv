'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { StoreSettings, Product, Order } from '@/lib/types';
import { getProductsClient } from '@/lib/services/products-client';
import { getOrdersClient } from '@/lib/services/orders-client';
import { addWhatsAppSubscriberClient } from '@/lib/services/sections-client';
import { X, Gift, Shield, CheckCircle2, Tag, Play } from '@/components/common/Icons';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PremiumFeaturesProviderProps {
  settings: StoreSettings;
}

export default function PremiumFeaturesProvider({ settings }: PremiumFeaturesProviderProps) {
  // Client-side mount status
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Products list for Recent Buyers Ticker
  const [products, setProducts] = useState<Product[]>([]);
  const [realOrders, setRealOrders] = useState<Order[]>([]);
  const pathname = usePathname();
  const isCheckout = pathname === '/cart' || pathname === '/checkout';


  // Exit Intent state
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitPhone, setExitPhone] = useState('');
  const [exitName, setExitName] = useState('');
  const [exitEmail, setExitEmail] = useState('');
  const [exitSubscribed, setExitSubscribed] = useState(false);

  // Spin to Win state
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [spinPhone, setSpinPhone] = useState('');
  const [spinName, setSpinName] = useState('');
  const [spinEmail, setSpinEmail] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Cookie Consent state
  const [showCookies, setShowCookies] = useState(false);

  // Recent Buyer Ticker state
  const [tickerProduct, setTickerProduct] = useState<Product | null>(null);
  const [tickerBuyer, setTickerBuyer] = useState<{ name: string; city: string } | null>(null);
  const [tickerTime, setTickerTime] = useState('2m ago');
  const [showTicker, setShowTicker] = useState(false);

  // Initialize
  useEffect(() => {
    // 1. Fetch active products for ticker
    const loadProducts = async () => {
      try {
        const data = await getProductsClient();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products for ticker:', err);
      }
    };
    loadProducts();

    const loadRealOrders = async () => {
      if (settings.recent_buyers_source !== 'real') return;
      try {
        const orderData = await getOrdersClient();
        const validOrders = orderData.filter(o => o.items && o.items.length > 0);
        setRealOrders(validOrders);
      } catch (err) {
        console.error('Failed to load real orders for ticker:', err);
      }
    };
    loadRealOrders();

    // 2. Cookie check
    const cookiesAccepted = localStorage.getItem('cookies-accepted');
    if (settings.cookie_consent_enabled !== false && !cookiesAccepted) {
      setShowCookies(true);
    }

    // 3. Spin wheel spun check
    const spun = localStorage.getItem('spin-wheel-spun');
    if (spun) {
      setHasSpun(true);
    }

    // 4. Exit Intent listeners
    const handleMouseLeave = (e: MouseEvent) => {
      if (!settings.exit_intent_enabled) return;

      // Check session storage to avoid spamming
      const dismissed = sessionStorage.getItem('exit-intent-dismissed');
      if (dismissed || exitSubscribed) return;

      if (e.clientY < 10) {
        setShowExitIntent(true);
        sessionStorage.setItem('exit-intent-dismissed', 'true');
      }
    };

    // Mobile fallback: trigger after configured seconds
    let mobileTimer: NodeJS.Timeout;
    if (settings.exit_intent_enabled && typeof window !== 'undefined' && window.innerWidth < 768) {
      const delayMobile = (settings.exit_intent_delay_mobile ?? 25) * 1000;
      mobileTimer = setTimeout(() => {
        const dismissed = sessionStorage.getItem('exit-intent-dismissed');
        if (!dismissed && !exitSubscribed) {
          setShowExitIntent(true);
          sessionStorage.setItem('exit-intent-dismissed', 'true');
        }
      }, delayMobile);
    }

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, [settings.exit_intent_enabled, exitSubscribed]);

  // Recent Purchases Ticker Loop
  useEffect(() => {
    if (settings.recent_buyers_enabled === false || products.length === 0) return;
    if (isCheckout && settings.recent_buyers_show_on_checkout === false) {
      setShowTicker(false);
      return;
    }

    const runTicker = () => {
      let selectedProduct: Product | null = null;
      let buyerName = '';
      let buyerCity = '';
      let displayTime = '';

      if (settings.recent_buyers_source === 'real' && realOrders.length > 0) {
        // Pick a random real order
        const randomOrder = realOrders[Math.floor(Math.random() * realOrders.length)];
        if (randomOrder && randomOrder.items && randomOrder.items.length > 0) {
          const orderItem = randomOrder.items[0];
          selectedProduct = orderItem.product;
          buyerName = randomOrder.customerName || 'A customer';

          const notesStr = randomOrder.notes || '';
          const cityMatch = notesStr.match(/City:\s*([^\n\r]+)/i);
          buyerCity = cityMatch ? cityMatch[1].trim() : 'Pakistan';

          const createdTime = new Date(randomOrder.createdAt).getTime();
          const elapsed = Date.now() - createdTime;
          const mins = Math.floor(elapsed / 60000);
          if (mins < 1) {
            displayTime = 'just now';
          } else if (mins < 60) {
            displayTime = `${mins}m ago`;
          } else {
            const hrs = Math.floor(mins / 60);
            if (hrs < 24) {
              displayTime = `${hrs}h ago`;
            } else {
              displayTime = `${Math.floor(hrs / 24)}d ago`;
            }
          }
        }
      }

      // Fallback/Simulated
      if (!selectedProduct) {
        let pool = products;
        const poolType = settings.recent_buyers_product_pool || 'any';
        if (poolType === 'featured') {
          pool = products.filter(p => p.isFeatured);
        } else if (poolType === 'sale') {
          pool = products.filter(p => p.comparePrice && p.comparePrice > p.price);
        } else if (poolType === 'recent') {
          pool = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
        } else if (poolType === 'custom') {
          let customIds: string[] = [];
          try {
            customIds = Array.isArray(settings.recent_buyers_custom_products)
              ? settings.recent_buyers_custom_products
              : typeof settings.recent_buyers_custom_products === 'string'
                ? JSON.parse(settings.recent_buyers_custom_products)
                : [];
          } catch (e) {
            console.error(e);
          }
          if (customIds.length > 0) {
            pool = products.filter(p => customIds.includes(p.id));
          }
        }

        if (pool.length === 0) pool = products;
        if (pool.length === 0) return;

        selectedProduct = pool[Math.floor(Math.random() * pool.length)];

        const names = settings.recent_buyers_names
          ? settings.recent_buyers_names.split(/[,\n]+/).map(s => s.trim()).filter(Boolean)
          : ['Ahmad', 'Fatima', 'Zainab', 'Hamza', 'Ayesha', 'Bilal', 'Sana', 'Ali', 'Usman', 'Maryam'];

        const cities = settings.recent_buyers_cities
          ? settings.recent_buyers_cities.split(/[,\n]+/).map(s => s.trim()).filter(Boolean)
          : ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'];

        buyerName = names[Math.floor(Math.random() * names.length)] || 'A buyer';
        buyerCity = cities[Math.floor(Math.random() * cities.length)] || 'Pakistan';
        const randomMinutes = Math.floor(Math.random() * 59) + 1;
        displayTime = `${randomMinutes}m ago`;
      }

      setTickerProduct(selectedProduct);
      setTickerBuyer({ name: buyerName, city: buyerCity });
      setTickerTime(displayTime);
      setShowTicker(true);

      const displayDuration = (settings.recent_buyers_display_duration ?? 6) * 1000;
      setTimeout(() => {
        setShowTicker(false);
      }, displayDuration);
    };

    const initialDelayVal = (settings.recent_buyers_initial_delay ?? 15) * 1000;
    const intervalVal = (settings.recent_buyers_interval ?? 35) * 1000;

    const initialDelay = setTimeout(() => {
      runTicker();
    }, initialDelayVal);

    const interval = setInterval(() => {
      runTicker();
    }, intervalVal);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [products, realOrders, settings.recent_buyers_enabled, settings.recent_buyers_show_on_checkout, isCheckout, settings.recent_buyers_source, settings.recent_buyers_names, settings.recent_buyers_cities, settings.recent_buyers_product_pool, settings.recent_buyers_custom_products, settings.recent_buyers_initial_delay, settings.recent_buyers_interval, settings.recent_buyers_display_duration]);

  // Draw the spin wheel canvas
  useEffect(() => {
    if (!showSpinWheel || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const segments = settings.spin_wheel_segments || ['Try Again', '5% Off', 'Free Shipping', '10% Off', 'Free Delivery', 'WELCOME15'];
    const numSegments = segments.length;
    const radius = canvas.width / 2;
    const angleStep = (2 * Math.PI) / numSegments;

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(rotationRef.current);

      // Draw segments
      for (let i = 0; i < numSegments; i++) {
        const startAngle = i * angleStep;
        const endAngle = startAngle + angleStep;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius - 8, startAngle, endAngle);
        ctx.closePath();

        // Alternate premium styling colors
        if (i % 2 === 0) {
          ctx.fillStyle = '#1a1a2e'; // Deep Navy
        } else {
          ctx.fillStyle = '#e94560'; // Bold Red
        }
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.rotate(startAngle + angleStep / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(segments[i], radius - 25, 0);
        ctx.restore();
      }

      // Draw outer gold/brass border ring
      ctx.beginPath();
      ctx.arc(0, 0, radius - 4, 0, 2 * Math.PI);
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#d97706'; // Gold/Amber
      ctx.stroke();

      // Draw center pin
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.restore();
    };

    drawWheel();

    // Export drawing function for the animation loop
    (canvas as any).drawWheel = drawWheel;

  }, [showSpinWheel, settings.spin_wheel_segments]);

  // Start spinning the wheel animation
  const startSpin = async () => {
    if (isSpinning || hasSpun) return;
    if (!spinPhone.trim()) {
      toast.error('Please enter your WhatsApp number to spin!');
      return;
    }

    try {
      setIsSpinning(true);
      // Register WhatsApp subscriber first
      await addWhatsAppSubscriberClient(spinPhone, spinName || undefined, spinEmail || undefined, 'wheel');
    } catch (err) {
      console.error(err);
      toast.error('Could not save WhatsApp subscriber. Please try again.');
      setIsSpinning(false);
      return;
    }

    const segments = settings.spin_wheel_segments || ['Try Again', '5% Off', 'Free Shipping', '10% Off', 'Free Delivery', 'WELCOME15'];
    const numSegments = segments.length;

    // Choose a random winning segment index (make sure it's not "Try Again" if possible, to delight buyers!)
    let targetIndex = Math.floor(Math.random() * numSegments);
    if (segments[targetIndex] === 'Try Again' && Math.random() > 0.1) {
      // Re-roll to give better odds of winning something
      targetIndex = (targetIndex + 1) % numSegments;
    }

    const segmentAngle = (2 * Math.PI) / numSegments;

    // Target rotation: pointer is at top (-Math.PI/2).
    // Formula to align targetIndex with top pointer:
    // We want: targetAngle = (1.5 * Math.PI - finalRotation) % 2pi.
    // So finalRotation = 1.5 * Math.PI - targetIndex * segmentAngle - randomOffsetInsideSegment.
    const randomOffset = 0.15 * segmentAngle + Math.random() * (0.7 * segmentAngle);
    const targetFinalRotation = (1.5 * Math.PI) - (targetIndex * segmentAngle) - randomOffset;

    // Add 5-8 full spins for excitement
    const spins = 5 + Math.floor(Math.random() * 4);
    const finalRotVal = targetFinalRotation + spins * 2 * Math.PI;

    let start: number | null = null;
    const duration = 6500; // 6.5 seconds spin

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const t = Math.min(progress / duration, 1);

      // Easing out cubic: 1 - (1 - t)^3
      const easeOut = 1 - Math.pow(1 - t, 4);
      rotationRef.current = easeOut * finalRotVal;

      const canvas = canvasRef.current;
      if (canvas && (canvas as any).drawWheel) {
        (canvas as any).drawWheel();
      }

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setHasSpun(true);
        localStorage.setItem('spin-wheel-spun', 'true');

        const prize = segments[targetIndex];
        setSpinResult(prize);
        toast.success(`🎉 Congratulations! You won: ${prize}`);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Handle Exit Intent submit
  const handleExitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitPhone.trim()) {
      toast.error('Please enter your WhatsApp number!');
      return;
    }

    try {
      await addWhatsAppSubscriberClient(exitPhone, exitName || undefined, exitEmail || undefined, 'exit_intent');
      setExitSubscribed(true);
      toast.success('Successfully subscribed! Enjoy your discount.');
    } catch (err) {
      console.error(err);
      toast.error('Could not save WhatsApp subscriber. Please check the number.');
    }
  };

  const acceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setShowCookies(false);
  };

  // copy text helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Coupon code copied to clipboard!');
  };

  const getCouponCodeForSegment = (prize: string | null) => {
    if (!prize) return settings.exit_intent_coupon || 'WELCOME10';
    const clean = prize.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (clean.length >= 3 && !['TRYAGAIN', 'FREESHIPPING', 'FREEDELIVERY', '5OFF', '10OFF'].includes(clean)) {
      return clean;
    }

    if (prize.includes('5%')) return '5OFF';
    if (prize.includes('10%')) return '10OFF';
    if (prize.includes('15%')) return '15OFF';
    if (prize.includes('20%')) return '20OFF';
    if (prize.toLowerCase().includes('free shipping') || prize.toLowerCase().includes('free delivery')) {
      return 'FREESHIP';
    }

    return settings.exit_intent_coupon || 'WELCOME10';
  };

  if (!mounted) return null;

  return (
    <>
      {/* 1. EXIT INTENT POPUP */}
      {showExitIntent && !exitSubscribed && createPortal(
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 overscroll-contain animate-fade-in touch-none"
          onClick={() => setShowExitIntent(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white dark:bg-[#16162a] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-2xl transition-all scale-100 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mt-3">
              {settings.exit_intent_image_url ? (
                <div className="relative w-full h-44 sm:h-52 mb-4 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={settings.exit_intent_image_url} alt="Promo banner" className="object-contain w-full h-full" />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-50 dark:bg-amber-950/40 rounded-full mb-4">
                  <Tag className="w-7 h-7 text-amber-500" />
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif">
                {settings.exit_intent_title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {settings.exit_intent_text}
              </p>
            </div>
            <form onSubmit={handleExitSubmit} className="mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={exitName}
                  onChange={(e) => setExitName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-950 dark:text-gray-50"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={exitEmail}
                  onChange={(e) => setExitEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-950 dark:text-gray-50"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="WhatsApp Number (e.g. 03211234567)"
                  value={exitPhone}
                  onChange={(e) => setExitPhone(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-950 dark:text-gray-50"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#1a1a2e] dark:bg-amber-600 hover:bg-[#2a2a3e] dark:hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition-all transform active:scale-95 shadow-md"
              >
                Claim Coupon Now
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {showExitIntent && exitSubscribed && createPortal(
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 animate-fade-in touch-none"
          onClick={() => setShowExitIntent(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white dark:bg-[#16162a] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-2xl text-center scale-up duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-full mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Here is your Coupon Code!
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Copy the code below and use it at checkout for special savings.
            </p>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-amber-500 uppercase tracking-wider">
                {settings.exit_intent_coupon}
              </span>
              <button
                onClick={() => copyToClipboard(settings.exit_intent_coupon || 'WELCOME10')}
                className="px-4 py-2 bg-[#1a1a2e] dark:bg-amber-600 hover:bg-[#272740] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Send us a screenshot of this coupon on WhatsApp to claim your gift!
            </p>
          </div>
        </div>,
        document.body
      )}

      {/* 2. SPIN TO WIN FLOATING GIFT TRIGGER */}
      {settings.spin_wheel_enabled && !showSpinWheel && !hasSpun && (
        <button
          onClick={() => setShowSpinWheel(true)}
          className="fixed bottom-24 right-4 z-40 p-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-2xl animate-bounce hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
          title="Spin to Win!"
        >
          <Gift className="w-6 h-6" />
        </button>
      )}

      {/* SPIN TO WIN POPUP MODAL */}
      {showSpinWheel && createPortal(
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 overflow-y-auto overscroll-contain animate-fade-in touch-none"
          onClick={() => { if (!isSpinning) setShowSpinWheel(false); }}
        >
          <div 
            className="relative w-full max-w-lg bg-white dark:bg-[#16162a] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-2xl transition-all my-8 scale-up duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSpinWheel(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              disabled={isSpinning}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 flex flex-col items-center justify-center">
                {/* Pointer indicator */}
                <div className="relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-amber-500 drop-shadow-md" />
                  <canvas
                    ref={canvasRef}
                    width={220}
                    height={220}
                    className="w-[220px] h-[220px] rounded-full drop-shadow-xl"
                  />
                </div>
              </div>

              <div className="md:col-span-6 space-y-4">
                <div className="text-center md:text-left">
                  <span className="inline-block px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-500 text-xs font-bold rounded-full mb-1">
                    Try Your Luck!
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif">
                    Spin to Win Discounts
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter your WhatsApp number to unlock a random checkout discount code.
                  </p>
                </div>

                {!spinResult ? (
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name (Optional)"
                        value={spinName}
                        onChange={(e) => setSpinName(e.target.value)}
                        disabled={isSpinning}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-950 dark:text-gray-50"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address (Optional)"
                        value={spinEmail}
                        onChange={(e) => setSpinEmail(e.target.value)}
                        disabled={isSpinning}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-950 dark:text-gray-50"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="WhatsApp Number"
                        value={spinPhone}
                        onChange={(e) => setSpinPhone(e.target.value.replace(/\D/g, ''))}
                        disabled={isSpinning}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-950 dark:text-gray-50"
                      />
                    </div>
                    <button
                      onClick={startSpin}
                      disabled={isSpinning}
                      className="w-full py-2.5 bg-[#e94560] hover:bg-[#d83651] text-white text-xs font-semibold rounded-xl transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-center md:text-left">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                        You Won:
                      </p>
                      <p className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
                        {spinResult}
                      </p>
                    </div>

                    {spinResult !== 'Try Again' && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-amber-500">
                          {getCouponCodeForSegment(spinResult)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(getCouponCodeForSegment(spinResult))}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded transition-colors"
                        >
                          Copy Code
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => setShowSpinWheel(false)}
                      className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 3. VERIFIED RECENT BUYERS TICKER */}
      {showTicker && settings.recent_buyers_enabled !== false && (!isCheckout || settings.recent_buyers_show_on_checkout) && tickerProduct && tickerBuyer && (
        <div className="fixed bottom-24 left-4 z-[110] flex items-center max-w-[280px] sm:max-w-xs p-3 bg-white dark:bg-[#16162a] border border-gray-100 dark:border-gray-800/80 rounded-2xl shadow-xl transition-all duration-500 animate-slide-up">
          <Link href={`/product/${tickerProduct.slug}`} className="flex items-center gap-3 w-full">
            {tickerProduct.images?.[0]?.url && (
              <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                <Image
                  src={tickerProduct.images[0].url}
                  alt={tickerProduct.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{tickerBuyer.name}</span>
                from {tickerBuyer.city}
              </p>
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate mt-0.5">
                Bought {tickerProduct.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] text-gray-400 dark:text-gray-500">{tickerTime}</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-1 rounded-sm">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                </span>
              </div>
            </div>
          </Link>
          <button
            onClick={() => setShowTicker(false)}
            className="absolute -top-1.5 -right-1.5 p-1 bg-white dark:bg-[#16162a] border border-gray-100 dark:border-gray-800 rounded-full shadow-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 4. COOKIE CONSENT BANNER */}
      {showCookies && settings.cookie_consent_enabled !== false && (
        <div className="fixed bottom-0 left-0 right-0 z-[150] p-4 bg-white/95 dark:bg-[#16162a]/95 border-t border-gray-100 dark:border-gray-800/80 shadow-2xl transition-all duration-300 animate-slide-up">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-gray-600 dark:text-gray-300 text-center md:text-left">
                {settings.cookie_consent_text || 'We use cookies to optimize your experience, analyze traffic, and support checkout flows. By continuing, you agree to our privacy policy.'}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={acceptCookies}
                className="px-5 py-2 bg-[#1a1a2e] dark:bg-amber-600 hover:bg-[#25253b] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                {settings.cookie_consent_button_text || 'Accept All'}
              </button>
              <button
                onClick={() => setShowCookies(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
