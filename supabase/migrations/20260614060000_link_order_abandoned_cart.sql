-- Database trigger to automatically link a newly placed order to any active abandoned cart with a matching phone number
CREATE OR REPLACE FUNCTION link_order_to_abandoned_cart()
RETURNS TRIGGER AS $$
DECLARE
  v_phone TEXT;
BEGIN
  -- Extract digits from customer phone to perform clean comparison
  IF NEW.customer_phone IS NOT NULL THEN
    v_phone := regexp_replace(NEW.customer_phone, '\D', '', 'g');
  END IF;

  -- Match any unrecovered abandoned cart for the customer and mark as recovered/ordered
  IF v_phone IS NOT NULL AND v_phone <> '' THEN
    UPDATE abandoned_carts
    SET order_placed = true,
        order_id = NEW.id,
        recovered_at = NOW(),
        updated_at = NOW()
    WHERE order_placed = false
      AND (
        (customer_phone IS NOT NULL AND regexp_replace(customer_phone, '\D', '', 'g') = v_phone)
        OR
        (customer_phone = NEW.customer_phone)
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_link_order_to_abandoned_cart ON orders;
CREATE TRIGGER trigger_link_order_to_abandoned_cart
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION link_order_to_abandoned_cart();
