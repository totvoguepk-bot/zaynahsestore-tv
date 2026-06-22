-- Migration: Add separate header sticky settings for mobile and desktop
-- Date: 2026-06-13

ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS header_sticky_desktop BOOLEAN DEFAULT TRUE;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS header_sticky_mobile BOOLEAN DEFAULT TRUE;

-- Update existing records to match the current header_sticky value
UPDATE store_settings
SET 
  header_sticky_desktop = COALESCE(header_sticky, TRUE),
  header_sticky_mobile = COALESCE(header_sticky, TRUE);
