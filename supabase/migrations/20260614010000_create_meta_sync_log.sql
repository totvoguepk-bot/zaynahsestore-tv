-- Migration: Create meta_sync_log table
-- Purpose: Break infinite webhook loop caused by meta sync writing back to products table.
-- Date: 2026-06-14

CREATE TABLE IF NOT EXISTS public.meta_sync_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  status      text NOT NULL CHECK (status IN ('synced', 'error', 'skipped')),
  error       text,
  action      text NOT NULL DEFAULT 'UPDATE' CHECK (action IN ('UPDATE', 'DELETE')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookup by product
CREATE INDEX IF NOT EXISTS idx_meta_sync_log_product_id ON public.meta_sync_log(product_id);
-- Index for latest status per product
CREATE INDEX IF NOT EXISTS idx_meta_sync_log_created_at ON public.meta_sync_log(created_at DESC);

-- RLS: Only authenticated users (admins) can read logs
ALTER TABLE public.meta_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read meta_sync_log"
  ON public.meta_sync_log FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role insert meta_sync_log"
  ON public.meta_sync_log FOR INSERT
  WITH CHECK (true);
