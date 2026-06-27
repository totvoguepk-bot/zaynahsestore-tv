'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from '@/components/common/Icons';
import { Product, ProductVariant, StoreSettings } from '@/lib/types';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils/whatsapp';
import { toast } from 'sonner';
import VariantSelector from './VariantSelector';
import { animateFlyTo } from '@/lib/utils/flyAnimation';

interface QuickViewModalProps {
  product: Product;
  settings: StoreSettings;
  onClose: () => void;
}

export default function QuickViewModal({ product, settings, onClose }: QuickViewModalProps) {
  const addItem = useCartStore(state => state.addItem);

  const images = React.useMemo(() => {
    return product.images.length > 0
      ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
      : [{
          id: 'dummy', productId: product.id,
          url: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3C/svg%3E",
          alt: product.name, sortOrder: 0, isPrimary: true, createdAt: ''
        }];
  }, [product.images, product.id, product.name]);

  const initialActiveIdx = React.useRef(
    Math.max(0, images.findIndex(img => img.isPrimary))
  );

  const [activeIdx, setActiveIdx] = useState(initialActiveIdx.current);

  // Embla carousel for mobile touch swipe
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: initialActiveIdx.current
  });

  // Keep activeIdx in sync when user swipes
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setActiveIdx(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const activeVariants = product.variants.filter(v => v.active);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.hasVariants && activeVariants.length > 0 ? activeVariants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const fallbackPlaceholder = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3C/svg%3E";

  // ── Image sync on variant change ─────────────────────────────────────────
  const applyVariant = useCallback((v: ProductVariant) => {
    setSelectedVariant(v);
    if (v.imageUrl) {
      const idx = images.findIndex(img => img.url === v.imageUrl);
      if (idx !== -1) emblaApi?.scrollTo(idx);
    }
  }, [images, emblaApi]);

  // ── Derived values ────────────────────────────────────────────────────────
  const activePrices = activeVariants.map(v => v.price).filter((p): p is number => typeof p === 'number' && p > 0);
  const minPrice = activePrices.length > 0 ? Math.min(...activePrices) : product.price;
  const maxPrice = activePrices.length > 0 ? Math.max(...activePrices) : product.price;
  const hasPriceRange = minPrice !== maxPrice;

  const stockAvailable = product.isService
    ? 999
    : (selectedVariant ? selectedVariant.stock : product.stock);

  const basePrice    = selectedVariant?.price        ?? product.price;
  const comparePrice = selectedVariant?.comparePrice ?? product.comparePrice;

  // ── Cart ──────────────────────────────────────────────────────────────────
  const handleAddToCart = (e: React.MouseEvent) => {
    if (quantity > stockAvailable) {
      toast.error(`Only ${stockAvailable} items left in stock`);
      return;
    }
    addItem(product, selectedVariant, [], quantity);
    toast.success(`${product.name} added to cart!`);

    // Trigger fly animation
    const imageUrl = selectedVariant?.imageUrl || product.images.find(img => img.isPrimary)?.url || product.images[0]?.url;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const targetId = isMobile ? 'header-cart-icon-mobile' : 'header-cart-icon-desktop';
    animateFlyTo(e.currentTarget as HTMLElement, targetId, imageUrl);

    // Close the modal after a short delay so the animation can source from the button before it unmounts
    setTimeout(() => {
      onClose();
    }, 250);
  };

  // ── Escape + body scroll lock ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // ── Render ────────────────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/75 animate-fade-in p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-2xl bg-white dark:bg-[#16162a] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden max-h-[92dvh] sm:max-h-[85dvh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
          aria-label="Close Quick View"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2">

            {/* ── Image Gallery ─────────────────────────────────────────── */}
            <div className="relative bg-gray-50 dark:bg-black/20">
              <div className="relative aspect-square w-full overflow-hidden touch-pan-y" ref={emblaRef}>
                <div className="flex h-full">
                  {images.map((img, i) => (
                    <div key={img.id || i} className="relative flex-[0_0_100%] min-w-0 w-full h-full select-none overflow-hidden">
                      <Image
                        src={img.url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                        priority={i === 0}
                      />
                    </div>
                  ))}
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => emblaApi?.scrollPrev()}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/60 shadow text-gray-700 dark:text-white hover:bg-white dark:hover:bg-black transition-all cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => emblaApi?.scrollNext()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/60 shadow text-gray-700 dark:text-white hover:bg-white dark:hover:bg-black transition-all cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => emblaApi?.scrollTo(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${i === activeIdx ? 'bg-white scale-125 shadow' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-none">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => emblaApi?.scrollTo(i)}
                      className={`relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        i === activeIdx ? 'border-[#e94560]' : 'border-transparent hover:border-gray-400'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product Info ───────────────────────────────────────────── */}
            <div className="p-5 flex flex-col gap-4">
              {/* Name */}
              <div>
                {product.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {product.category.name}
                  </span>
                )}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mt-0.5">
                  {product.name}
                </h2>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="product-price text-xl font-extrabold text-[#1a1a2e] dark:text-white">
                    {hasPriceRange ? (
                      `${formatPrice(minPrice, settings.currencySymbol)} – ${formatPrice(maxPrice, settings.currencySymbol)}`
                    ) : (
                      formatPrice(basePrice, settings.currencySymbol)
                    )}
                  </span>
                  {!hasPriceRange && comparePrice && comparePrice > basePrice && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-gray-400 line-through font-semibold font-body">
                        {formatPrice(comparePrice, settings.currencySymbol)}
                      </span>
                      <span className="rounded-md bg-[#e94560]/10 dark:bg-[#e94560]/20 px-1.5 py-0.5 text-[9px] font-black text-[#e94560] tracking-wide animate-none">
                        -{Math.round(((comparePrice - basePrice) / comparePrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
                {hasPriceRange && selectedVariant && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--color-primary)]/5 dark:bg-white/5 border border-gray-200 dark:border-gray-800 text-xs font-semibold mt-1 w-fit">
                    <span className="text-gray-500 dark:text-gray-400">Selected option:</span>
                    <span className="product-price text-sm font-black text-[#e94560] dark:text-[#e94560] leading-none">
                      {formatPrice(basePrice, settings.currencySymbol)}
                    </span>
                    {comparePrice && comparePrice > basePrice && (
                      <span className="inline-flex items-center gap-1 ml-1">
                        <span className="text-[10px] text-gray-400 line-through font-semibold font-body">
                          {formatPrice(comparePrice, settings.currencySymbol)}
                        </span>
                        <span className="rounded bg-[#e94560]/10 dark:bg-[#e94560]/20 px-1 py-0.5 text-[8px] font-black text-[#e94560] leading-none">
                          -{Math.round(((comparePrice - basePrice) / comparePrice) * 100)}%
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Short description */}
              {product.shortDescription && (
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* ── Variant selectors ──────────────────────────────────── */}
              {product.hasVariants && activeVariants.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                  <VariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onChangeSelectedVariant={applyVariant}
                    enableSwatches={product.enableSwatches}
                    settings={settings}
                    variationOrder={product.variationOrder}
                  />
                </div>
              )}

              {/* Stock */}
              {!product.isService && settings.showStock && (
                <div className="text-xs font-semibold">
                  {stockAvailable > 0
                    ? <span className="text-[#10b981]">In Stock ({stockAvailable} left)</span>
                    : <span className="text-red-500">Out of Stock</span>
                  }
                </div>
              )}

              {/* Qty + Add to Cart */}
              <div className="flex gap-3 items-center mt-auto pt-2">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-[#1a1a2e]">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-bold text-gray-900 dark:text-white w-8 text-center select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    disabled={quantity >= stockAvailable}
                    className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={stockAvailable <= 0}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#1a1a2e] hover:bg-[#e94560] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2.5 text-sm font-bold transition-all duration-200 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{stockAvailable <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* Full details link */}
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#e94560] dark:hover:text-[#e94560] transition-colors py-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
