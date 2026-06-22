-- ============================================================
-- ADD META CATALOG SYNC COLUMNS & MAPPINGS
-- ============================================================

-- 1. Alter products table to add sync tracing fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_sync_status TEXT DEFAULT 'pending';
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_sync_error TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_last_synced_at TIMESTAMPTZ;

-- 2. Create meta_category_mapping table
CREATE TABLE IF NOT EXISTS meta_category_mapping (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE UNIQUE,
  meta_category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS and setup policies
ALTER TABLE meta_category_mapping ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read meta mappings" ON meta_category_mapping;
CREATE POLICY "Public read meta mappings" ON meta_category_mapping
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin all meta mappings" ON meta_category_mapping;
CREATE POLICY "Admin all meta mappings" ON meta_category_mapping
  FOR ALL USING (auth.role() = 'authenticated');
