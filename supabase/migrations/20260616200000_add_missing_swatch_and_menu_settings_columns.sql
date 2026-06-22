-- Migration: Add missing swatch and menu settings columns to store_settings
-- Reason: Fix PGRST204 errors caused by missing columns enable_variant_swatches, swatch_shape, swatch_size, navigation_menu, header_desktop_menu_align in live database.

ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS enable_variant_swatches BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS swatch_shape TEXT DEFAULT 'circle',
  ADD COLUMN IF NOT EXISTS swatch_size TEXT DEFAULT 'md',
  ADD COLUMN IF NOT EXISTS navigation_menu JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS header_desktop_menu_align TEXT DEFAULT 'center';

-- Populate default menu for the settings row if empty
UPDATE store_settings
SET navigation_menu = '[
  {"id": "1", "label": "Home", "url": "/"},
  {"id": "2", "label": "Shop", "url": "/shop"}
]'::jsonb
WHERE id = '00000000-0000-4000-8000-000000000001'
AND (navigation_menu IS NULL OR navigation_menu = '[]'::jsonb);
