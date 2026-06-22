-- Add rating, reviews_count, and short_description columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS short_description TEXT;
