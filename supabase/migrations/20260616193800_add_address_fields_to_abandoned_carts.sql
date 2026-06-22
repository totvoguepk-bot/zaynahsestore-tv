-- Migration: Add customer address fields to abandoned_carts
-- Date: 2026-06-16
-- Reason: abandoned_carts table was missing 4 address columns that the
--         upsertAbandonedCart() service function was trying to insert/update,
--         causing 400 Bad Request errors from Supabase PostgREST.

ALTER TABLE public.abandoned_carts
  ADD COLUMN IF NOT EXISTS customer_address    text,
  ADD COLUMN IF NOT EXISTS customer_city       text,
  ADD COLUMN IF NOT EXISTS customer_apartment  text,
  ADD COLUMN IF NOT EXISTS customer_postal_code text;
