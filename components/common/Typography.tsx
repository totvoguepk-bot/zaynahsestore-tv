import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function Heading1({ className, as: Component = 'h1', ...props }: TypographyProps) {
  return (
    <Component
      className={cn('font-heading text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white', className)}
      {...props}
    />
  );
}

export function Heading2({ className, as: Component = 'h2', ...props }: TypographyProps) {
  return (
    <Component
      className={cn('font-heading text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white', className)}
      {...props}
    />
  );
}

export function Heading3({ className, as: Component = 'h3', ...props }: TypographyProps) {
  return (
    <Component
      className={cn('font-heading text-xl font-semibold text-gray-900 dark:text-white', className)}
      {...props}
    />
  );
}

export function Body({ className, as: Component = 'p', ...props }: TypographyProps) {
  return (
    <Component
      className={cn('font-body text-base leading-relaxed text-text', className)}
      {...props}
    />
  );
}

export function Muted({ className, as: Component = 'span', ...props }: TypographyProps) {
  return (
    <Component
      className={cn('font-body text-sm text-text-muted', className)}
      {...props}
    />
  );
}

export function Price({ className, as: Component = 'span', ...props }: TypographyProps) {
  return (
    <Component
      className={cn('font-heading text-xl font-bold text-[#e94560] dark:text-[#fb7185]', className)}
      {...props}
    />
  );
}

export function OldPrice({ className, as: Component = 'span', ...props }: TypographyProps) {
  return (
    <Component
      className={cn('font-body text-base line-through text-text-muted opacity-60', className)}
      {...props}
    />
  );
}

export function Label({ className, as: Component = 'span', ...props }: TypographyProps) {
  return (
    <Component
      className={cn('font-heading text-xs font-semibold uppercase tracking-wider text-text-muted', className)}
      {...props}
    />
  );
}
