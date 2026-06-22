'use client';

import React from 'react';
import { HomepageSection } from '@/lib/types';
import { Image as ImageIcon } from '@/components/common/Icons';

interface HeroSlide {
  id: string;
  image_url: string;
  video_url?: string;
  video_autoplay?: boolean;
  video_muted?: boolean;
  tagline?: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  button_secondary_text?: string;
  button_secondary_link?: string;
  mobile_tagline?: string;
  mobile_title?: string;
  mobile_subtitle?: string;
  mobile_button_text?: string;
  mobile_button_link?: string;
  mobile_button_secondary_text?: string;
  mobile_button_secondary_link?: string;
  tablet_tagline?: string;
  tablet_title?: string;
  tablet_subtitle?: string;
  tablet_button_text?: string;
  tablet_button_link?: string;
  tablet_button_secondary_text?: string;
  tablet_button_secondary_link?: string;
}

interface HeroBannerSettingsProps {
  section: HomepageSection;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  onUpdateSection: (updates: Partial<HomepageSection>) => void;
  onSelectMedia: (fieldPath: 'settings' | 'content_data', fieldKey: string, isSlide?: boolean, slideId?: string) => void;
}

// Reusable Slider + Number Input control with fixed units and standard presets
interface NumberSliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: 'px' | '%' | 's';
  onChange: (val: number) => void;
  presets?: { label: string; val: number }[];
}

function NumberSliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  presets
}: NumberSliderControlProps) {
  // Local state to keep track of user's raw typed text in input
  const [inputValue, setInputValue] = React.useState<string>(value.toString());

  // Sync state whenever the external value changes from other controls (presets, sliders, or database updates)
  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const clampedValue = Math.min(Math.max(value, min), max);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setInputValue(val.toString());
    onChange(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setInputValue(rawVal);

    const num = Number(rawVal);
    if (!isNaN(num) && rawVal !== '') {
      // Allow user to type unclamped values below min while typing (e.g. typing "2" on the way to "250")
      // but cap at max to prevent layout overflow errors.
      const bounded = Math.min(num, max);
      onChange(bounded);
    }
  };

  const handleInputBlur = () => {
    let num = Number(inputValue);
    if (isNaN(num) || inputValue.trim() === '') {
      num = min;
    }
    // Enforce full min-max clamping when input focus is lost
    const finalClamped = Math.min(Math.max(num, min), max);
    setInputValue(finalClamped.toString());
    onChange(finalClamped);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clampedValue}
          onChange={handleSliderChange}
          className="flex-grow accent-[#e94560] h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="relative flex items-center w-20 flex-shrink-0">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-full pl-3 pr-7 py-1 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
          />
          <span className="absolute right-2 text-[10px] font-bold text-gray-400 uppercase select-none">
            {unit}
          </span>
        </div>
      </div>
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {presets.map(p => (
            <button
              key={p.val}
              type="button"
              onClick={() => {
                setInputValue(p.val.toString());
                onChange(p.val);
              }}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                clampedValue === p.val
                  ? 'border-[#e94560] bg-[#e94560]/10 text-[#e94560]'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Reusable Segmented Button Group for alignments and text positioning
interface ButtonGroupControlProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}

function ButtonGroupControl({
  label,
  value,
  options,
  onChange
}: ButtonGroupControlProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
        {label}
      </label>
      <div className="flex bg-gray-100 dark:bg-white/5 p-0.5 rounded-xl border border-gray-200 dark:border-gray-800">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              value === opt.value
                ? 'bg-white dark:bg-[#16162a] text-[#e94560] shadow-sm border border-gray-200/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HeroBannerSettings({
  section,
  viewportMode,
  onUpdateSection,
  onSelectMedia
}: HeroBannerSettingsProps) {
  const settings = section.settings || {};
  const contentData = section.content_data || {};
  const isMobileView = viewportMode === 'mobile' || viewportMode === 'tablet';

  const slides: HeroSlide[] = contentData.slides || [];
  const [activeSlideId, setActiveSlideId] = React.useState<string | null>(null);

  // Auto-migrate old single-banner setup to slides array format on load
  React.useEffect(() => {
    if (!contentData.slides || contentData.slides.length === 0) {
      const initialSlide: HeroSlide = {
        id: 'slide_' + Math.random().toString(36).substring(2, 9),
        image_url: contentData.image_url || '',
        video_url: contentData.video_url || '',
        tagline: contentData.tagline || '',
        title: section.title || 'Special Collection Deal',
        subtitle: contentData.subtitle || '',
        button_text: contentData.button_text || 'Shop Now',
        button_link: contentData.button_link || '/shop',
        button_secondary_text: contentData.button_secondary_text || '',
        button_secondary_link: contentData.button_secondary_link || ''
      };
      onUpdateSection({
        content_data: {
          ...contentData,
          slides: [initialSlide]
        }
      });
      setActiveSlideId(initialSlide.id);
    } else if (slides.length > 0 && !activeSlideId) {
      setActiveSlideId(slides[0].id);
    }
  }, [contentData.slides, slides, activeSlideId, contentData, onUpdateSection, section.title]);

  const handleSettingsChange = (key: string, value: any) => {
    onUpdateSection({
      settings: { ...settings, [key]: value }
    });
  };

  const handleSlideChange = (slideId: string, updates: Partial<HeroSlide>) => {
    const updatedSlides = slides.map(s => s.id === slideId ? { ...s, ...updates } : s);
    onUpdateSection({
      content_data: { ...contentData, slides: updatedSlides }
    });
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: 'slide_' + Math.random().toString(36).substring(2, 9),
      image_url: 'https://ziucrfpebpxijqhwmqre.supabase.co/storage/v1/object/public/product-images/placeholder.jpg',
      tagline: 'NEW ARRIVALS',
      title: 'New Slider Collection',
      subtitle: 'Premium collections now streaming live.',
      button_text: 'Discover More',
      button_link: '/shop',
      button_secondary_text: '',
      button_secondary_link: ''
    };
    const updatedSlides = [...slides, newSlide];
    onUpdateSection({
      content_data: { ...contentData, slides: updatedSlides }
    });
    setActiveSlideId(newSlide.id);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (slides.length <= 1) {
      alert('You must keep at least 1 slide in the Hero Banner.');
      return;
    }
    const updatedSlides = slides.filter(s => s.id !== slideId);
    onUpdateSection({
      content_data: { ...contentData, slides: updatedSlides }
    });
    if (activeSlideId === slideId) {
      setActiveSlideId(updatedSlides[0].id);
    }
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;

    onUpdateSection({
      content_data: { ...contentData, slides: newSlides }
    });
  };

  // Helper functions for parsing CSS unit strings cleanly
  const parsePxValue = (val: any, defaultVal: number): number => {
    if (val === undefined || val === null) return defaultVal;
    const num = parseInt(val.toString().replace('px', '').trim(), 10);
    return isNaN(num) ? defaultVal : num;
  };

  const parsePercentValue = (val: any, defaultVal: number): number => {
    if (val === undefined || val === null) return defaultVal;
    const num = parseInt(val.toString().replace('%', '').trim(), 10);
    return isNaN(num) ? defaultVal : num;
  };

  // Parsed dimensions with safe defaults
  const heightDesktop = parsePxValue(settings.height_desktop, 450);
  const heightTablet = parsePxValue(settings.height_tablet, 350);
  const heightMobile = parsePxValue(settings.height_mobile, 250);
  const widthDesktop = parsePxValue(settings.content_width_desktop, 576);
  const widthTablet = parsePxValue(settings.content_width_tablet, 600);
  const widthMobile = parsePercentValue(settings.content_width_mobile, 100);

  const activeSlide = slides.find(s => s.id === activeSlideId);

  let titleVal = '';
  let taglineVal = '';
  let subtitleVal = '';
  let btnTextVal = '';
  let btnLinkVal = '';
  let secBtnTextVal = '';
  let secBtnLinkVal = '';

  if (activeSlide) {
    if (viewportMode === 'mobile') {
      titleVal = activeSlide.mobile_title || '';
      taglineVal = activeSlide.mobile_tagline || '';
      subtitleVal = activeSlide.mobile_subtitle || '';
      btnTextVal = activeSlide.mobile_button_text || '';
      btnLinkVal = activeSlide.mobile_button_link || '';
      secBtnTextVal = activeSlide.mobile_button_secondary_text || '';
      secBtnLinkVal = activeSlide.mobile_button_secondary_link || '';
    } else if (viewportMode === 'tablet') {
      titleVal = activeSlide.tablet_title || '';
      taglineVal = activeSlide.tablet_tagline || '';
      subtitleVal = activeSlide.tablet_subtitle || '';
      btnTextVal = activeSlide.tablet_button_text || '';
      btnLinkVal = activeSlide.tablet_button_link || '';
      secBtnTextVal = activeSlide.tablet_button_secondary_text || '';
      secBtnLinkVal = activeSlide.tablet_button_secondary_link || '';
    } else {
      titleVal = activeSlide.title || '';
      taglineVal = activeSlide.tagline || '';
      subtitleVal = activeSlide.subtitle || '';
      btnTextVal = activeSlide.button_text || '';
      btnLinkVal = activeSlide.button_link || '';
      secBtnTextVal = activeSlide.button_secondary_text || '';
      secBtnLinkVal = activeSlide.button_secondary_link || '';
    }
  }

  return (
    <div className="space-y-5">
      {/* Viewport Context Header */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400">
        <span className="text-base">⚙️</span>
        <span>
          Showing settings for <strong className="text-[#e94560] uppercase">{viewportMode}</strong> view
        </span>
      </div>

      {/* A. SLIDES LIST MANAGEMENT */}
      <div className="space-y-3 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560]">Slides List</span>
          <button
            type="button"
            onClick={handleAddSlide}
            className="px-2.5 py-1 bg-[#e94560] hover:bg-[#d83550] text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            + Add Slide
          </button>
        </div>

        {slides.length === 0 ? (
          <div className="text-center py-4 text-xs font-semibold text-gray-400">
            No slides configured.
          </div>
        ) : (
          <div className="space-y-1.5">
            {slides.map((slide, idx) => {
              const isActive = activeSlideId === slide.id;
              return (
                <div
                  key={slide.id}
                  onClick={() => setActiveSlideId(slide.id)}
                  className={`flex items-center justify-between p-2.5 border rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#e94560] bg-[#e94560]/5 dark:bg-[#e94560]/10 shadow-sm'
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16162a]/50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-black text-gray-400 flex-shrink-0">#{idx + 1}</span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[140px]">
                      {slide.title || `Slide ${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSlide(idx, 'up')}
                      className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === slides.length - 1}
                      onClick={() => handleMoveSlide(idx, 'down')}
                      className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="text-[10px] text-gray-450 hover:text-red-500 cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* B. ACTIVE SLIDE SETTINGS */}
      {activeSlide && (
        <div className="space-y-4 p-3.5 bg-gray-50/50 dark:bg-white/2 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800/80 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#e94560]">
              Editing Slide Settings
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase">
              {activeSlide.title || 'Untitled'}
            </span>
          </div>

          {/* Single Media Editor — one image + one video for all breakpoints */}
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Image Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  Banner Image <span className="font-normal normal-case text-gray-400">(all devices)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={activeSlide.image_url || ''}
                    onChange={e => handleSlideChange(activeSlide.id, { image_url: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1 px-3 py-2 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => onSelectMedia('content_data', 'image_url', true, activeSlide.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 hover:dark:bg-white/15 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Select
                  </button>
                </div>
              </div>

              {/* Video URL Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  Video URL <span className="font-normal normal-case text-gray-400">(optional — all devices)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={activeSlide.video_url || ''}
                    onChange={e => handleSlideChange(activeSlide.id, { video_url: e.target.value })}
                    placeholder="https://.../video.mp4 or YouTube/Vimeo URL"
                    className="flex-1 px-3 py-2 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => onSelectMedia('content_data', 'video_url', true, activeSlide.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 hover:dark:bg-white/15 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Select
                  </button>
                </div>
              </div>

              {/* Autoplay & Muted — unified (not per-viewport) */}
              {activeSlide.video_url && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`autoplay-${activeSlide.id}`}
                      checked={activeSlide.video_autoplay !== false}
                      onChange={e => handleSlideChange(activeSlide.id, { video_autoplay: e.target.checked })}
                      className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4"
                    />
                    <label htmlFor={`autoplay-${activeSlide.id}`} className="text-[11px] font-bold text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                      Enable Autoplay
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`muted-${activeSlide.id}`}
                      checked={activeSlide.video_muted !== false}
                      onChange={e => handleSlideChange(activeSlide.id, { video_muted: e.target.checked })}
                      className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4"
                    />
                    <label htmlFor={`muted-${activeSlide.id}`} className="text-[11px] font-bold text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                      Mute Video (Highly recommended for autoplay)
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Viewport-specific Text Content Editor */}
          <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-800">
            <span className="text-[9px] font-black tracking-wider uppercase text-gray-400 dark:text-gray-550 capitalize">
              {viewportMode} Text Content (Slide-level)
            </span>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Tagline / Supertitle</label>
              <input
                type="text"
                value={taglineVal}
                onChange={e => {
                  const val = e.target.value;
                  handleSlideChange(activeSlide.id, 
                    viewportMode === 'mobile'
                      ? { mobile_tagline: val }
                      : viewportMode === 'tablet'
                      ? { tablet_tagline: val }
                      : { tagline: val }
                  );
                }}
                placeholder={viewportMode !== 'desktop' ? (activeSlide.tagline || 'Inherited from desktop') : 'e.g. SUMMER SALE'}
                className="w-full px-3 py-2 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Slide Main Title</label>
              <input
                type="text"
                value={titleVal}
                onChange={e => {
                  const val = e.target.value;
                  handleSlideChange(activeSlide.id, 
                    viewportMode === 'mobile'
                      ? { mobile_title: val }
                      : viewportMode === 'tablet'
                      ? { tablet_title: val }
                      : { title: val }
                  );
                }}
                placeholder={viewportMode !== 'desktop' ? (activeSlide.title || 'Inherited from desktop') : 'e.g. 50% Off Collection'}
                className="w-full px-3 py-2 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Subtitle Text</label>
              <textarea
                rows={2}
                value={subtitleVal}
                onChange={e => {
                  const val = e.target.value;
                  handleSlideChange(activeSlide.id, 
                    viewportMode === 'mobile'
                      ? { mobile_subtitle: val }
                      : viewportMode === 'tablet'
                      ? { tablet_subtitle: val }
                      : { subtitle: val }
                  );
                }}
                placeholder={viewportMode !== 'desktop' ? (activeSlide.subtitle || 'Inherited from desktop') : 'Subtitle description...'}
                className="w-full px-3 py-2 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-white resize-none focus:outline-none focus:border-[#e94560]"
              />
            </div>

            {/* Slide Call to Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] font-bold text-gray-450 uppercase tracking-wide block">Primary CTA Button</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={btnTextVal}
                  onChange={e => {
                    const val = e.target.value;
                    handleSlideChange(activeSlide.id, 
                      viewportMode === 'mobile'
                        ? { mobile_button_text: val }
                        : viewportMode === 'tablet'
                        ? { tablet_button_text: val }
                        : { button_text: val }
                    );
                  }}
                  placeholder={viewportMode !== 'desktop' ? (activeSlide.button_text || 'Inherited from desktop') : 'Label (Shop Now)'}
                  className="px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                />
                <input
                  type="text"
                  value={btnLinkVal}
                  onChange={e => {
                    const val = e.target.value;
                    handleSlideChange(activeSlide.id, 
                      viewportMode === 'mobile'
                        ? { mobile_button_link: val }
                        : viewportMode === 'tablet'
                        ? { tablet_button_link: val }
                        : { button_link: val }
                    );
                  }}
                  placeholder={viewportMode !== 'desktop' ? (activeSlide.button_link || 'Inherited from desktop') : 'Link (/shop)'}
                  className="px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] font-bold text-gray-450 uppercase tracking-wide block">Secondary CTA Button</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={secBtnTextVal}
                  onChange={e => {
                    const val = e.target.value;
                    handleSlideChange(activeSlide.id, 
                      viewportMode === 'mobile'
                        ? { mobile_button_secondary_text: val }
                        : viewportMode === 'tablet'
                        ? { tablet_button_secondary_text: val }
                        : { button_secondary_text: val }
                    );
                  }}
                  placeholder={viewportMode !== 'desktop' ? (activeSlide.button_secondary_text || 'Inherited from desktop') : 'Label'}
                  className="px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                />
                <input
                  type="text"
                  value={secBtnLinkVal}
                  onChange={e => {
                    const val = e.target.value;
                    handleSlideChange(activeSlide.id, 
                      viewportMode === 'mobile'
                        ? { mobile_button_secondary_link: val }
                        : viewportMode === 'tablet'
                        ? { tablet_button_secondary_link: val }
                        : { button_secondary_link: val }
                    );
                  }}
                  placeholder={viewportMode !== 'desktop' ? (activeSlide.button_secondary_link || 'Inherited from desktop') : 'Link'}
                  className="px-2.5 py-1.5 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. GLOBAL SLIDER OPTIONS & SETTINGS */}
      <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-800">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block">Global Slider Settings</span>

        {/* Slideshow Autoplay Toggle & Speed Controls */}
        <div className="p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.autoplay ?? true}
              onChange={e => handleSettingsChange('autoplay', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Autoplay Slideshow
            </span>
          </label>

          {(settings.autoplay ?? true) && (
            <div className="pt-1 border-t border-gray-200 dark:border-gray-800/60">
              <NumberSliderControl
                label="Autoplay Speed"
                value={Math.round((settings.autoplay_speed ?? 5000) / 1000)}
                min={3}
                max={15}
                step={1}
                unit="s"
                onChange={val => handleSettingsChange('autoplay_speed', val * 1000)}
                presets={[
                  { label: 'Fast (3s)', val: 3 },
                  { label: 'Medium (5s)', val: 5 },
                  { label: 'Slow (8s)', val: 8 },
                  { label: 'Very Slow (12s)', val: 12 }
                ]}
              />
            </div>
          )}
        </div>

        {viewportMode === 'tablet' ? (
          // TABLET VIEW DIMENSIONS
          <div className="space-y-4">
            <div className="space-y-4 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block">Tablet Dimensions</span>
              
              <NumberSliderControl
                label="Height"
                value={heightTablet}
                min={200}
                max={600}
                step={10}
                unit="px"
                onChange={val => handleSettingsChange('height_tablet', `${val}px`)}
                presets={[
                  { label: 'Compact (300px)', val: 300 },
                  { label: 'Standard (350px)', val: 350 },
                  { label: 'Tall (400px)', val: 400 },
                  { label: 'Heroic (500px)', val: 500 }
                ]}
              />

              <div className="border-t border-gray-200 dark:border-gray-800/60 pt-3">
                <NumberSliderControl
                  label="Content Max Width"
                  value={widthTablet}
                  min={300}
                  max={1000}
                  step={25}
                  unit="px"
                  onChange={val => handleSettingsChange('content_width_tablet', `${val}px`)}
                  presets={[
                    { label: 'Slim (400px)', val: 400 },
                    { label: 'Medium (600px)', val: 600 },
                    { label: 'Wide (800px)', val: 800 },
                    { label: 'Full Width (900px)', val: 900 }
                  ]}
                />
              </div>
            </div>

            <div className="space-y-3 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block mb-1">Tablet Alignments</span>
              <div className="grid grid-cols-2 gap-3">
                <ButtonGroupControl
                  label="Position (Horiz)"
                  value={settings.content_position_tablet_x || 'center'}
                  options={[
                    { label: 'Left', value: 'left' },
                    { label: 'Center', value: 'center' },
                    { label: 'Right', value: 'right' }
                  ]}
                  onChange={val => handleSettingsChange('content_position_tablet_x', val)}
                />
                <ButtonGroupControl
                  label="Position (Vert)"
                  value={settings.content_position_tablet_y || 'middle'}
                  options={[
                    { label: 'Top', value: 'top' },
                    { label: 'Middle', value: 'middle' },
                    { label: 'Bottom', value: 'bottom' }
                  ]}
                  onChange={val => handleSettingsChange('content_position_tablet_y', val)}
                />
              </div>
              <ButtonGroupControl
                label="Text Align"
                value={settings.text_align_tablet || 'center'}
                options={[
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' }
                ]}
                onChange={val => handleSettingsChange('text_align_tablet', val)}
              />
            </div>

            <div className="space-y-4 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block mb-1">Tablet Focal Shifts</span>
              
              <NumberSliderControl
                label="Zoom Scale"
                value={settings.image_scale_tablet ?? 100}
                min={100}
                max={200}
                step={5}
                unit="%"
                onChange={val => handleSettingsChange('image_scale_tablet', val)}
              />
              
              <NumberSliderControl
                label="Left/Right Shift"
                value={settings.image_focal_x_tablet ?? 50}
                min={0}
                max={100}
                step={5}
                unit="%"
                onChange={val => handleSettingsChange('image_focal_x_tablet', val)}
              />
              
              <NumberSliderControl
                label="Up/Down Shift"
                value={settings.image_focal_y_tablet ?? 50}
                min={0}
                max={100}
                step={5}
                unit="%"
                onChange={val => handleSettingsChange('image_focal_y_tablet', val)}
              />
            </div>

            <div className="space-y-1.5 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <ButtonGroupControl
                label="Tablet Heading Size"
                value={settings.heading_size_tablet || '3xl'}
                options={[
                  { label: 'S (xl)', value: 'xl' },
                  { label: 'M (2xl)', value: '2xl' },
                  { label: 'L (3xl)', value: '3xl' },
                  { label: 'XL (4xl)', value: '4xl' },
                  { label: 'XXL (5xl)', value: '5xl' }
                ]}
                onChange={val => handleSettingsChange('heading_size_tablet', val)}
              />
            </div>
          </div>
        ) : viewportMode === 'mobile' ? (
          // MOBILE VIEW DIMENSIONS
          <div className="space-y-4">
            <div className="space-y-4 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block">Mobile Dimensions</span>
              
              <NumberSliderControl
                label="Height"
                value={heightMobile}
                min={150}
                max={500}
                step={10}
                unit="px"
                onChange={val => handleSettingsChange('height_mobile', `${val}px`)}
                presets={[
                  { label: 'Compact (200px)', val: 200 },
                  { label: 'Standard (250px)', val: 250 },
                  { label: 'Tall (300px)', val: 300 },
                  { label: 'Heroic (400px)', val: 400 }
                ]}
              />

              <div className="border-t border-gray-200 dark:border-gray-800/60 pt-3">
                <NumberSliderControl
                  label="Content Max Width"
                  value={widthMobile}
                  min={50}
                  max={100}
                  step={5}
                  unit="%"
                  onChange={val => handleSettingsChange('content_width_mobile', `${val}%`)}
                  presets={[
                    { label: 'Narrow (75%)', val: 75 },
                    { label: 'Medium (90%)', val: 90 },
                    { label: 'Full Width (100%)', val: 100 }
                  ]}
                />
              </div>
            </div>

            <div className="space-y-3 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block mb-1">Mobile Alignments</span>
              <div className="grid grid-cols-2 gap-3">
                <ButtonGroupControl
                  label="Position (Horiz)"
                  value={settings.content_position_mobile_x || 'center'}
                  options={[
                    { label: 'Left', value: 'left' },
                    { label: 'Center', value: 'center' },
                    { label: 'Right', value: 'right' }
                  ]}
                  onChange={val => handleSettingsChange('content_position_mobile_x', val)}
                />
                <ButtonGroupControl
                  label="Position (Vert)"
                  value={settings.content_position_mobile_y || 'middle'}
                  options={[
                    { label: 'Top', value: 'top' },
                    { label: 'Middle', value: 'middle' },
                    { label: 'Bottom', value: 'bottom' }
                  ]}
                  onChange={val => handleSettingsChange('content_position_mobile_y', val)}
                />
              </div>
              <ButtonGroupControl
                label="Text Align"
                value={settings.text_align_mobile || 'center'}
                options={[
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' }
                ]}
                onChange={val => handleSettingsChange('text_align_mobile', val)}
              />
            </div>

            <div className="space-y-4 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block mb-1">Mobile Focal Shifts</span>
              
              <NumberSliderControl
                label="Zoom Scale"
                value={settings.image_scale_mobile ?? 100}
                min={100}
                max={200}
                step={5}
                unit="%"
                onChange={val => handleSettingsChange('image_scale_mobile', val)}
              />
              
              <NumberSliderControl
                label="Left/Right Shift"
                value={settings.image_focal_x_mobile ?? 50}
                min={0}
                max={100}
                step={5}
                unit="%"
                onChange={val => handleSettingsChange('image_focal_x_mobile', val)}
              />
              
              <NumberSliderControl
                label="Up/Down Shift"
                value={settings.image_focal_y_mobile ?? 50}
                min={0}
                max={100}
                step={5}
                unit="%"
                onChange={val => handleSettingsChange('image_focal_y_mobile', val)}
              />
            </div>

            <div className="space-y-1.5 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <ButtonGroupControl
                label="Mobile Heading Size"
                value={settings.heading_size_mobile || '2xl'}
                options={[
                  { label: 'S (lg)', value: 'lg' },
                  { label: 'M (xl)', value: 'xl' },
                  { label: 'L (2xl)', value: '2xl' },
                  { label: 'XL (3xl)', value: '3xl' }
                ]}
                onChange={val => handleSettingsChange('heading_size_mobile', val)}
              />
            </div>
          </div>
        ) : (
          // DESKTOP VIEW DIMENSIONS
          <div className="space-y-4">
            <div className="space-y-4 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block">Desktop Dimensions</span>
              
              <NumberSliderControl
                label="Height"
                value={heightDesktop}
                min={250}
                max={800}
                step={10}
                unit="px"
                onChange={val => handleSettingsChange('height_desktop', `${val}px`)}
                presets={[
                  { label: 'Compact (350px)', val: 350 },
                  { label: 'Standard (450px)', val: 450 },
                  { label: 'Tall (550px)', val: 550 },
                  { label: 'Heroic (650px)', val: 650 },
                  { label: 'Full Screen (800px)', val: 800 }
                ]}
              />

              <div className="border-t border-gray-200 dark:border-gray-800/60 pt-3">
                <NumberSliderControl
                  label="Content Max Width"
                  value={widthDesktop}
                  min={300}
                  max={1400}
                  step={25}
                  unit="px"
                  onChange={val => handleSettingsChange('content_width_desktop', `${val}px`)}
                  presets={[
                    { label: 'Slim (500px)', val: 500 },
                    { label: 'Medium (750px)', val: 750 },
                    { label: 'Wide (1000px)', val: 1000 },
                    { label: 'Full Width (1200px)', val: 1200 }
                  ]}
                />
              </div>
            </div>

            <div className="space-y-3 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block mb-1">Desktop Alignments</span>
              <div className="grid grid-cols-2 gap-3">
                <ButtonGroupControl
                  label="Position (Horiz)"
                  value={settings.content_position_desktop_x || settings.content_position_desktop || 'center'}
                  options={[
                    { label: 'Left', value: 'left' },
                    { label: 'Center', value: 'center' },
                    { label: 'Right', value: 'right' }
                  ]}
                  onChange={val => {
                    onUpdateSection({
                      settings: {
                        ...settings,
                        content_position_desktop_x: val,
                        content_position_desktop: val
                      }
                    });
                  }}
                />
                <ButtonGroupControl
                  label="Position (Vert)"
                  value={settings.content_position_desktop_y || 'middle'}
                  options={[
                    { label: 'Top', value: 'top' },
                    { label: 'Middle', value: 'middle' },
                    { label: 'Bottom', value: 'bottom' }
                  ]}
                  onChange={val => handleSettingsChange('content_position_desktop_y', val)}
                />
              </div>
              <ButtonGroupControl
                label="Text Align"
                value={settings.text_align_desktop || 'center'}
                options={[
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' }
                ]}
                onChange={val => handleSettingsChange('text_align_desktop', val)}
              />
            </div>

            <div className="space-y-4 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block mb-1">Desktop Focal Shifts</span>
              
              <NumberSliderControl
                label="Zoom Scale"
                value={settings.image_scale_desktop ?? 100}
                min={100}
                max={200}
                step={5}
                unit="%"
                onChange={val => handleSettingsChange('image_scale_desktop', val)}
              />
              
              <NumberSliderControl
                label="Left/Right Shift"
                value={settings.image_focal_x_desktop ?? 50}
                min={0}
                max={100}
                step={5}
                unit="%"
                onChange={val => handleSettingsChange('image_focal_x_desktop', val)}
              />
              
              <NumberSliderControl
                label="Up/Down Shift"
                value={settings.image_focal_y_desktop ?? 50}
                min={0}
                max={100}
                step={5}
                unit="%"
                onChange={val => handleSettingsChange('image_focal_y_desktop', val)}
              />
            </div>

            <div className="space-y-1.5 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <ButtonGroupControl
                label="Desktop Heading Size"
                value={settings.heading_size_desktop || '5xl'}
                options={[
                  { label: 'S (2xl)', value: '2xl' },
                  { label: 'M (3xl)', value: '3xl' },
                  { label: 'L (4xl)', value: '4xl' },
                  { label: 'XL (5xl)', value: '5xl' },
                  { label: 'XXL (6xl)', value: '6xl' }
                ]}
                onChange={val => handleSettingsChange('heading_size_desktop', val)}
              />
            </div>
          </div>
        )}

        {/* Global Backdrop Checkbox */}
        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.show_backdrop_container ?? false}
              onChange={e => handleSettingsChange('show_backdrop_container', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
            />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Show Glassmorphism Backdrop
            </span>
          </label>
        </div>

        {/* Global Styling & Colors */}
        <div className="space-y-4 p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e94560] block mb-1">Styling & Colors</span>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Overlay Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={settings.overlay_color || '#000000'}
                onChange={e => handleSettingsChange('overlay_color', e.target.value)}
                className="h-8 w-12 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={settings.overlay_color || '#000000'}
                onChange={e => handleSettingsChange('overlay_color', e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-1.5 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Overlay Opacity</label>
              <span className="text-xs font-bold text-[#e94560]">
                {Math.round((settings.overlay_opacity ?? 0.3) * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.overlay_opacity ?? 0.3}
                onChange={e => handleSettingsChange('overlay_opacity', parseFloat(e.target.value))}
                className="flex-grow accent-[#e94560] h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="relative flex items-center w-20 flex-shrink-0">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round((settings.overlay_opacity ?? 0.3) * 100)}
                  onChange={e => {
                    const pct = Number(e.target.value);
                    if (!isNaN(pct)) {
                      handleSettingsChange('overlay_opacity', Math.min(Math.max(pct, 0), 100) / 100);
                    }
                  }}
                  className="w-full pl-3 pr-7 py-1 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                />
                <span className="absolute right-2 text-[10px] font-bold text-gray-400 uppercase select-none">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500">Heading Color</label>
              <div className="flex gap-1.5 items-center">
                <input
                  type="color"
                  value={settings.heading_color || '#ffffff'}
                  onChange={e => handleSettingsChange('heading_color', e.target.value)}
                  className="h-6 w-8 rounded border border-gray-200 dark:border-gray-800 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={settings.heading_color || '#ffffff'}
                  onChange={e => handleSettingsChange('heading_color', e.target.value)}
                  className="w-full px-2 py-1 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-lg text-[11px] font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500">Subtitle Color</label>
              <div className="flex gap-1.5 items-center">
                <input
                  type="color"
                  value={settings.subtitle_color || '#e0e0e0'}
                  onChange={e => handleSettingsChange('subtitle_color', e.target.value)}
                  className="h-6 w-8 rounded border border-gray-200 dark:border-gray-800 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={settings.subtitle_color || '#e0e0e0'}
                  onChange={e => handleSettingsChange('subtitle_color', e.target.value)}
                  className="w-full px-2 py-1 bg-white dark:bg-[#0f0f1b]/50 border border-gray-200 dark:border-gray-800 rounded-lg text-[11px] font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
