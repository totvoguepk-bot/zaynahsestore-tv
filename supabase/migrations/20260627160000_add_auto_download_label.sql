-- Migration: Add auto_download_label toggle to store_settings for PostEx label PDF auto-download
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS postex_auto_download_label BOOLEAN DEFAULT FALSE;
