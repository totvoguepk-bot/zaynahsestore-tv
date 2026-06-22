-- Add size and mime_type columns to product_images table
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS size INTEGER;
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS mime_type TEXT;

-- Guess and backfill mime_type for existing records based on file extension
UPDATE product_images
SET mime_type = CASE
  WHEN url LIKE '%.mp4' THEN 'video/mp4'
  WHEN url LIKE '%.mov' THEN 'video/quicktime'
  WHEN url LIKE '%.webm' THEN 'video/webm'
  WHEN url LIKE '%.png' THEN 'image/png'
  WHEN url LIKE '%.jpg' OR url LIKE '%.jpeg' THEN 'image/jpeg'
  WHEN url LIKE '%.gif' THEN 'image/gif'
  ELSE 'image/webp'
END
WHERE mime_type IS NULL;

-- Guess and backfill size (bytes) for existing records
UPDATE product_images
SET size = CASE
  WHEN url LIKE '%.mp4' OR url LIKE '%.mov' OR url LIKE '%.webm' THEN 5242880 -- 5MB default for legacy videos
  ELSE 46080 -- 45KB default for legacy images
END
WHERE size IS NULL;
