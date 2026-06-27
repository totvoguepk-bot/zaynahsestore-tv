-- Make generate_order_number() SECURITY DEFINER + add WHERE clause to UPDATE
-- 1. SECURITY DEFINER: guest/anonymous users (anon role) can place orders.
--    The trigger needs to UPDATE store_settings (increment next_order_sequence),
--    but anon only has SELECT on that table. SECURITY DEFINER makes the trigger
--    run with the owner's privileges.
-- 2. WHERE clause: Supabase safe update mode blocks UPDATE without WHERE.
-- 3. Combined SELECT ... INTO ... FOR UPDATE in one statement (works in PL/pgSQL).

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER SECURITY DEFINER AS $$
DECLARE
  prefix TEXT;
  seq_val INTEGER;
  settings_id UUID;
BEGIN
  SELECT id, order_prefix, next_order_sequence INTO settings_id, prefix, seq_val FROM store_settings FOR UPDATE;
  IF prefix IS NULL OR prefix = '' THEN
    prefix := 'ZE-';
  END IF;
  IF seq_val IS NULL THEN
    seq_val := 1;
  END IF;
  NEW.order_number := prefix || LPAD(seq_val::TEXT, 4, '0');
  UPDATE store_settings SET next_order_sequence = seq_val + 1 WHERE id = settings_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
