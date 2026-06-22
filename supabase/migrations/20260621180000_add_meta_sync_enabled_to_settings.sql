-- Migration: Add meta_sync_enabled column to store_settings table
-- Enabled/disabled global Meta Catalog synchronization (disabled by default)

ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS meta_sync_enabled BOOLEAN DEFAULT false;
