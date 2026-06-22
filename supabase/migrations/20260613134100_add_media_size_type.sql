-- Migration: Add file_size and mime_type columns to media_library
-- Date: 2026-06-13

ALTER TABLE media_library ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE media_library ADD COLUMN IF NOT EXISTS mime_type TEXT;

-- Backfill mime_type from file_url extension
UPDATE media_library
SET mime_type = CASE
  WHEN file_url LIKE '%.mp4' OR file_url LIKE '%.mp4?%' THEN 'video/mp4'
  WHEN file_url LIKE '%.mov' OR file_url LIKE '%.mov?%' THEN 'video/quicktime'
  WHEN file_url LIKE '%.webm' OR file_url LIKE '%.webm?%' THEN 'video/webm'
  WHEN file_url LIKE '%.ogg' OR file_url LIKE '%.ogg?%' THEN 'video/ogg'
  WHEN file_url LIKE '%.webp' OR file_url LIKE '%.webp?%' THEN 'image/webp'
  WHEN file_url LIKE '%.png' OR file_url LIKE '%.png?%' THEN 'image/png'
  WHEN file_url LIKE '%.jpg' OR file_url LIKE '%.jpg?%' OR file_url LIKE '%.jpeg' OR file_url LIKE '%.jpeg?%' THEN 'image/jpeg'
  WHEN file_url LIKE '%.avif' OR file_url LIKE '%.avif?%' THEN 'image/avif'
  WHEN file_url LIKE '%.gif' OR file_url LIKE '%.gif?%' THEN 'image/gif'
  ELSE 'image/webp'
END
WHERE mime_type IS NULL;

-- Backfill file_size to a dummy default (50KB) for existing records
UPDATE media_library
SET file_size = 50000
WHERE file_size IS NULL;
