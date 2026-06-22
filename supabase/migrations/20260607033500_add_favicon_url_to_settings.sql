-- Migration: Add favicon_url to store_settings
-- Created: 2026-06-07

ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS favicon_url TEXT;
