ALTER TABLE media_library ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_media_library_sort_order ON media_library (sort_order);
