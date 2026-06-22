-- Migration: Add policies to allow public guest checkout submissions and returning order data
-- Date: 2026-06-14

DROP POLICY IF EXISTS "Public insert orders" ON orders;
CREATE POLICY "Public insert orders" ON orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public select orders" ON orders;
CREATE POLICY "Public select orders" ON orders
  FOR SELECT USING (true);
