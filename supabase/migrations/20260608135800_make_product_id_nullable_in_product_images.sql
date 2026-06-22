-- Migration to drop NOT NULL constraint from product_id in product_images
ALTER TABLE product_images ALTER COLUMN product_id DROP NOT NULL;
