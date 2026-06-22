-- Migration: Add hidden column to reviews and update rating stats sync trigger function

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;

-- Update trigger function to exclude hidden reviews
CREATE OR REPLACE FUNCTION update_product_reviews_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_product_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_product_id := OLD.product_id;
  ELSE
    v_product_id := NEW.product_id;
  END IF;

  UPDATE products
  SET 
    reviews_count = (
      SELECT COALESCE(COUNT(*), 0)
      FROM reviews
      WHERE product_id = v_product_id AND approved = true AND COALESCE(hidden, false) = false
    ),
    rating = COALESCE(
      (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews
        WHERE product_id = v_product_id AND approved = true AND COALESCE(hidden, false) = false
      ),
      5.0
    )
  WHERE id = v_product_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
