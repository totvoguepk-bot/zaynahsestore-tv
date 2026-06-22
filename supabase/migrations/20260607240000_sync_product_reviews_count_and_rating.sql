-- One-time sync for existing products
UPDATE products p
SET 
  reviews_count = (
    SELECT COALESCE(COUNT(*), 0)
    FROM reviews r
    WHERE r.product_id = p.id AND r.approved = true
  ),
  rating = COALESCE(
    (
      SELECT ROUND(AVG(r.rating)::numeric, 1)
      FROM reviews r
      WHERE r.product_id = p.id AND r.approved = true
    ),
    5.0
  );

-- Create trigger function to keep product stats in sync on review changes
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
      WHERE product_id = v_product_id AND approved = true
    ),
    rating = COALESCE(
      (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews
        WHERE product_id = v_product_id AND approved = true
      ),
      5.0
    )
  WHERE id = v_product_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_update_product_reviews_stats ON reviews;

-- Create the trigger
CREATE TRIGGER trigger_update_product_reviews_stats
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_reviews_stats();
