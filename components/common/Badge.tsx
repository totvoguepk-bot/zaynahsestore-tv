import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'sale' | 'new' | 'hot' | 'bestseller' | 'limited' | 'outofstock' | 'featured';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
  customText?: string;
}

const variantsMap: Record<BadgeVariant, string> = {
  sale:        'bg-accent text-white',
  new:         'bg-primary text-white',
  hot:         'bg-orange-500 text-white',
  bestseller:  'bg-secondary text-white',
  limited:     'bg-warning text-white',
  outofstock:  'bg-muted text-white',
  featured:    'bg-purple-600 text-white',
};

const labelsMap: Record<BadgeVariant, string> = {
  sale:        'Sale',
  new:         'New',
  hot:         'Hot 🔥',
  bestseller:  'Best Seller',
  limited:     'Limited',
  outofstock:  'Out of Stock',
  featured:    'Featured',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, customText, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'text-[10px] sm:text-xs font-heading font-bold px-2.5 py-1 rounded-badge uppercase tracking-wide inline-flex items-center justify-center select-none shrink-0',
          variantsMap[variant],
          className
        )}
        {...props}
      >
        {customText || labelsMap[variant]}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
