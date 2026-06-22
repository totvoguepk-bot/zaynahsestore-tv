-- Add badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bg_color TEXT NOT NULL DEFAULT '#e94560',
  text_color TEXT NOT NULL DEFAULT '#ffffff',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on badges
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Policies for badges
DROP POLICY IF EXISTS "Public read badges" ON badges;
CREATE POLICY "Public read badges" ON badges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin all badges" ON badges;
CREATE POLICY "Admin all badges" ON badges FOR ALL USING (auth.role() = 'authenticated');

-- Alter products to add badge configuration columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS custom_badge_id UUID REFERENCES badges(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge_enabled BOOLEAN DEFAULT true;

-- Alter store_settings to add design & archive configuration columns
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS image_hover_style TEXT DEFAULT 'second_image';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS image_aspect_ratio TEXT DEFAULT '1:1';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS title_line_limit TEXT DEFAULT '2';
