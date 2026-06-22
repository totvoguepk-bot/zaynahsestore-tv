-- ============================================================
-- Migration: Storefront Swatch Limits & Default Variant Display
-- Date: 2026-06-07
-- ============================================================

-- 1. Add columns to store_settings
ALTER TABLE store_settings 
  ADD COLUMN IF NOT EXISTS swatch_limit INTEGER DEFAULT 8,
  ADD COLUMN IF NOT EXISTS default_variant_index INTEGER DEFAULT 1;

-- 2. Add column to products
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS show_swatches_on_archive BOOLEAN DEFAULT true;
