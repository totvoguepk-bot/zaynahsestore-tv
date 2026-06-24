'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface ReviewImageZoomModalProps {
  isOpen: boolean;
  imageUrl: string;
  alt?: string;
  onClose: () => void;
}

export default function ReviewImageZoomModal({
  isOpen,
  imageUrl,
  alt,
  onClose,
}: ReviewImageZoomModalProps) {
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const wasDragging = useRef(false);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const lastTap = useRef<number | null>(null);
  const initialPinchDist = useRef<number | null>(null);
  const initialPinchScale = useRef<number>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    resetZoom();
  }, [imageUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const resetZoom = useCallback(() => {
    setZoomScale(1);
    setZoomPos({ x: 0, y: 0 });
    setIsDragging(false);
    wasDragging.current = false;
  }, []);

  const handleZoomIn = () => setZoomScale(s => Math.min(s + 0.5, 4));
  const handleZoomOut = () => setZoomScale(s => {
    const next = Math.max(s - 0.5, 1);
    if (next === 1) setZoomPos({ x: 0, y: 0 });
    return next;
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    wasDragging.current = false;
    dragStart.current = { x: e.clientX - zoomPos.x, y: e.clientY - zoomPos.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale <= 1) return;
    wasDragging.current = true;
    setZoomPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches.length === 2) {
      const dx = e.targetTouches[0].clientX - e.targetTouches[1].clientX;
      const dy = e.targetTouches[0].clientY - e.targetTouches[1].clientY;
      initialPinchDist.current = Math.sqrt(dx * dx + dy * dy);
      initialPinchScale.current = zoomScale;
      setIsDragging(false);
    } else if (e.targetTouches.length === 1 && zoomScale > 1) {
      setIsDragging(true);
      wasDragging.current = false;
      dragStart.current = {
        x: e.targetTouches[0].clientX - zoomPos.x,
        y: e.targetTouches[0].clientY - zoomPos.y,
      };
      touchStartPos.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches.length === 2 && initialPinchDist.current !== null) {
      const dx = e.targetTouches[0].clientX - e.targetTouches[1].clientX;
      const dy = e.targetTouches[0].clientY - e.targetTouches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = dist / initialPinchDist.current;
      const newScale = Math.max(1, Math.min(4, initialPinchScale.current * factor));
      setZoomScale(newScale);
      if (newScale === 1) setZoomPos({ x: 0, y: 0 });
    } else if (e.targetTouches.length === 1 && zoomScale > 1 && isDragging) {
      const dx = e.targetTouches[0].clientX - dragStart.current.x;
      const dy = e.targetTouches[0].clientY - dragStart.current.y;
      if (Math.abs(e.targetTouches[0].clientX - touchStartPos.current.x) > 5 ||
          Math.abs(e.targetTouches[0].clientY - touchStartPos.current.y) > 5) {
        wasDragging.current = true;
      }
      setZoomPos({ x: dx, y: dy });
    }
  };

  const handleTouchEnd = () => {
    initialPinchDist.current = null;
    if (zoomScale > 1) setIsDragging(false);
  };

  const handleImageClick = () => {
    if (wasDragging.current) {
      wasDragging.current = false;
      return;
    }
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      zoomScale > 1 ? resetZoom() : setZoomScale(2.5);
      lastTap.current = null;
    } else {
      lastTap.current = now;
    }
  };

  const handleBackdropClick = () => {
    onClose();
    resetZoom();
  };

  if (!mounted || !isOpen || !imageUrl) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black/95 animate-fade-in touch-none select-none"
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); handleBackdropClick(); }}
        className="absolute top-4 right-4 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shadow-md"
        aria-label="Close lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      {zoomScale > 1 && (
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      )}

      <div
        className="relative w-full max-w-4xl h-[65dvh] md:h-[80dvh] flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-full h-full relative ${isDragging ? 'cursor-grabbing' : zoomScale > 1 ? 'cursor-grab' : 'cursor-zoom-in'}`}
          style={{
            transform: `translate(${zoomPos.x}px, ${zoomPos.y}px) scale(${zoomScale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleImageClick}
        >
          <Image
            src={imageUrl}
            alt={alt || 'Customer feedback'}
            fill
            sizes="90vw"
            className="object-contain pointer-events-none"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
