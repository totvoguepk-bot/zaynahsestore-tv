'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useOrderNotification() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playedOrderIds = useRef<Set<string>>(new Set());
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const supabase = createClient();

    const audio = new Audio('/mp3/ChingChang.mp3');
    audio.volume = 1.0;
    audio.preload = 'auto';
    audioRef.current = audio;

    let unlocked = false;
    const unlockAudio = () => {
      if (unlocked) return;
      unlocked = true;
      try {
        const ACtor = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new ACtor();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.value = 0;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.001);
        audioCtxRef.current = ctx;
      } catch {
        audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {});
      }
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }

    let mounted = true;

    const init = async () => {
      // Pehle existing order IDs fetch karo, tab subscribe karo
      try {
        const { data } = await supabase.from('orders').select('id');
        if (data && mounted) data.forEach((row) => playedOrderIds.current.add(row.id));
      } catch {}

      if (!mounted) return;

      const channel = supabase
        .channel('admin-new-orders')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'orders' },
          async (payload) => {
            const orderId = payload.new?.id as string | undefined;
            const orderNumber = payload.new?.order_number as string | undefined;
            if (!orderId || playedOrderIds.current.has(orderId)) return;
            playedOrderIds.current.add(orderId);

            if (audioRef.current) {
              try {
                audioRef.current.currentTime = 0;
                await audioRef.current.play();
              } catch {}
            }

            if (
              typeof window !== 'undefined' &&
              'Notification' in window &&
              Notification.permission === 'granted'
            ) {
              try {
                const suffix = orderNumber ? ` #${orderNumber}` : '';
                const title = 'New Order';
                const opts: any = {
                  body: `A new order has been received${suffix}`,
                  icon: '/icons/icon-192x192.png',
                  badge: '/icons/icon-192x192.png',
                  tag: `order-${orderId}`,
                  renotify: false,
                };
                if ('serviceWorker' in navigator) {
                  const reg = await navigator.serviceWorker.ready;
                  try { await reg.showNotification(title, opts); }
                  catch { new Notification(title, opts); }
                } else {
                  new Notification(title, opts);
                }
              } catch {}
            }
          }
        )
        .subscribe();

      if (mounted) channelRef.current = channel;
    };

    init();

    return () => {
      mounted = false;
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);
}
