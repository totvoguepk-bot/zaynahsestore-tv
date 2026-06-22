-- Migration to add footer bottom copyright text editable field to settings
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS footer_bottom_text TEXT DEFAULT 'All rights reserved.';
