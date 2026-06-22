-- Migration to add variation_order column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS variation_order TEXT[] DEFAULT NULL;
