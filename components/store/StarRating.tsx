'use client';

import React from 'react';
import { Star } from '@/components/common/Icons';

interface StarRatingProps {
  rating: number; // 0 to 5
  count?: number; // total number of reviews
  interactive?: boolean; // editable mode
  onChange?: (rating: number) => void;
  starSize?: number; // size in pixels
  showText?: boolean;
}

export default function StarRating({
  rating = 0,
  count,
  interactive = false,
  onChange,
  starSize = 20,
  showText = true
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  // Render a star with partial fill support
  const renderStar = (index: number) => {
    const starIndex = index + 1; // 1-indexed

    // If interactive, stars are either fully filled or empty
    if (interactive) {
      const isFilled = starIndex <= activeRating;
      const size = Math.max(44, starSize); // Ensure 44px tap target in interactive mode
      return (
        <button
          key={index}
          type="button"
          onClick={() => handleClick(starIndex)}
          onMouseEnter={() => handleMouseEnter(starIndex)}
          onMouseLeave={handleMouseLeave}
          className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e94560]/20 hover:scale-110 active:scale-95 transition-transform cursor-pointer flex items-center justify-center"
          style={{ width: `${size}px`, height: `${size}px` }}
          aria-label={`Rate ${starIndex} out of 5 stars`}
        >
          <Star
            size={starSize}
            className={`transition-colors duration-150 ${
              isFilled
                ? 'fill-[#f59e0b] text-[#f59e0b]'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      );
    }

    // Read-only logic with partial/fractional fill (using SVG clipPath or linearGradient)
    const fillPercent = Math.min(100, Math.max(0, (rating - index) * 100));

    return (
      <div key={index} className="relative inline-block" style={{ width: `${starSize}px`, height: `${starSize}px` }}>
        {/* Grey background star */}
        <Star
          size={starSize}
          className="text-gray-300 dark:text-gray-700"
        />
        {/* Gold filled foreground star with clipPath */}
        {fillPercent > 0 && (
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${fillPercent}%`, height: '100%' }}
          >
            <Star
              size={starSize}
              className="text-[#f59e0b] fill-[#f59e0b]"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => renderStar(i))}
      </div>

      {showText && !interactive && (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
          <span className="text-gray-900 dark:text-white font-bold">{rating > 0 ? rating.toFixed(1) : '0.0'}</span>
          {count !== undefined && (
            <span className="text-gray-400 dark:text-gray-500 font-medium">
              ({count} {count === 1 ? 'review' : 'reviews'})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
