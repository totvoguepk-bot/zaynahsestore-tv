-- Migration: Add coupon_codes_enabled column to store_settings
-- Date: 2026-06-16
-- Reason: updateSettings() service was referencing coupon_codes_enabled in the
--         UPDATE payload but the column did not exist in the DB, causing
--         PGRST204 error "Could not find the 'coupon_codes_enabled' column of
--         'store_settings' in the schema cache" → 500 Internal Server Error
--         on every settings save.

ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS coupon_codes_enabled BOOLEAN DEFAULT true;
