-- Migration: Add footer and social fields to store_settings
-- Created: 2026-06-07

ALTER TABLE store_settings 
  ADD COLUMN IF NOT EXISTS footer_text TEXT,
  ADD COLUMN IF NOT EXISTS social_facebook TEXT,
  ADD COLUMN IF NOT EXISTS social_instagram TEXT,
  ADD COLUMN IF NOT EXISTS social_whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS social_youtube TEXT;
