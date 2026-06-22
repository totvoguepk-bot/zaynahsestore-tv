-- Add theme_preset and theme_config to store_settings table
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS theme_preset TEXT DEFAULT 'classic_white',
ADD COLUMN IF NOT EXISTS theme_config JSONB DEFAULT '{
  "colors": {
    "primary": "#000000",
    "secondary": "#444444",
    "accent": "#C8A97E",
    "background": "#FFFFFF",
    "surface": "#F9F9F9",
    "textPrimary": "#111111",
    "textSecondary": "#666666",
    "border": "#EEEEEE"
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

-- Update existing default settings row with the default configuration if empty
UPDATE store_settings 
SET 
  theme_preset = COALESCE(theme_preset, 'classic_white'),
  theme_config = COALESCE(theme_config, '{
    "colors": {
      "primary": "#000000",
      "secondary": "#444444",
      "accent": "#C8A97E",
      "background": "#FFFFFF",
      "surface": "#F9F9F9",
      "textPrimary": "#111111",
      "textSecondary": "#666666",
      "border": "#EEEEEE"
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
  }'::jsonb)
WHERE id = '00000000-0000-4000-8000-000000000001';
