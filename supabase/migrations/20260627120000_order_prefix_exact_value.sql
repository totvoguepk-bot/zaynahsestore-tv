-- Use order_prefix as the exact order_number (no sequence appended)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
BEGIN
  SELECT order_prefix INTO prefix FROM store_settings LIMIT 1;
  IF prefix IS NOT NULL AND prefix != '' THEN
    NEW.order_number := prefix;
  ELSE
    NEW.order_number := 'ZE-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
