-- Add navigation_menu and header_desktop_menu_align to store_settings
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS navigation_menu JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS header_desktop_menu_align TEXT DEFAULT 'center';

-- Populate default menu for the existing settings row
UPDATE store_settings
SET navigation_menu = '[
  {"id": "1", "label": "Home", "url": "/"},
  {"id": "2", "label": "Shop", "url": "/shop"}
]'::jsonb
WHERE id = '00000000-0000-4000-8000-000000000001'
AND (navigation_menu IS NULL OR navigation_menu = '[]'::jsonb);
