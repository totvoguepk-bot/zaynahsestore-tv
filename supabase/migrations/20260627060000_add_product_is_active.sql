-- Migration: Add is_active column to products for visibility toggle
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
