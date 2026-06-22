-- Migration to add show_image_swatch column to product_variants table
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS show_image_swatch BOOLEAN DEFAULT false;
