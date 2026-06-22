import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { getProductsClient } from '@/lib/services/products-client';

export const useProducts = (categoryId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsClient(categoryId);
        if (active) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => { active = false; };
  }, [categoryId]);

  return { products, loading, error };
};
