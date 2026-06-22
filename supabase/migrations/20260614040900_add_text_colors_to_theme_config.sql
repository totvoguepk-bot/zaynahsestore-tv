-- Update default value for theme_config column in store_settings table
ALTER TABLE store_settings 
ALTER COLUMN theme_config SET DEFAULT '{
  "colors": {
    "primary": "#000000",
    "secondary": "#444444",
    "accent": "#C8A97E",
    "background": "#FFFFFF",
    "surface": "#F9F9F9",
    "textPrimary": "#111111",
    "textSecondary": "#666666",
    "border": "#EEEEEE",
    "textHeading": "#000000",
    "textAccent": "#C8A97E"
  },
  "fonts": {
    "heading": "Playfair Display",
    "body": "Inter"
  },
  "typography": {
    "fontSizeBase": 16
  },
  "buttons": {
    "borderRadius": 0,
    "primaryBg": "#000000",
    "primaryText": "#FFFFFF",
    "primaryHover": "#333333"
  },
  "cards": {
    "borderRadius": 0
  }
}'::jsonb;

-- Merge existing settings colors to include textHeading and textAccent using fallback values
UPDATE store_settings
SET theme_config = jsonb_set(
  jsonb_set(
    theme_config,
    '{colors,textHeading}',
    COALESCE(theme_config->'colors'->'textHeading', theme_config->'colors'->'textPrimary', '"#111111"'::jsonb)
  ),
  '{colors,textAccent}',
  COALESCE(theme_config->'colors'->'textAccent', theme_config->'colors'->'accent', '"#e94560"'::jsonb)
)
WHERE id = '00000000-0000-4000-8000-000000000001'
  AND theme_config IS NOT NULL 
  AND theme_config->'colors' IS NOT NULL;
