-- Fix race condition: use FOR UPDATE to lock store_settings row
-- Prevents two concurrent orders from reading the same next_order_sequence
-- NOTE: FOR UPDATE cannot be used with SELECT INTO in PL/pgSQL, so we use PERFORM first
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  seq_val INTEGER;
BEGIN
  -- Lock the store_settings row first
  PERFORM id FROM store_settings FOR UPDATE;
  -- Now read safely — no race condition since we hold the row lock
  SELECT order_prefix, next_order_sequence INTO prefix, seq_val FROM store_settings LIMIT 1;
  IF prefix IS NULL OR prefix = '' THEN
    prefix := 'ZE-';
  END IF;
  IF seq_val IS NULL THEN
    seq_val := 1;
  END IF;
  NEW.order_number := prefix || LPAD(seq_val::TEXT, 4, '0');
  UPDATE store_settings SET next_order_sequence = seq_val + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();
