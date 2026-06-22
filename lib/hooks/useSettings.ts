import { useState, useEffect } from 'react';
import { StoreSettings } from '@/lib/types';

/**
 * Fetches live settings directly from the API route (no cache).
 * Pass `initialSettings` from SSR to show immediately while loading,
 * then seamlessly override with the latest live values once fetched.
 */
export const useSettings = (initialSettings?: StoreSettings) => {
  const [settings, setSettings] = useState<StoreSettings | null>(initialSettings ?? null);
  const [loading, setLoading] = useState(!initialSettings);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    const fetchLiveSettings = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Settings API error: ${res.status}`);
        const row = await res.json();

        if (!active) return;

        // Merge raw DB row into initial settings — only override fields we know exist
        setSettings(prev => ({
          ...prev,
          // Card display
          card_style: row.card_style ?? prev?.card_style ?? 'style1',
          card_show_swatches: row.card_show_swatches ?? prev?.card_show_swatches ?? true,
          card_show_sizes: row.card_show_sizes ?? prev?.card_show_sizes ?? true,
          card_show_materials: row.card_show_materials ?? prev?.card_show_materials ?? true,
          card_show_custom: row.card_show_custom ?? prev?.card_show_custom ?? true,
          card_show_custom_2: row.card_show_custom_2 ?? prev?.card_show_custom_2 ?? true,
          card_show_type_color: row.card_show_type_color ?? prev?.card_show_type_color ?? true,
          card_show_type_size: row.card_show_type_size ?? prev?.card_show_type_size ?? true,
          card_show_type_material: row.card_show_type_material ?? prev?.card_show_type_material ?? true,
          card_show_type_custom: row.card_show_type_custom ?? prev?.card_show_type_custom ?? true,
          card_show_stars: row.card_show_stars ?? prev?.card_show_stars ?? true,
          card_show_quickview: row.card_show_quickview ?? prev?.card_show_quickview ?? true,
          card_show_wishlist: row.card_show_wishlist ?? prev?.card_show_wishlist ?? true,
          card_show_quickcart: row.card_show_quickcart ?? prev?.card_show_quickcart ?? true,
          card_show_description: row.card_show_description ?? prev?.card_show_description ?? false,
          card_alignment: row.card_alignment ?? prev?.card_alignment,
          card_elements_order: row.card_elements_order ?? prev?.card_elements_order,
          card_mobile_columns: row.card_mobile_columns ?? prev?.card_mobile_columns ?? 2,
          // Variant display
          swatchLimit: row.swatch_limit ?? prev?.swatchLimit ?? 8,
          swatchShape: row.swatch_shape ?? prev?.swatchShape ?? 'circle',
          archiveSwatchSize: row.archive_swatch_size ?? prev?.archiveSwatchSize ?? 'md',
          productSwatchSize: row.product_swatch_size ?? prev?.productSwatchSize ?? 'md',
          archiveSwatchAlign: row.archive_swatch_align ?? prev?.archiveSwatchAlign ?? 'left',
          defaultVariantIndex: row.default_variant_index ?? prev?.defaultVariantIndex ?? 1,
          enableVariantSwatches: row.enable_variant_swatches ?? prev?.enableVariantSwatches ?? true,
        } as StoreSettings));

        setError(null);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLiveSettings();
    return () => { active = false; };
  }, []);

  return { settings, loading, error };
};
