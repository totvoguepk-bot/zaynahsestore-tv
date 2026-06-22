'use client';

import React from 'react';
import { StoreSettings } from '@/lib/types';
import { cleanWhatsAppPhone } from '@/lib/utils/whatsapp';
import { useCartStore } from '@/store/cartStore';
import { usePathname } from 'next/navigation';

import { InstagramIcon, TiktokIcon, SnapchatIcon, TwitterIcon, WhatsAppIcon } from '@/components/common/Icons';

interface FloatingContactsProps {
  settings: StoreSettings;
}

export default function FloatingContacts({ settings }: FloatingContactsProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(true);
  const totalItems = useCartStore(state => state.totalItems());
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  // Check global enable toggle
  if (settings.floatingContactsEnabled === false) return null;

  const whatsappNumber = settings.floatingWhatsappNumber || settings.whatsappNumber;
  const instagramUrl = settings.socialInstagram;
  const tiktokUrl = settings.socialTiktok;
  const snapchatUrl = settings.socialSnapchat;
  const twitterUrl = settings.socialTwitter;

  // Format active urls based on enabled config flags
  const whatsappUrl = (settings.floatingWhatsappEnabled !== false && whatsappNumber)
    ? `https://wa.me/${cleanWhatsAppPhone(whatsappNumber)}?text=${encodeURIComponent(settings.floatingWhatsappPreset || "Hello! I am visiting your store and have a question.")}`
    : null;

  const instagramUrlFormatted = (settings.floatingInstagramEnabled !== false && instagramUrl)
    ? (instagramUrl.startsWith('http') ? instagramUrl : `https://instagram.com/${instagramUrl}`)
    : null;

  const tiktokUrlFormatted = (settings.floatingTiktokEnabled && tiktokUrl)
    ? (tiktokUrl.startsWith('http') ? tiktokUrl : `https://tiktok.com/@${tiktokUrl.replace('@', '')}`)
    : null;

  const snapchatUrlFormatted = (settings.floatingSnapchatEnabled && snapchatUrl)
    ? (snapchatUrl.startsWith('http') ? snapchatUrl : `https://snapchat.com/add/${snapchatUrl}`)
    : null;

  const twitterUrlFormatted = (settings.floatingTwitterEnabled && twitterUrl)
    ? (twitterUrl.startsWith('http') ? twitterUrl : `https://x.com/${twitterUrl}`)
    : null;

  // If no buttons are active/configured, hide the widget
  if (!whatsappUrl && !instagramUrlFormatted && !tiktokUrlFormatted && !snapchatUrlFormatted && !twitterUrlFormatted) {
    return null;
  }

  // Calculate dynamic bottom and side offset dimensions based on mobile vs desktop
  const isCartBarVisible = mounted && totalItems > 0 && pathname !== '/cart' && pathname !== '/checkout';
  const position = settings.floatingContactsPosition || 'left';
  const isTickerEnabled = settings.recent_buyers_enabled !== false;
  const isSpinWheelEnabled = settings.spin_wheel_enabled;
  const needsStacking = (position === 'left' && isTickerEnabled) || (position === 'right' && isSpinWheelEnabled);
  const baseOffset = settings.floatingContactsBottomMobile ?? 80;

  const bottomOffset = isMobile 
    ? (needsStacking 
        ? Math.max(baseOffset + (isCartBarVisible ? 56 : 0), position === 'left' ? 176 : 160)
        : baseOffset + (isCartBarVisible ? 56 : 0)
      )
    : (settings.floatingContactsBottomDesktop ?? 24);

  const sideOffset = isMobile 
    ? (settings.floatingContactsSideMobile ?? 16) 
    : (settings.floatingContactsSideDesktop ?? 24);

  const scale = settings.floatingContactsScale ?? 1.0;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: `${bottomOffset}px`,
    [position]: `${sideOffset}px`,
    transform: `scale(${scale})`,
    transformOrigin: position === 'right' ? 'bottom right' : 'bottom left',
    zIndex: 120,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'auto'
  };

  return (
    <div style={containerStyle}>
      {/* Instagram Button */}
      {instagramUrlFormatted && (
        <a
          href={instagramUrlFormatted}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
          title="Instagram Profile"
        >
          <InstagramIcon className="h-5.5 w-5.5" />
        </a>
      )}

      {/* TikTok Button */}
      {tiktokUrlFormatted && (
        <a
          href={tiktokUrlFormatted}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-gray-800"
          title="TikTok Profile"
        >
          <TiktokIcon className="h-5 w-5" />
        </a>
      )}

      {/* Snapchat Button */}
      {snapchatUrlFormatted && (
        <a
          href={snapchatUrlFormatted}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fffc00] text-black shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
          title="Snapchat Profile"
        >
          <SnapchatIcon className="h-5.5 w-5.5" />
        </a>
      )}

      {/* Twitter (X) Button */}
      {twitterUrlFormatted && (
        <a
          href={twitterUrlFormatted}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-gray-800"
          title="Twitter Profile"
        >
          <TwitterIcon className="h-4 w-4" />
        </a>
      )}

      {/* WhatsApp Button */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
          title="WhatsApp Chat"
        >
          <WhatsAppIcon className="h-6 w-6 text-white fill-current" />
        </a>
      )}
    </div>
  );
}
