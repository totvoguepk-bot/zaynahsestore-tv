-- Migration: Add deleted_at columns for soft-deletion support
-- Created: 2026-06-20 18:49:00

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.media_library ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.whatsapp_subscribers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.email_subscribers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Indexes for soft delete checks
CREATE INDEX IF NOT EXISTS idx_orders_deleted_at ON public.orders (deleted_at);
CREATE INDEX IF NOT EXISTS idx_customers_deleted_at ON public.customers (deleted_at);
CREATE INDEX IF NOT EXISTS idx_media_library_deleted_at ON public.media_library (deleted_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_subscribers_deleted_at ON public.whatsapp_subscribers (deleted_at);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_deleted_at ON public.email_subscribers (deleted_at);
