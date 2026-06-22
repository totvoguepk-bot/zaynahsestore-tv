-- ============================================================
-- Migration: Variant Color-Image Linking + Presets + Swatch Settings
-- Date: 2026-06-07
-- ============================================================

-- 1. Add color_hex to product_variants (for solid color swatches)
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS color_hex TEXT;

-- 2. Create variant_presets table
CREATE TABLE IF NOT EXISTS variant_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  attribute TEXT NOT NULL,  -- 'color', 'size', 'material', 'custom'
  values JSONB NOT NULL,    -- [{ "label": "Red", "hex": "#e94560", "imageUrl": null }]
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE variant_presets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin all variant_presets" ON variant_presets;
CREATE POLICY "Admin all variant_presets" ON variant_presets
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read variant_presets" ON variant_presets;
CREATE POLICY "Public read variant_presets" ON variant_presets
  FOR SELECT USING (true);

-- 3. Add swatch display settings to store_settings
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS enable_variant_swatches BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS swatch_shape TEXT DEFAULT 'circle',  -- 'circle' | 'square'
  ADD COLUMN IF NOT EXISTS swatch_size TEXT DEFAULT 'md';       -- 'sm' | 'md' | 'lg'

-- 4. Seed built-in variant presets (only if table is empty)
INSERT INTO variant_presets (name, attribute, values)
SELECT * FROM (VALUES
  ('Kids Sizes (Years)', 'size', '[{"label":"1-2y"},{"label":"2-3y"},{"label":"3-4y"},{"label":"4-5y"},{"label":"5-6y"},{"label":"6-7y"},{"label":"7-8y"},{"label":"8-9y"},{"label":"9-10y"},{"label":"10-11y"},{"label":"11-12y"}]'::jsonb),
  ('Kids Sizes (Number)', 'size', '[{"label":"22"},{"label":"24"},{"label":"26"},{"label":"28"},{"label":"30"},{"label":"32"},{"label":"34"},{"label":"36"},{"label":"38"},{"label":"40"}]'::jsonb),
  ('Adult Sizes (Clothing)', 'size', '[{"label":"XS"},{"label":"S"},{"label":"M"},{"label":"L"},{"label":"XL"},{"label":"XXL"},{"label":"3XL"}]'::jsonb),
  ('Shoe Sizes (UK)', 'size', '[{"label":"4"},{"label":"5"},{"label":"6"},{"label":"7"},{"label":"8"},{"label":"9"},{"label":"10"},{"label":"11"},{"label":"12"}]'::jsonb),
  ('Standard Colors', 'color', '[{"label":"Black","hex":"#000000"},{"label":"White","hex":"#ffffff"},{"label":"Red","hex":"#e94560"},{"label":"Navy Blue","hex":"#1a1a2e"},{"label":"Grey","hex":"#9ca3af"},{"label":"Green","hex":"#10b981"}]'::jsonb),
  ('Denim Colors', 'color', '[{"label":"Light Blue","hex":"#93c5fd"},{"label":"Dark Blue","hex":"#1e3a8a"},{"label":"Black","hex":"#000000"},{"label":"Grey","hex":"#6b7280"},{"label":"White","hex":"#f9fafb"}]'::jsonb),
  ('Material Types', 'material', '[{"label":"Cotton"},{"label":"Polyester"},{"label":"Wool"},{"label":"Silk"},{"label":"Denim"},{"label":"Linen"}]'::jsonb)
) AS t(name, attribute, values)
WHERE NOT EXISTS (SELECT 1 FROM variant_presets LIMIT 1);
