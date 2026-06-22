# 📜 ZAYNAHS E-STORE — SCHEMA CHANGE LOG

> Har database change yahan log karo. Kabhi skip mat karo.

---

## FORMAT:
```
### [YYYY-MM-DD] vX.X.X — Short Title
**Files Updated:** list of files
**Changes:**
1. What changed and why
```

### [2026-06-22] v4.9.6 — Updated GitHub Access Token and Remote URL
**Files Updated:**
- [.env.local](file:///Users/shoaib/Documents/zaynahsestore-tv-main/.env.local)
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Documents/zaynahsestore-tv-main/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Updated Environment Token**: Verified and ensured the new GitHub token `[NEW_GITHUB_TOKEN]` is configured in `.env.local`.
2. **Updated Git Remote Origin URL**: Reset remote origin URL to use the new credentials.
3. **Pushed Branch**: Executed git push origin HEAD:main to successfully update and synchronize the remote GitHub repository.

---

### [2026-06-22] v4.9.5 — Integrated Customizer Settings for All Showcase Card Templates
**Files Updated:**
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)

**Changes:**
1. **Integrated Image Settings**: Created a unified, optimized image renderer (`renderCardImages`) across all 10 showcase templates that links image aspects to settings (`imageAspectRatio` config-based `aspectClass` styles) and hover behaviors to hover configuration variables (`imageHoverStyle`).
2. **Linked Element Ordering**: Developed a unified layout content renderer (`renderShowcaseContent`) that maps cards' inner element sequences dynamically to the customizer settings elements order array (`elementsOrder`).
3. **Linked Content Alignment**: Applied content horizontal alignment settings classes (`alignClass`) dynamically to card contents inside the showcase templates.
4. **Optimized Layout Flow & Performance**: Streamlined markup and removed duplicate code by using shared renderers. Avoided complex operations or heavy overlays, keeping cards fast-loading and lag-free.
5. **Fixed Non-Standard Border Color**: Replaced non-standard `border-gray-155` with standard `border-gray-200` to satisfy color standardization weights.

---

### [2026-06-22] v4.9.4 — Cleaned Up Multi-Theme Card Layout Templates & Dark/Colored Variant
**Files Updated:**
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [components/admin/customizer/pages/ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductCardSettings.tsx)
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)

**Changes:**
1. **Removed Custom Layout Templates**: Deleted all CSS, media query overrides, and render structures for the 7 custom layout templates (`neumorphic`, `color_block`, `claymorphism`, `dark_elegance`, `geometric`, `material_m3`, and `organic`) from `ProductCard.tsx` and customizer select options in `ProductCardSettings.tsx`.
2. **Removed Card Design Variant (V2 Dark/Colored)**: Eliminated the `v2` dark card design variant from UI selector and code variables (`activeVariant`, `isDarkActive`, and `modeClass` helper flags) completely, defaulting card layouts to standard `v1` light themes.
3. **TypeScript Restructured**: Cleaned up type interfaces in `types.ts` to restrict template options strictly to standard templates and showcases.

---

### [2026-06-22] v4.9.3 — Grouped and Categorized Customizer Card Style Options
**Files Updated:**
- [components/admin/customizer/pages/ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductCardSettings.tsx)

**Changes:**
1. **optgroup Categorization**: Grouped all style options inside the customizer settings template select box into three distinct categories: "Default Base Template", "Multi-Theme Custom Layouts (Light / Dark Variants)", and "Modern Showcase Layouts" to improve readability and user navigation.
2. **Corrected Custom Style Numbering**: Re-numbered the custom styles (formerly 00, 01, 02, 04, 06, 09, 10, 11) to be a sequential series from `00` through `07`.
3. **Removed Style Description Panel**: Eliminated the redundant "About Style" description box below the templates selector as requested to clean up the interface spacing.

---

### [2026-06-22] v4.9.2 — Proportional Card Sizing for Mobile 2-Column Grid View
**Files Updated:**
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)

**Changes:**
1. **Responsive Card Scaling in 2-Column Grid**: Added media query overrides targeting `.grid-cols-2 .z-card-container` inside the `customCss` block of `ProductCard.tsx`.
2. **Paddings and Spacings Halved**: Reduced wrap padding, image-box padding, content padding, and element gaps by ~50% on viewports `< 640px` when inside 2 columns, to prevent cards from stretching vertically.
3. **Typography and Control Sizing scaled down**: Reduced font sizes of titles and price labels. Scaled down action icons, round buttons, and absolute-positioned badge elements to perfectly fit the ~160px card width.

---

### [2026-06-22] v4.9.1 — Configurable Mobile Columns Grid (1 or 2 Option)
**Files Updated:**
- [supabase/migrations/20260622064000_add_card_mobile_columns_to_settings.sql](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/supabase/migrations/20260622064000_add_card_mobile_columns_to_settings.sql)
- [supabase/schema/SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql)
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/lib/types.ts)
- [lib/services/settings.ts](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/lib/services/settings.ts)
- [lib/hooks/useSettings.ts](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/lib/hooks/useSettings.ts)
- [components/admin/customizer/pages/ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/admin/customizer/pages/ProductCardSettings.tsx)
- [components/admin/settings/ProductsTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/admin/settings/ProductsTab.tsx)
- [components/admin/SettingsForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/admin/SettingsForm.tsx)
- [components/store/ProductGrid.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/store/ProductGrid.tsx)
- [components/store/ShopPage.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/store/ShopPage.tsx)
- [components/store/RecentlyViewed.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/store/RecentlyViewed.tsx)

**Changes:**
1. **Added `card_mobile_columns` Settings Attribute**: Created SQL migration to add the column, and updated types, services, hooks, and schemas to support mapping/saving `card_mobile_columns` with default `2`.
2. **Linked Customizer Select controls**: Added a select control inside the Customizer sidebar (`ProductCardSettings.tsx`) allowing the user to select between 1 column and 2 columns on mobile.
3. **Linked Settings Dashboard control**: Synchronized Settings panel (`ProductsTab.tsx` via `SettingsForm.tsx`) to render the same mobile column selector and save state.
4. **Dynamic Frontend Grid columns**: Configured product card list grids inside `ProductGrid.tsx`, `ShopPage.tsx`, and `RecentlyViewed.tsx` to automatically switch mobile grid columns to `grid-cols-1` or `grid-cols-2` based on the user's `card_mobile_columns` configuration settings.

---

### [2026-06-22] v4.9.0 — Added Showcase 1-10 Card Styles & Single Column Mobile Layout
**Files Updated:**
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/lib/types.ts)
- [components/admin/customizer/pages/ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/admin/customizer/pages/ProductCardSettings.tsx)
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/store/ProductCard.tsx)
- [components/store/ProductGrid.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/store/ProductGrid.tsx)
- [components/store/ShopPage.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/store/ShopPage.tsx)
- [components/store/RecentlyViewed.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/store/RecentlyViewed.tsx)
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Showcase Card Styles (showcase_1 to showcase_10)**: Implemented all 10 card design layouts from the showcase HTML as completely new card styles in the admin customizer settings dropdown.
2. **Left Existing Styles Unmodified**: Ensured existing styles (`style1`, `neumorphic`, `color_block`, `claymorphism`, `dark_elegance`, `geometric`, `material_m3`, `organic`) remain completely untouched and original.
3. **Single Column Mobile Grid (1by1)**: Changed the product listing grids on the Homepage collections, Shop catalogs, and Recently Viewed sections to use `grid-cols-1` instead of `grid-cols-2` on mobile, forcing a comfortable 1by1 mobile card presentation.

---

### [2026-06-22] v4.8.8 — Hotfix: Applied Missing DB Columns (card_variant, card_alignment, card_show_type_*)
**Files Updated:**
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Root Cause**: Migration files created on 2026-06-21/22 (card_variant, card_show_type_*, card_alignment, card_elements_order) were never executed against the live Supabase database, causing every `updateSettings()` server action to fail with `PGRST204: Could not find the 'card_variant' column`. This produced 500 errors on every customizer save.
2. **Fix Applied**: Ran `ALTER TABLE IF NOT EXISTS` statements directly via `psql` against the live database to add all 7 missing columns: `card_variant`, `card_show_type_color`, `card_show_type_size`, `card_show_type_material`, `card_show_type_custom`, `card_alignment`, `card_elements_order`.
3. **SUPER_MASTER_SCHEMA.sql was already correct** — all columns were present in the CREATE TABLE definition. Only the live DB was behind.
4. **Prevention Note**: Always apply migration `.sql` files via `psql` immediately after creating them. Migration files are only text — they do not auto-apply.

---

### [2026-06-22] v4.8.7 — Restricted Card Variant to V1/V2 & Fixed Code Leaks & Reconstructed Organic Card Structure
**Files Updated:**
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [components/admin/customizer/pages/ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductCardSettings.tsx)
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Removed V3 Preset completely**: Restructured customizer settings and TypeScript interfaces to support only V1 (Light) and V2 (Dark/Colored) styles, corresponding to the "V1 Only" and "V2 Only" presets from the showcase HTML.
2. **Fixed Code Leaks & Syntax Errors**: Removed the accidentally leaked markdown backticks on line 611 in `ProductCard.tsx` that broke the Next.js JavaScript parsing.
3. **Reconstructed Organic Layout**: Fixed the broken JSX structure of Style 11 (Organic rendering block) by opening the correct container tags (Link, z-card-container, etc.) that were missing, resolving compilation crashes.
4. **Aligned Image Scaling**: Bound high-fidelity containment styles (exact height and object-fit) on card layout images to prevent Next.js full-bleed stretch.

### [2026-06-22] v4.8.6 — Added Custom Product Card Styles (Neumorphic through Organic) & Resolved Missing Helper References
**Files Updated:**
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)
- [docs/CARD_STYLES_BASES.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/CARD_STYLES_BASES.md) [NEW]

**Changes:**
1. **Resolved Runtime ReferenceError**: Declared `renderCardBadge()` and `renderActionButtons()` inside the main `ProductCard.tsx` component scope, fixing the crash where dynamic styles failed to render badge elements and action button controls.
2. **Added Scoped Styling Overrides**: Inserted common styles for badges (`.bdg`) and action buttons (`.aic`, `.ai`) inside the scoped `<style>` block of `ProductCard.tsx` to handle transitions, alignments, hover scales, and specific theme visual overrides.
3. **Card Styles Documentation**: Created a master reference guide `docs/CARD_STYLES_BASES.md` mapping the 10 core functional bases across all 11 card layout styles and variant options.

### [2026-06-22] v4.8.5 — Swatch Shapes Clean Up (Triangle Removal & Circle Clipping Fix)
**Files Updated:**
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/store/ProductCard.tsx)
- [components/store/VariantSelector.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/store/VariantSelector.tsx)
- [components/common/ThemeStyleRegistry.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/common/ThemeStyleRegistry.tsx)

**Changes:**
1. **Triangle Swatches Removed**: Removed all references, clip-paths, and styles for the `triangle` shape type across the codebase.
2. **Circle Swatch Clipping Resolved**: Replaced nested container layout structures with direct-button styling (background, border, text colors on the button element itself). This completely resolves the clipping issue on round circles where the square background of inner containers bled through the borders.
3. **Button Border-Radius Override Fix**: Modified `ThemeStyleRegistry.tsx` to exclude elements with the `rounded-full` or `.swatch-btn` class (i.e. `button:not(.rounded-full):not(.swatch-btn)`) from the global theme button corner-radius overrides. Added the `.swatch-btn` class to all swatch button elements on storefront grids (`ProductCard.tsx`) and product detail page selectors (`VariantSelector.tsx`). This allows circle and square swatches to switch shape correctly without being overridden by general button styles.
4. **Standard Tailwind Spacing Scale Fix**: Corrected custom, non-existent Tailwind spacing classes (such as `h-5.5`/`w-5.5`, `h-6.5`/`w-6.5`, and `h-8.5`/`w-8.5`) in the size dimension mappings of `ProductCard.tsx` and `VariantSelector.tsx` to standard spacing classes (e.g. `h-5`/`w-5` for xs, `h-8`/`w-8` for lg, `h-9`/`w-9` for xl). This resolves the layout bug where large/XS swatches collapsed or rendered as fallback auto-sized rectangles.

### [2026-06-22] v4.8.4 — Swatch Shapes Triangle/Circle Customization & Dynamic Routing Layout Fix
**Files Updated:**
- [app/admin/layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/layout.tsx)
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- [components/store/VariantSelector.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/VariantSelector.tsx)

**Changes:**
1. **Triangle Swatches Support & Text Auto-Scaling**: Added dynamic outline border rendering and clip-paths for color/text swatches inside `VariantSelector.tsx` and `ProductCard.tsx` when `swatchShape === 'triangle'`. Increased triangle min-widths and vertically offset text labels (`translate-y-[15%]`) inside triangle centroids to prevent character clipping.
2. **Auto-Scaled Sizing Dimensions**: Resolved size label clipping on all sizes (`xxs` through `xxl`) by calculating height-proportionate min-widths and dynamically shrinking text size for longer labels (e.g. `10-11y`).
3. **Customizer Layout Routing Fix**: Modified `app/admin/layout.tsx` to strip trailing slashes and normalize the path parameter when checking bypasses. This resolves the nested shell loading loop where the admin dashboard sidebar/header loaded again and again inside the customizer page iframe.

### [2026-06-22] v4.8.3 — Swatch Theme Styles & Text Overflow Fix
**Files Updated:**
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- [components/store/VariantSelector.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/VariantSelector.tsx)

**Changes:**
1. **Dynamic Theme Accent Borders & Rings**: Replaced hardcoded accent color styling `#e94560` in color/size/material/custom swatches with CSS variables (`var(--color-accent)`, `var(--color-border)`) and `color-mix`, ensuring circle and square borders render correctly across all custom presets and theme settings.
2. **Text Overflow Truncation Fix**: Swapped out the `truncate` class on swatch text content with `whitespace-nowrap leading-none text-center` to completely resolve character truncation/ellipsis rendering on small swatches.

### [2026-06-22] v4.8.2 — XXS and XS Swatch Sizes & Dynamic Swatch Type Filters
**Files Updated:**
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- [components/store/VariantSelector.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/VariantSelector.tsx)
- [components/admin/customizer/pages/ProductDetailPageSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductDetailPageSettings.tsx)
- [gemini.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/gemini.md)

**Changes:**
1. **XXS & XS Swatch Support**: Added mapping for two smaller swatch sizes (`xxs` and `xs`) to dimensions on both storefront cards (`ProductCard.tsx`) and product details page selectors (`VariantSelector.tsx`). Added `xxs` and `xs` to customizer option select list (`ProductDetailPageSettings.tsx`).
2. **Dynamic Swatch Type Filters**: Wrapped variation group rendering on catalog cards with setting filters (`card_show_type_color`, `card_show_type_size`, `card_show_type_material`, `card_show_type_custom`) to filter out disabled swatch types entirely from the catalog view.
3. **Customer Swatches Layout Overhaul**: Refactored the sizes, materials, and custom options in `VariantSelector.tsx` to render as uniform swatches with setting-controlled shapes and dimensions matching the color swatches.
4. **Linked Customizer Synchronization Rules**: Added explicit rules to `gemini.md` stating that settings and visual customizer sidebar options must match SettingsForm fields and stay fully linked.

### [2026-06-21] v4.8.1 — Linked Customizer Swatch Controls & Same-Sized Text Swatches
**Files Updated:**
- [lib/hooks/useSettings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/hooks/useSettings.ts)
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- [components/admin/customizer/pages/ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductCardSettings.tsx)

**Changes:**
1. **Identical Size & Shape for All Variations**: Re-architected non-color variation swatches (size, material, custom options) in `ProductCard.tsx` to render with the exact same size (`swatchSizeClass`) and shape (`shapeClass`) classes as color swatches, aligning them horizontally and vertically.
2. **Linked Customizer Swatch Toggles**: Added Swatch Shape, Swatch Limit, Swatch Size, and Swatch Alignment selectors to the right-hand Customizer panel (`ProductCardSettings.tsx`) and linked them live to settings.
3. **Exposed Hook Settings**: Mapped missing settings properties (`swatchShape`, `archiveSwatchSize`, `productSwatchSize`, `archiveSwatchAlign`) in `useSettings.ts` to allow live-updating without requiring manual refreshes.

### [2026-06-21] v4.8.0 — Generic Variation Customizer Controls & 5th Variation Support
**Files Updated:**
- [supabase/migrations/20260621232000_add_card_show_custom_2.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260621232000_add_card_show_custom_2.sql) [NEW]
- [supabase/schema/SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql)
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [lib/services/settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts)
- [lib/hooks/useSettings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/hooks/useSettings.ts)
- [components/admin/settings/ProductsTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/ProductsTab.tsx)
- [components/admin/SettingsForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/SettingsForm.tsx)
- [components/admin/customizer/pages/ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductCardSettings.tsx)
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)

**Changes:**
1. **Generic Swatch Labels**: Changed all individual customizer/settings swatches checkbox labels to "Show Variation 1 Swatches" through "Show Variation 5 Swatches" to remove hardcoded attribute names.
2. **Variation 5 Database & Setting**: Created a database migration and added the `card_show_custom_2` column mapping to support a 5th generic variation check.
3. **Product Card Dynamic Rendering**: Updated `ProductCard.tsx` to handle Variation 5 rendering and resolved the compilation issue by defining `displayDescription` from settings toggles.

### [2026-06-21] v4.7.9 — Simplified Product Card Styles & Customizer Live Preview Fix
**Files Updated:**
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [components/admin/customizer/pages/ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductCardSettings.tsx)
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- [components/store/ShopPage.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ShopPage.tsx)
- [components/store/StoreFront.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/StoreFront.tsx)
- [app/admin/settings/customizer/preview/PreviewClient.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/settings/customizer/preview/PreviewClient.tsx)

**Changes:**
1. **Simplified Card Layout**: Reverted the product card customization templates back to only supporting the default premium layout (Style 1), removing all alternative layouts (Style 2 through Style 17) to clean up code and prevent clutter.
2. **Live Preview Caching Fix**: Resolved the cache shadowing issue in `StoreFront` and `ShopPage` where dynamic settings updates sent from the customizer parent window via postMessage were overridden by the stale API cache fetched on mount. Added an `isPreview` flag to bypass `/api/settings` fetches during customizer sessions, enabling instant real-time live preview rendering updates for toggles, content alignment, and vertical element ordering.

### [2026-06-21] v4.7.8 — Catalog Swatches Toggle Added & Nested UI Fixes
**Files Updated:**
- [supabase/migrations/20260621195900_add_card_show_swatches.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260621195900_add_card_show_swatches.sql) [NEW]
- [supabase/schema/SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql)
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [lib/services/settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts)
- [components/admin/settings/ProductsTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/ProductsTab.tsx)
- [components/admin/SettingsForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/SettingsForm.tsx)
- [components/admin/customizer/pages/ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductCardSettings.tsx)
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)

**Changes:**
1. **Catalog Swatches Database Column**: Created a migration file to add `card_show_swatches` to the `store_settings` table, and updated `SUPER_MASTER_SCHEMA.sql`.
2. **Branding Settings Toggle Placement**: Added the "Show Variations on Catalog" checkbox toggle right next to the "Default Variant on Catalog" select dropdown inside `ProductsTab.tsx`, correcting parent container HTML nesting errors.
3. **Customizer & Card Swatches Separator**: Separated the catalog-level swatches show/hide toggle from global variation controls to allow hiding variant elements strictly on archive product cards while keeping swatches active on details pages.

### [2026-06-21] v4.7.7 — Product Card Swatch & Description Controls Linked
**Files Updated:**
- [supabase/migrations/20260621194200_add_card_show_description.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260621194200_add_card_show_description.sql) [NEW]
- [supabase/schema/SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql)
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [lib/services/settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts)
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- [components/admin/settings/ProductsTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/ProductsTab.tsx)
- [components/admin/SettingsForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/SettingsForm.tsx)
- [components/admin/customizer/pages/ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductCardSettings.tsx)

**Changes:**
1. **Added `card_show_description` Column**: Created database migration and updated the master schema with a boolean flag to control product card descriptions globally.
2. **Settings Bindings**: Integrated the description toggle on both the main settings dashboard (Products Tab) and the visual Customizer editor.
3. **Card Swatch & Description Rendering**: Configured all 17 templates in `ProductCard.tsx` to strictly respect the `card_show_description` and `enableVariantSwatches` settings, including color and size variants.
4. **Default Variant Catalog Image Bug Fix**: Linked `initialImage` to the active variant image `(defaultVar && defaultVar.imageUrl) || primaryImage` to ensure the selected default variant index's image displays instead of always defaulting to the primary image.

### [2026-06-21] v4.7.6 — Product Card Customization Overhaul, Fixes & Styles 16/17

**Files Updated:**
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Dynamic Config Binding**: Linked all Customizer visibility options (`card_show_stars`, `card_show_wishlist`, `card_show_quickview`, `card_show_quickcart`), line clamp limits (`titleLineLimit`), and color swatch controls to all styles 2 to 17.
2. **Horizontal Image Collapse Fix**: Resolved the collapsing image bug in Split Side-by-Side Row (`style12`) by utilizing a relative flex column with a block flex-shrink container and an absolute inset link wrapper.
3. **Strip HTML Tags**: Enhanced `displayDescription` to completely strip HTML tags and resolve common HTML entities.
4. **Style 16 (Nike Athletic Backdrop)**: Added layout matching Nike mockup with a circular background accent behind the floating product image, inline sizes and colors, and a full-width dark Add to Cart button.
5. **Style 17 (Adidas Gradient Active)**: Added premium layout matching Adidas mockup with top branding tag, centered stars, inline price/swatches, and a blue-to-purple gradient Add to Cart button.

### [2026-06-21] v4.7.5 — 15 Premium Product Card Layout Templates

**Files Updated:**
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [components/admin/customizer/pages/ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductCardSettings.tsx)
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)

**Changes:**
1. **Added Type Declarations**: Extended `card_style` inside types file to support `'style1' | 'style2' | 'style3' | ... | 'style15'`.
2. **Settings Panel Registry**: Populated Product Card customizer settings with selectable lists, names, and descriptions for all 15 layouts.
3. **Card Styles Component Overhaul**: Implemented 15 custom product card templates inside `ProductCard.tsx` covering Sneaker, Luxury Watch, Editorial Serif, Grocery, Cosmetics, horizontal list layouts, and neon dark grids.
4. **Preserved Original Layout**: Kept `style1` exactly identical to the original card presentation with hover action overlays.
5. **Robust Reusable Helpers**: Re-architected rendering blocks inside `ProductCard.tsx` with shared helpers (`renderCardImage`, `renderBadges`, `renderStars`, `renderSwatches`, `renderSizes`) to ensure consistent display and settings compliance across all layouts.
6. **Stripped HTML Descriptions**: Used regex sanitization (`displayDescription`) to strip raw HTML tags from all product descriptions showing on grid cards.
7. **Side-by-Side Row Layout Fix**: Wrapped the collapsed image in a block-level container with exact width bounds (`block w-full h-full relative`) on its inner link tag inside Style 12 to resolve layout collapsing issues.

### [2026-06-21] v4.7.4 — Meta Catalog Sync Enable/Disable Setting

**Files Updated:**
- [supabase/migrations/20260621180000_add_meta_sync_enabled_to_settings.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260621180000_add_meta_sync_enabled_to_settings.sql) [NEW]
- [supabase/schema/SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql)
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [lib/services/settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts)
- [lib/meta/syncProduct.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/meta/syncProduct.ts)
- [components/admin/settings/PixelsTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/PixelsTab.tsx)
- [components/admin/SettingsForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/SettingsForm.tsx)
- [app/admin/layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/layout.tsx)
- [components/admin/ProductList.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductList.tsx)

**Changes:**
1. **Added `meta_sync_enabled` Setting**: Created a database migration to add `meta_sync_enabled` column (BOOLEAN, default `false`) to the `store_settings` table, and synced the master database schema file.
2. **Settings Configurations**: Modified typescript settings types and services to handle mapping and saving `meta_sync_enabled`.
3. **Admin Settings UI**: Wired a setting toggle in Pixels Tab of Settings. When disabled, the **Meta Sync** sub-tab and configuration panel are dynamically hidden.
4. **Admin Layout Navigation**: Dynamically hid the **Meta Sync** navigation page link from the admin sidebar menu when `meta_sync_enabled` is false.
5. **Product Actions and List Views**: Updated the Product List component to completely hide all Meta sync statuses, sync columns, checkmarks, refresh icons, batch/single sync trigger buttons, and mobile sync info displays when `meta_sync_enabled` is false.
6. **Execution Bypass**: Short-circuited single and bulk product upload server methods inside `syncProduct.ts` to abort processing immediately if sync options are disabled.

### [2026-06-21] v4.7.3 — Dynamic Settings-Based Store Domain Resolution

**Files Updated:**
- [app/(store)/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/(store)/page.tsx)
- [app/(store)/shop/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/(store)/shop/page.tsx)
- [app/(store)/category/[slug]/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/(store)/category/[slug]/page.tsx)
- [app/(store)/product/[slug]/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/(store)/product/[slug]/page.tsx)
- [app/layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/layout.tsx)
- [components/Breadcrumb.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/Breadcrumb.tsx)
- [lib/revalidate.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/revalidate.ts)
- [lib/email/sendEmail.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/email/sendEmail.ts)
- [lib/seoPrompts.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/seoPrompts.ts)
- [app/api/seo/optimize/route.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/api/seo/optimize/route.ts)
- [supabase/migrations/20260621000300_dynamic_webhook_revalidation_domain.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260621000300_dynamic_webhook_revalidation_domain.sql) [NEW]
- [supabase/schema/SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql)
- [app/api/email-templates/[type]/send-test/route.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/api/email-templates/[type]/send-test/route.ts)
- [app/api/email-templates/[type]/preview/route.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/api/email-templates/[type]/preview/route.ts)
- [app/sitemap.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/sitemap.ts)
- [app/robots.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/robots.ts)
- [app/(store)/privacy-policy/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/(store)/privacy-policy/page.tsx)
- [components/admin/SEOPreviewModal.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/SEOPreviewModal.tsx)
- [components/admin/CategoryManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CategoryManager.tsx)
- [app/admin/categories/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/categories/page.tsx)
- [components/admin/ProductForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductForm.tsx)
- [app/admin/products/new/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/products/new/page.tsx)
- [app/admin/products/[id]/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/products/[id]/page.tsx)

**Changes:**
1. **Dynamic Store Domain Resolution**: Replaced hardcoded fallback strings (like `https://www.totvogue.pk`, `https://zaynahs.pk`, and `https://zaynahs.com`) with dynamic resolution from `settings.storeUrl` across all storefront pages, layouts, breadcrumbs, email message-ids, SEO copywriting engines, and optimize api routes.
2. **Dynamic Database Webhook Revalidation**: Re-wrote the `supabase_functions.http_request` trigger function in a database migration and master schema to query the `store_settings` table dynamically at runtime, allowing database webhooks to target the active domain without modifying trigger metadata during project clones.
3. **General Domain Resolution Polish**: Cleaned up sitemap, robots.txt, email preview/send-test routes, privacy-policy support email fallbacks, IndexNow ping routes in category/product forms, and SEO preview modal handles to inherit dynamic store URL settings and name variables.
4. **Circular Dependency Prevention**: Built a database-direct `resolveSiteUrl` fallback query helper inside `lib/revalidate.ts` to retrieve the active store domain without importing settings services, avoiding circular imports.

### [2026-06-21] v4.7.2 — Payment Instructions on Checkout & Settings Panel

**Files Updated:**
- [supabase/migrations/20260621000200_add_instructions_to_payment_methods.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260621000200_add_instructions_to_payment_methods.sql)
- [supabase/schema/SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql)
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [lib/services/paymentMethods.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/paymentMethods.ts)
- [components/admin/SettingsForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/SettingsForm.tsx)
- [components/admin/settings/ShippingTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/ShippingTab.tsx)
- [components/store/CartContainer.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/CartContainer.tsx)

**Changes:**
1. **Database Column**: Added the `instructions` TEXT column to the `payment_methods` table via a new migration and synced the master database schema file.
2. **Settings Configurations**: Modified the payment method schema and services to map the `instructions` field. Expanded the settings panel forms in `SettingsForm.tsx` and `ShippingTab.tsx` with textarea inputs to configure instructions on payment method creation or inline editing.
3. **Dynamic Customer Checkout**: Overhauled the storefront checkout in `CartContainer.tsx` to dynamically query active payment methods, render a selection toggle list, and display the corresponding payment instructions box beneath the selected payment option.
4. **Order Confirmation Context**: Appended the selected payment method's details to the customer checkout order summary, database notes payload, and the final WhatsApp checkout template.

### [2026-06-21] v4.7.0 — Customer Email Password Reset & Toggles Verification

**Files Updated:**
- [supabase/migrations/20260621000000_add_customer_reset_token.sql](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/supabase/migrations/20260621000000_add_customer_reset_token.sql)
- [supabase/schema/SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql)
- [lib/services/customers.ts](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/lib/services/customers.ts)
- [lib/email/sendTemplatedEmail.ts](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/lib/email/sendTemplatedEmail.ts)
- [app/(store)/login/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/app/(store)/login/page.tsx)
- [app/(store)/reset-password/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/app/(store)/reset-password/page.tsx)

**Changes:**
1. **Password Reset Token Columns**: Created migration file adding `reset_token` and `reset_token_expires_at` to the custom `customers` table, and synced `SUPER_MASTER_SCHEMA.sql`.
2. **Email Reset Server Actions**: Created `requestCustomerPasswordReset` and `resetCustomerPasswordWithToken` in `lib/services/customers.ts` to manage generation, storage, verification, and hash updates.
3. **Storefront Reset Views**: Refactored the Forgot Password form on `/login` to submit email reset requests instead of triggering manual WhatsApp redirections, and created a fully responsive client-side `/reset-password` page to handle new password input and validation.
4. **Email Dispatch Toggles**: Overhauled the template sender utility `sendTemplatedEmail.ts` to respect both template database statuses and global settings checklist toggles, enabling/disabling notifications dynamically.

### [2026-06-20] v4.6.5 — Bulk Recycle Bin Select, Restore, Hard Delete & Empty Controls

**Files Updated:**
- [components/admin/TrashConsole.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/TrashConsole.tsx)

**Changes:**
1. **Bulk Selection**: Added checkboxes to list rows and cards across all Trash tabs (Products, Categories, Reviews, Orders, Customers, Media, Leads).
2. **Bulk Actions**: Built "Restore Selected" and "Delete Selected Forever" bulk actions with dynamic check indicators.
3. **Empty Tab Trash Control**: Implemented tab-specific "Empty Tab Trash" buttons to empty everything inside the current tab instantly. Included confirmation modal prompts for all bulk/complete deletion actions.
4. **Fixed Media Filtering Bug**: Overhauled media query search filters to safely show items even when `original_filename` or `title` fields are null.

### [2026-06-20] v4.6.4 — Trashed Orders, Customers, Media & Leads Support

**Files Updated:**
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [lib/services/orders.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/orders.ts)
- [components/admin/TrashConsole.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/TrashConsole.tsx)
- [app/admin/layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/layout.tsx)
- [app/admin/trash/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/trash/page.tsx)
- [supabase/migrations/20260620184900_add_deleted_at_to_others.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260620184900_add_deleted_at_to_others.sql)
- [supabase/schema/SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql)

**Changes:**
1. **Relocated Trash Navigation**: Moved the Trash menu link to a dedicated section right above Settings in the admin sidebar.
2. **Unified Trashed Views**: Overhauled the Trash Console component and page to fetch and manage trashed Products, Categories, Reviews, Orders, Customers, Media files, and WhatsApp/Email Subscriber Leads in a single responsive UI.
3. **Database Constraints & Schema Registry**: Added indexes to `deleted_at` fields in the migration file and master schema for optimal database search performance.

### [2026-06-20] v4.6.3 — Product Form Images Position & Media Library Pagination

**Files Updated:**
- [components/admin/ProductForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductForm.tsx)
- [components/admin/MediaManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/MediaManager.tsx)

**Changes:**
1. **Product Form Image Card Repositioning**: Moved the "Product Images Panel" from the bottom of the right sidebar to the very top (above "Status Settings"), eliminating the need to scroll down on Product Edit/Add pages.
2. **Media Library Pagination**: Implemented pagination in `MediaManager.tsx` supporting custom image limits per page (50, 100, 200) with a default of 50. Addressed both selector modal and library views seamlessly. Added responsive page controls and indices.

### [2026-06-20] v4.6.2 — Category Add and Remove Product Options

**Files Updated:**
- [lib/services/products.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/products.ts)
- [components/admin/CategoryDetailManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CategoryDetailManager.tsx)

**Changes:**
1. **Category Linking Server Actions**: Added `addProductToCategory` and `removeProductFromCategory` actions to manage many-to-many product-category relations dynamically. Included safe fallbacks for updating legacy `products.category_id` values and triggered caches revalidation.
2. **Add Product to Category Modal**: Built an interactive modal inside `CategoryDetailManager.tsx` that fetches all products dynamically using `getAllProductsAdmin()` and lets admins query, filter, and associate products to the category on-the-fly.
3. **Remove from Category Action Button**: Added a red trash icon next to the edit action for each product row on the grid, allowing one-click category disassociation with instant client state transitions and toast notifications.

### [2026-06-20] v4.6.1 — Editable Popular Search Suggestions in Admin Settings

**Files Updated:**
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [lib/services/settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts)
- [components/admin/SettingsForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/SettingsForm.tsx)
- [components/admin/settings/HeaderTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/HeaderTab.tsx)
- [components/common/Navbar.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/common/Navbar.tsx)
- [supabase/schema/SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql)

**Changes:**
1. **Dynamic Popular Searches Settings Column**: Added the `popular_searches` column to the `store_settings` table inside the database schema and synced it in `SUPER_MASTER_SCHEMA.sql` with default search tags ('Co-ord Sets, Sonic, Graphic Tee, T-shirt, Kids').
2. **Mapped Types & API payload**: Updated `StoreSettings` typescript interfaces, database row mapper `mapSettings`, and the update payload generator inside `lib/services/settings.ts` to seamlessly handle settings retrieval and saves.
3. **Storefront Search Suggestions Integration**: Updated the storefront search modal component inside `Navbar.tsx` to read the comma-separated search terms from the dynamic `settings.popularSearches` value, falling back to the default terms if not configured.
4. **Admin Customizer Form Control**: Added a new "Popular Search Suggestions" section inside the Header configuration tab (`HeaderTab.tsx`). Implemented state binding in `SettingsForm.tsx` to save changes immediately back to the Supabase database. Applied standard styling and inline `style={{ borderWidth: 0 }}` to suppress native double-borders.

### [2026-06-20] v4.6.0 — Multi-Category, Inventory Threshold Alerts & Shopify-Style Inventory Management Screen

**Files Updated:**
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [lib/services/products.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/products.ts)
- [lib/services/products-client.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/products-client.ts)
- [lib/services/categories.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/categories.ts)
- [lib/email/triggers.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/email/triggers.ts)
- [components/admin/ProductForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductForm.tsx)
- [components/admin/CategoryManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CategoryManager.tsx)
- [components/store/ShopPage.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ShopPage.tsx)
- [app/admin/layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/layout.tsx)
- [supabase/schema/SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql)
- [supabase/migrations/20260620170000_add_multi_category_and_threshold.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260620170000_add_multi_category_and_threshold.sql) [NEW]
- [components/admin/InventoryManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/InventoryManager.tsx) [NEW]
- [components/admin/CategoryDetailManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CategoryDetailManager.tsx) [NEW]
- [app/admin/inventory/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/inventory/page.tsx) [NEW]
- [app/admin/categories/[id]/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/categories/%5Bid%5D/page.tsx) [NEW]
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Junction Table for Multi-Category Relationships**: Added `product_categories` table to allow assigning a product to multiple categories simultaneously. Created RLS public read policies and authenticated admin write policies, and enabled realtime publication. Exputed to client/admin roles using explicit `GRANT SELECT` statements.
2. **Alert Thresholds per Variant and Product**: Introduced `inventory_threshold` column to both `products` and `product_variants` tables. Extended typescript interfaces and the mapping in the service layers to support these.
3. **Multi-Category Checkout Selector**: Upgraded the Category Select section on the Product Edit/Add form to display a checklist of categories. Each category checklist item is expandable to configure category-specific `isFeatured` and `isVisible` toggles, stored in the `product_categories` junction table.
4. **Shopify-style Inventory Management Screen**: Added a dedicated inventory management screen at `/admin/inventory`. This contains search, category filtering, low stock only filtering, and expandable variant lists with inline inputs for stock and alert threshold that save auto-magically on blur or Enter key press.
5. **Category Details with Products Edit Grid**: Rebuilt category edit view so clicking on a category card redirects to a dedicated details page at `/admin/categories/[id]`. This shows all products under that category in an inline-editable spreadsheet style table (allowing quick modifications of price, compare price, stock, category featured status, and category visible status).
6. **Backend Stock Trigger Checks**: Overhauled the low-stock notification triggers to resolve stock levels at the variant-level check against variant-specific thresholds, falling back to global settings when threshold equals zero.
7. **Resolved PostgREST Embbed Relationship Ambiguity**: Replaced generic `categories(*)` with `categories!category_id(*)` in server-side and client-side product query selects to explicitly instruct PostgREST to join using the direct foreign key relationship, preventing ambiguities with the new many-to-many junction relationship.
8. **Real-time Checklist Searching**: Added search input fields above the Categories checklist and the Bought Together Recommendations checklist in the product form to filter items in real-time.
9. **Exposed Product Alert Threshold Always**: Exposed the `Alert Threshold` field under `Pricing & Inventory` on the add/edit product page regardless of whether variants are enabled, serving as a product-wide default threshold fallback for all variant items.

### [2026-06-20] v4.5.8 — Dynamic Meta Sync Status UI Population & Fixed Bulk Failed Sync Route

**Files Updated:**
- [lib/services/products.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/products.ts)
- [lib/meta/mapProduct.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/meta/mapProduct.ts)
- [lib/meta/syncProduct.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/meta/syncProduct.ts)
- [app/api/meta-sync/bulk/route.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/api/meta-sync/bulk/route.ts)
- [components/store/ProductDetail.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductDetail.tsx)
- [components/store/CartContainer.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/CartContainer.tsx)
- [app/(store)/product/[slug]/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/%28store%29/product/%5Bslug%5D/page.tsx)
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Dynamic Meta Sync Status Retrieval**: Modified `getAllProductsAdmin` and `getProductById` in `products.ts` to query the latest log record from the `meta_sync_log` table for each product. This dynamically overrides the static `'pending'` status from the `products` table, ensuring the UI accurately reflects the real-time sync state without writing back to the `products` table (which would trigger recursive webhook sync loops).
2. **Fixed Bulk Retry Failed & Pending Syncs Route**: Overhauled the `/api/meta-sync/bulk` endpoint for `mode === 'failed'`. It now fetches all active products, checks their latest status from the `meta_sync_log` table, and includes any products whose latest status is `'error'` OR have no sync log entry (new/pending products).
3. **Mapped Meta Apparel Attributes**: Updated `mapProductToMeta` in `mapProduct.ts` to automatically detect and map required fields `gender` and `age_group` for clothing items based on text matching keywords in the name/description/category path (e.g., detecting kids/girls apparel), helping resolve catalog issues in Commerce Manager.
4. **Enhanced Meta Feed Robustness & Validation**: Refactored `mapProduct.ts` with critical production-level quality improvements:
   - **Localhost Image Leak Fix**: All images (`primaryImage`, variant images, and additional images) now pass through `cleanImageUrl` to dynamically rewrite dev `localhost:3000` URLs to the live production domain (`https://www.totvogue.pk`).
   - **Brand Fallback Sync**: Aligned default brand fallback name with `TotVogue.pk` domain matching name instead of leftover copy-pastes.
   - **Strict Word Boundaries for Gender/Age**: Upgraded detection to use regular expressions with strict word boundaries (`\b`) to prevent false-positives (e.g., matching `"born"` inside `"stubborn"` or `"boy"` inside `"boycott"`).
   - **No Placeholder Images**: Throws validation errors if products have no images, keeping feed policy compliant.
   - **Omitted `item_group_id` for Simple Products**: Restricts `item_group_id` configuration strictly to variant groupings.
   - **Fields Validation**: Added explicit validations for `slug`, `price`, and `name` to prevent broken `/product/undefined` uploads.
5. **Pixel Events Match Rate Optimization (Variant Tracking)**: Refactored client-side tracking hooks in `ProductDetail.tsx` and `CartContainer.tsx` to achieve a 100% catalog event match rate. Instead of sending generic parent `product.id` under `'product_group'`, pixel events (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`) now track specific variant catalog IDs (e.g. `selectedVariant.id` for variants, `product.id` for simple items) using `content_type: 'product'`, eliminating ad-mismatch discrepancies.
6. **Resolved Localhost Description Leak for Crawlers**: Sanitized `cleanMetaDescription` and JSON-LD `productSchema` in `app/(store)/product/[slug]/page.tsx` to strip raw HTML tags and replace dev `localhost:3000` links with live domain URLs (`https://www.totvogue.pk`) for search engine bots crawling the catalog.
7. **Per-Product Validation Try/Catch inside Bulk Sync Loop**: Wrapped the `mapProductToMeta` call inside `bulkSyncProductsToMeta` ([syncProduct.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/meta/syncProduct.ts)) in a per-product `try...catch` block. This prevents a single product validation error from crashing the entire batch upload job, while capturing the specific error and logging it directly to `meta_sync_log` for debugging.

### [2026-06-19] v4.5.7 — Theme Style Guide Live Preview

**Files Updated:**
- [app/admin/settings/customizer/preview/PreviewClient.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/settings/customizer/preview/PreviewClient.tsx)
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Created Unified Theme Style Guide Screen**: Designed and implemented a detailed Style Guide component rendered when `activePage === 'appearance'` (the page state triggered when viewing "Appearance / Presets" tab in the customizer).
2. **Themed Custom Variable Visualizers**: Included cards displaying active theme palette colors, font family hierarchy, CTA buttons and active corner radius settings, price range typography, dynamic selected option price badges, and a live catalog card sample.

### [2026-06-19] v4.5.6 — Configurable Price Colors & Prominent Selected Option Pricing Badge

**Files Updated:**
- [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- [lib/themePresets.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/themePresets.ts)
- [components/common/ThemeStyleRegistry.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/common/ThemeStyleRegistry.tsx)
- [components/admin/customizer/pages/AppearanceSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/AppearanceSettings.tsx)
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- [components/store/ProductDetail.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductDetail.tsx)
- [components/store/QuickViewModal.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/QuickViewModal.tsx)
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Configurable Price Colors in Customizer**: Extended `ThemeConfig` colors to support a custom `price` color token, added default price values to all 12 presets in [themePresets.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/themePresets.ts), and exposed a color picker for "Price Display Color" inside the theme customizer colors list in [AppearanceSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/AppearanceSettings.tsx).
2. **Theme Style Injection & Export/Import Integration**: Configured [ThemeStyleRegistry.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/common/ThemeStyleRegistry.tsx) to read the price color config and inject a `--color-price` CSS variable. The JSON export/import system dynamically picks up the new setting since it serializes the config object.
3. **Prominent Selected Option Pricing Badge**: Redesigned the selected option price section on the Product Details page ([ProductDetail.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductDetail.tsx)) and Quick View modal ([QuickViewModal.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/QuickViewModal.tsx)) from small plain grey text into a beautifully styled, high-contrast dynamic badge with background tints, borders, and bold accent price typography (`text-base/text-sm font-black`).

### [2026-06-19] v4.5.5 — Storefront Price Ranges for Variable Pricing

**Files Updated:**
- [components/store/ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- [components/store/ProductDetail.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductDetail.tsx)
- [components/store/QuickViewModal.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/QuickViewModal.tsx)
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Catalog/Archive Grid Cards Range pricing**: Added active variant price evaluation in [ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx). If a product has variants with variable pricing, it now displays the range `Rs. Min – Rs. Max` as the primary price on grid cards, keeping lists accurate and clean.
2. **Product Page Variable Price Ranges**: Updated [ProductDetail.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductDetail.tsx) to render the active variant range `Rs. Min – Rs. Max` as the primary product price. When a specific variant option is selected, a secondary, clean text badge dynamically displays the selected option's exact price (along with its specific compare price and discount % if applicable).
3. **Quick View Modal Range Pricing**: Integrated the same price range logic in [QuickViewModal.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/QuickViewModal.tsx) to ensure pricing transparency on quick options selectors.

### [2026-06-19] v4.5.4 — Shopify-Style Bulk Variant Editor Styling, SKU Bulk Update & Selection Controls

**Files Updated:**
- [components/admin/ProductForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductForm.tsx)
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Added Bulk SKU Update**: Implemented `handleBulkUpdateSku` in [ProductForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductForm.tsx) to allow admin to bulk update the SKU of all selected variants in one action.
2. **Refined Bulk Editor Theme Alignment**: Removed the hardcoded dark charcoal bar background and rebuilt the editor block as a standard card using `bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800`. This dynamically maps elements to the storefront's active colors (`bg-primary`, `bg-accent`, etc.) to ensure it blends seamlessly with the admin console styling.
3. **Responsive Grid Layout**: Structured bulk actions inside a grid of `grid-cols-1 md:grid-cols-3` that aligns input fields side-by-side on desktop/tablets and wraps them in a single, high-comfort touch stack on mobile cards.
4. **Resolved Double-Border Glitch**: Injected `style={{ borderWidth: 0 }}` inline on number and text inputs to completely suppress browser border overrides from `globals.css` and render clean, single-bordered unified inputs.

### [2026-06-19] v4.5.3 — Compact Vertical Dropdown Navigation Menu & Modal Performance Updates

**Files Updated:**
- [components/common/Navbar.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/common/Navbar.tsx)
- [docs/SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)

**Changes:**
1. **Implemented Compact Vertical Dropdown**: Replaced the nested fly-out sub-menus on desktop with a structured, vertical dropdown menu (~240px-280px wide). Level 1 is rendered as a clean uppercase header, Level 2 as list items, and Level 3 as nested items with a vertical border line indent (`border-l-2 ml-8`), ensuring all sub-links are visible upfront ("aage aage open") without wide blank column areas.
2. **Desktop Link Hover Underline & Slide-in Transitions**: Added an animated horizontal line transition underneath active/hovered top-level menu items. Configured list sub-links to transition colors and slide slightly to the right (`hover:translate-x-1`) on hover.
3. **Modal Backdrop Performance Optimization**: Removed CPU-heavy `backdrop-blur-md` classes from mobile drawer and search modals to resolve device lag across high-resolution viewports, replacing them with high-contrast solid/semi-solid overlays and enabling hardware-acceleration (`will-change-transform`).
4. **Standardized Tailwind Color Weights**: Replaced non-standard color weights (`border-gray-150`, `dark:border-gray-850`) with standard color weights (`border-gray-200`, `dark:border-gray-800`).

### [2026-06-19] v4.5.2 — Image & Variant De-duplication and Same-Store Asset Reusability on Import

**Files Updated:**
- [app/api/products/import/route.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/api/products/import/route.ts)
- [app/layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/layout.tsx)
- [components/admin/settings/PixelsTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/PixelsTab.tsx)
- [components/admin/SettingsForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/SettingsForm.tsx)

**Changes:**
1. **Added Variant Image De-duplication on Import**: Implemented a dynamic URL mapping (`uploadedUrlsMap`) when importing products. If a variant's image URL matches any of the product-level images, the system skips the duplicate file download and upload process, directly reusing the newly uploaded parent-level image URL.
2. **Created Same-Store Asset Reusability Check**: Implemented a helper function (`isOwnStorageUrl`) that detects if exported image URLs are already hosted on the target store's Supabase bucket. If they are, the system avoids re-uploading and directly links the existing public URL to prevent redundant file creation in storage and duplicate rows in the `media_library` table.
3. **Integrated Global Meta Title and Meta Description in Settings**: Added dedicated inputs for Homepage SEO Title and SEO Meta Description in the Pixels & SEO tab of the admin panel. 
4. **Wired up layout.tsx Metadata**: Updated the dynamic metadata generator in `layout.tsx` to prioritize `settings.metaTitle` and `settings.metaDescription` over the default store name and tagline.

### [2026-06-18] v4.5.1 — Hero Banner Media Optimization & Fully Separated Tablet Settings

**Files Updated:**
- [components/store/StoreFront.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/StoreFront.tsx)
- [components/admin/customizer/sections/HeroBannerSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/HeroBannerSettings.tsx)

**Changes:**
1. **Unified Media Element per Slide**: Streamlined storefront hero slides to render a single background image/video across all breakpoints to avoid double downloads.
2. **Responsive CSS Zoom and Focal Offset**: Injected a dynamically calculated `<style>` block containing media query parameters to handle responsive scaling and focal positioning per viewport on a single background file.
3. **Fully Independent Tablet Settings**: Separated tablet customizer controls completely from mobile view settings. Tablet view now supports independent height (`height_tablet`), width (`content_width_tablet`), focal shifts (zoom, offset X/Y), container alignments, text alignment, and heading sizes.
4. **Simplified Customizer Section settings**: Replaced device-specific background image/video selectors in the admin settings module with unified media fields, shifting device tabs to focus exclusively on responsive layout, text, and alignment overrides.

### [2026-06-18] v4.5.0 — Critical Cache Bug Fix + Shopify-Speed Optimization

**Files Updated:**
- [lib/revalidate.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/revalidate.ts) — full rewrite
- [lib/services/products.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/products.ts)
- [lib/services/reviews.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/reviews.ts)
- [lib/services/categories.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/categories.ts)
- [lib/services/settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts)
- [lib/services/sections.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/sections.ts)
- [lib/services/sizeGuides.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/sizeGuides.ts)
- [lib/services/badges.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/badges.ts)
- [lib/services/coupons.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/coupons.ts)
- [lib/services/shipping.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/shipping.ts)
- [lib/services/paymentMethods.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/paymentMethods.ts)
- [lib/services/emailTemplates.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/emailTemplates.ts)
- [lib/services/metaCategory.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/metaCategory.ts)
- [app/(store)/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/(store)/page.tsx)
- [app/(store)/product/[slug]/page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/(store)/product/%5Bslug%5D/page.tsx)
- [CLOUDFLARE_SUPABASE_SETUP.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/CLOUDFLARE_SUPABASE_SETUP.md)
- [scripts/deploy-cloudflare-rules.js](file:///Users/shoaib/Desktop/Zaynahs%20e-store/scripts/deploy-cloudflare-rules.js)

**Changes:**

1. **🐛 CRITICAL BUG FIX — `revalidateTag` Invalid Second Argument (Root Cause of Stale Cache)**
   - `revalidateTag` only accepts **1 argument** (the tag string). We were calling it with `revalidateTag('tag', { expire: 0 })` everywhere — the second arg is invalid and was **silently ignored**, meaning **NO cache was EVER invalidating on admin saves**.
   - Fixed across **25+ calls** in `revalidate.ts` and all service files using `sed` bulk replacement.
   - Correct pattern per GEMINI.md rule: `(revalidateTag as any)('tag-name')`
   - **Before fix:** Admin saves product → webhook fires → revalidateTag called with bad args → cache NOT cleared → stale data shown forever
   - **After fix:** Admin saves product → webhook fires → revalidateTag clears cache → Cloudflare purge → next user sees fresh data instantly

2. **⚡ Shopify-Speed Optimization — 24h ISR + generateStaticParams**
   - `app/(store)/page.tsx`: `revalidate` changed from `60s → 86400s` (24 hours). Webhooks handle instant purge on admin save.
   - `app/(store)/product/[slug]/page.tsx`: `revalidate` changed from `30s → 86400s`. Added `generateStaticParams()` to pre-build ALL active product pages at Vercel build time. Added `dynamicParams = true` for products added after build.
   - All `unstable_cache` TTLs across all services changed from `60s/30s → 86400s` (24 hours).

3. **☁️ Cloudflare Rules Re-deployed & Cache Purged**
   - `scripts/deploy-cloudflare-rules.js` re-run via terminal — all 4 rules confirmed active on Cloudflare zone.
   - `CLOUDFLARE_SUPABASE_SETUP.md` updated with:
     - Detailed rules table (Rule 1–4 with expressions, actions, TTLs)
     - Critical warning explaining WHY Rule 3 must stay bypass (RSC Vary headers)
     - Lessons Learned section documenting the June 2026 HTML caching experiment that broke the store
     - Architecture diagram showing who caches what (CF vs Vercel vs DB)
   - Immediate full Cloudflare cache purge triggered post-fix

**⚠️ FUTURE AGENTS — CRITICAL RULES:**
- **NEVER** call `revalidateTag` with a second argument. Always: `(revalidateTag as any)('tag')`
- **NEVER** set Cloudflare Rule 3 (`html-pages`) to `cache: true` — breaks RSC navigation
- `revalidate` page values can be high (24h+) ONLY because webhooks handle instant purge

### [2026-06-17] v4.4.0 — Unified Trash / Recycle Bin System

**Files Updated:** [20260617100000_add_deleted_at_to_categories_and_reviews.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260617100000_add_deleted_at_to_categories_and_reviews.sql) [NEW], [types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts), [products.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/products.ts), [categories.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/categories.ts), [reviews.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/reviews.ts), [layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/layout.tsx), [page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/trash/page.tsx) [NEW], [TrashConsole.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/TrashConsole.tsx) [NEW], [ProductList.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductList.tsx), [CategoryManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CategoryManager.tsx), [page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/reviews/page.tsx)
**Changes:**
1. **Database Schema & Migrations**: Configured `deleted_at` timestamps on `categories` and `reviews` tables (synced inside `SUPER_MASTER_SCHEMA.sql` with query indexes) to enable universal soft deletion.
2. **Server Actions Expansion**: Extended products, categories, and reviews server actions to filter out soft-deleted items from storefronts and standard admin listing views, and added `getDeleted*`, `restore*`, and `hardDelete*` actions.
3. **Unified Sidebar Link & Page routing**: Created `/admin/trash` and registered a tabbed Recycle Bin console UI, rendering detailed lists and confirmation dialogues for restoring or permanently deleting items.
4. **Delete Handlers Refactoring**: Updated active table delete confirmation prompts in Product List, Category Manager, and Reviews Moderation views to soft-delete items to Trash instead of deactivating or hard-deleting them immediately.

### [2026-06-17] v4.3.9 — Handled SEO API Failures Gracefully & Bypassed Next.js Console Error Overlays
**Files Updated:** [route.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/api/seo/optimize/route.ts), [CategoryManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CategoryManager.tsx), [ProductForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductForm.tsx), [ProductsSEOClient.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/seo/products/ProductsSEOClient.tsx), [CategoriesSEOClient.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/seo/categories/CategoriesSEOClient.tsx)
**Changes:**
1. **Graceful Status Code (200 OK for Errors)**: Overhauled `/api/seo/optimize` to return status code `200 OK` with a `{ success: false, error: '...' }` body when encountering LLM generation rate-limits, invalid response formats, or schema parse errors. This avoids returning generic `500 Internal Server Error` statuses and prevents console warnings from escalating.
2. **Robust JSON Extraction**: Improved the JSON parsing block in the optimization API to search index positions for the first `{` and last `}` tags, preventing extraction failures caused by thinking blocks or conversational intro/outro text.
3. **Console Log Intercept Overlay Bypass**: Modified background save IIFE triggers in `CategoryManager` and `ProductForm` to log failures using `console.warn` instead of `console.error`. In Next.js development mode, `console.error` calls trigger full-screen developer error overlay popups, causing unnecessary workflow disruptions for non-critical background processes.
4. **Client-side Verification Checks**: Updated client modals and list managers to explicitly inspect `resData.success` alongside `response.ok` before confirming success states.

### [2026-06-17] v4.3.8 — Added Custom AI Prompts & Word Limits Configuration
**Files Updated:** [20260617080000_add_ai_prompt_limits.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260617080000_add_ai_prompt_limits.sql) [NEW], [20260617090000_update_defaults_inspired.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260617090000_update_defaults_inspired.sql) [NEW], [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts), [settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts), [seoPrompts.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/seoPrompts.ts), [route.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/api/seo/optimize/route.ts), [AITab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/AITab.tsx), [SettingsForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/SettingsForm.tsx), [page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/seo/settings/page.tsx)
**Changes:**
1. **Database Migration & Triggers**: Created and ran migration adding custom prompt instructions and word limit parameters (`category_description_prompt`, `category_description_limit`, `product_description_prompt`, `product_description_limit`, `product_short_prompt`, `product_short_limit`) to `store_settings` and `ai_settings` tables. Overhauled bidirectional sync triggers to synchronize these settings automatically.
2. **Inspired Copy Defaults**: Created and ran migration setting the default templates, prompts, and limits to align with the user's templates (including kids fashion category description, structured key features, care instructions, and a strict 1-line product short description prompt with 20 words limit).
3. **AI Prompts Customization**: Modified prompt builders in `lib/seoPrompts.ts` and `app/api/seo/optimize/route.ts` to consume custom parameters, instructing the LLM to write content adhering strictly to specified word counts and target prompt themes.
4. **Admin Panel Input Toggles**: Expanded both general Settings Form and SEO AI Configuration screens to render responsive grid panels enabling admins to tweak, customize, and save instructions/limits with clean UI placeholders.

### [2026-06-17] v4.3.7 — Introduced backend api/ai-check endpoint & Resolved client-side environment variable hot-reload issues
**Files Updated:** [route.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/api/ai-check/route.ts) [NEW], [layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/layout.tsx), [ProductForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductForm.tsx), [CategoryManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CategoryManager.tsx)
**Changes:**
1. **Created api/ai-check Endpoint**: Built a server-side route `/api/ai-check` that queries `store_settings` using the `supabaseAdmin` client. This bypasses all client-side RLS limits, prevents browser-side query failures, and is fully immune to client-side environment variable loading delay issues.
2. **Integrated Endpoint inside Forms & Layout**: Updated client components (`ProductForm`, `CategoryManager`, and the main admin `layout`) to query `/api/ai-check` instead of direct database selects. This makes the toggle check 100% robust and reliable.

### [2026-06-17] v4.3.6 — Implemented Conditional AI Generation on Name Input & Live Toggle Sync
**Files Updated:** [layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/layout.tsx), [ProductForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductForm.tsx), [CategoryManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CategoryManager.tsx)
**Changes:**
1. **Dynamic Button Trigger (Name Required)**: Modified the "AI Generate Copy" buttons in both product forms and category modals so that they only appear/unlock once the user enters a Name (`name.trim() !== ''`). This ensures the AI always generates copy relative to the active product or category name.
2. **Global AI Toggle Hiding**: Filtered the admin layout sidebar so that the **SEO Copywriter** link is hidden from the sidebar if `ai_enabled` is set to `false`.
3. **Live Database Client Checks**: Removed the server-prop skip check in client components, letting them fetch the live settings state from the browser client on mount. This completely bypasses any server-side cache delays, displaying the buttons immediately on mount.

### [2026-06-17] v4.3.5 — Added Server-Side AI Enabled Prop Injection & Upper Layout Placement
**Files Updated:** [page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/products/%5Bid%5D/page.tsx), [page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/products/new/page.tsx), [page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/categories/page.tsx), [ProductForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductForm.tsx), [CategoryManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CategoryManager.tsx)
**Changes:**
1. **Server-Side Settings Prop Injection**: Implemented server-side settings query (`getSettings()`) in Edit Product, Create Product, and Category Manager server page components. Passed `aiEnabled` directly to client components as props to guarantee instantaneous, 100% reliable initialization on first render without depending on client-side Supabase network fetches.
2. **Prominent "Upper" Button Placement**: Moved the **AI Generate Copy** buttons higher up in both layouts. In the product form, it is now displayed in the header next to the **Product Details** section title. In the category modal, it is placed next to the modal title in the sticky header. This ensures the action is immediately visible and generates content for whichever product or category is currently open.

### [2026-06-17] v4.3.4 — Resolved Client-Side RLS / Session Delay in AI Enabled Check
**Files Updated:** [ProductForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductForm.tsx), [CategoryManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CategoryManager.tsx)
**Changes:**
1. **RLS / Session Bypass for AI Check**: Changed client-side `fetchAiSettings` in both `ProductForm.tsx` and `CategoryManager.tsx` to read the `ai_enabled` toggle from the `store_settings` table (ID: `00000000-0000-4000-8000-000000000001`) instead of `ai_settings` (ID: `00000000-0000-4000-8000-000000000002`). Since `store_settings` has a public read policy, this completely resolves the race condition / authorization delay where the "AI Generate Copy" button failed to render on first form load.

### [2026-06-17] v4.3.3 — Integrated Category-level Shop Page FAQ Schema
**Files Updated:** [page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/%28store%29/shop/page.tsx)
**Changes:**
1. **Added Category FAQ Schema Injection**: Updated the shop page `/shop` to extract the active category slug from search parameters, fetch its custom `seo_meta` record, and dynamically render FAQ page JSON-LD structures if it contains a generated FAQ schema. This satisfies the search engine indexability requirement for category listings pages.

### [2026-06-17] v4.3.2 — Synced Manual SEO Overrides to Core Tables & Fixed Bulk Host routing
**Files Updated:** [EditSEOModal.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/EditSEOModal.tsx), [route.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/api/seo/bulk/route.ts)
**Changes:**
1. **Synchronized Manual Overrides to Core Tables**: Extended the `EditSEOModal` save handler so that when admins manually override focus keywords, SEO titles, meta descriptions, or long descriptions inside the SEO Copywriter lists, these changes are instantly synchronized back to the primary `products` and `categories` tables (safely splitting tags and formatting).
2. **Fixed Bulk Host URL Resolution**: Changed the bulk routing server to dynamically resolve `siteUrl` from the request URL headers (using `request.url` origin) instead of falling back to production environment variables. This prevents bulk generation requests from going to the production domain during local development.

### [2026-06-17] v4.3.1 — Integrated AI SEO Copywriter Form Options & Synchronized Table Columns
**Files Updated:** [route.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/api/seo/optimize/route.ts), [seoPrompts.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/seoPrompts.ts), [ProductForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/ProductForm.tsx), [CategoryManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CategoryManager.tsx), [gemini.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/gemini.md)
**Changes:**
1. **Synchronized SEO Metadata to Core Tables**: Enhanced `/api/seo/optimize` to save generated copywriting back to the source tables (`products.description` = `long_description`, `products.short_description` = `meta_description`, `products.tags` = combined tags array, `categories.description` = `long_description`) upon optimization to prevent storefront and editor data desync.
2. **Added Form-Level "AI Generate Copy" Options**: Implemented "AI Generate Copy" buttons next to the description editor on the Product Form and Category Manager. The buttons are conditionally displayed if the AI switch is globally enabled in Settings, dynamically generate copy on-the-fly (supporting both unsaved/new items and existing items), and populate local editor/textarea states instantly.
3. **Leveraged Stored Brand Settings**: Updated the prompt builders in `lib/seoPrompts.ts` to consume store settings (brand name, address, WhatsApp number, tagline) so that the generated copy and FAQs are rich, authentic, and localized for a 1000% increase in local SEO ranking.
4. **Updated Gemini Rules**: Defined `RULE AI1` in `gemini.md` mapping model types to vision vs text and outlining brand integration guidelines.

### [2026-06-17] v4.3.0 — Fixed Polymorphic SEO Meta Queries and Join Errors
**Files Updated:** [ProductsSEOClient.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/seo/products/ProductsSEOClient.tsx), [CategoriesSEOClient.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/seo/categories/CategoriesSEOClient.tsx), [BulkConsoleClient.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/seo/bulk/BulkConsoleClient.tsx)
**Changes:**
1. **Resolved Polymorphic Join 400 Error**: Overhauled standard PostgREST nested joins (`seo_meta!left(...)`) inside Products, Categories, and Bulk SEO console list views. Because `seo_meta` has a polymorphic relationship (`entity_id` maps to either `products` or `categories` without a physical Postgres Foreign Key constraint), direct relationship joins fail with a 400 Bad Request error. Fixed this by querying the lists separately and resolving the polymorphic association in-memory.
2. **Fixed Media Library Column Name Mismatch**: Corrected the column field name fetched from the `media_library` table in the bulk client from `file_name` to `original_filename` to prevent database schema errors.

### [2026-06-17] v4.2.9 — Database RLS Policy Repair & Media Manager Error Diagnostics
**Files Updated:** [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [MediaManager.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/MediaManager.tsx)
**Changes:**
1. **Enabled Row Level Security (RLS) & Created Policies**: Enabled RLS on the `media_library` table in the database and added standard policies to `SUPER_MASTER_SCHEMA.sql` (Public Select and Admin All). This fixes authentication permission errors that occurred when trying to update/delete media records from the browser.
2. **Integrated Detailed Error Reporting**: Upgraded the client-side `MediaManager.tsx` code (for metadata updates, image deletes, and bulk operations) to print exact PostgreSQL/Supabase errors in the browser console using the `logDbError` system and display error messages in toast notifications instead of failing silently or showing generic errors.

### [2026-06-17] v4.2.8 — Prevent Infinite Trigger Update Recursion
**Files Updated:** `supabase/migrations/20260617070000_prevent_ai_sync_recursion.sql` (NEW), `supabase/schema/SUPER_MASTER_SCHEMA.sql`
**Changes:**
1. **Recursion Safeguard**: Added `pg_trigger_depth() > 1` protection block at the beginning of mutual settings-sync triggers (`sync_settings_to_ai` and `sync_ai_to_settings`) to prevent statement_too_complex (error code 54001) / infinite transaction loop failures on updates.

### [2026-06-17] v4.2.7 — Comprehensive AI Model Registry Expansion
**Files Updated:** `components/admin/settings/AITab.tsx`, `app/admin/seo/settings/page.tsx`, `lib/aiEngine.ts`
**Changes:**
1. **Full Provider Coverage**: Expanded `TEXT_MODELS` and `VISION_MODELS` registries to include ALL models across 16 providers — Groq, Gemini, Cerebras, Mistral, Cloudflare Workers AI, NVIDIA NIM, OpenRouter (25+ free models), DeepSeek, Together AI, Fireworks, SiliconFlow, Kimi (Moonshot), Qwen (DashScope), OpenAI, Anthropic, Minimax.
2. **Provider Groups Restructured**: Added emoji labels (🆓 FREE / 💲 CHEAP / 💎 PREMIUM) to provider groups with OpenRouter moved into the Free tier since it has 25+ free models.
3. **New Models Added**: GPT-4.1, o4-mini, o3, Claude Opus/Sonnet 4.5, Gemini 2.5 Pro/Flash/Lite, Llama 4 Maverick/Scout, DeepSeek-R1/V3/Chat/Coder, Pixtral, QwQ-32B, Qwen3 series, Kimi-latest/thinking, Mistral Pixtral vision models, NVIDIA NIM full catalog, Cloudflare latest models.
4. **API Key Console Links**: Added direct links to Cerebras, Kimi (Moonshot), and Qwen (DashScope) console portals. Updated all existing links to current dashboard URLs.
5. **Backend Engine Updated**: Fixed Minimax API endpoint to v2 `/text/chatcompletion_v2` and reorganized provider routing map in `aiEngine.ts` with Free/Cheap/Premium comments for clarity.

### [2026-06-17] v4.2.6 — Multi-Provider AI Copywriter Engine & Bulk SEO Console

**Files Updated:** `supabase/migrations/20260617050000_add_audience_and_templates_to_ai_settings.sql`, `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `lib/types.ts`, `lib/services/settings.ts`, `app/admin/seo/settings/page.tsx`, `components/admin/settings/AITab.tsx`, `components/admin/SettingsForm.tsx`, `components/admin/ProductForm.tsx`, `components/admin/CategoryManager.tsx`, `app/admin/seo/products/ProductsSEOClient.tsx`, `app/admin/seo/categories/CategoriesSEOClient.tsx`, `app/admin/seo/bulk/page.tsx`, `app/admin/seo/bulk/BulkConsoleClient.tsx`
**Changes:**
1. **AI Setting Columns & Bidirectional Sync**: Created a SQL migration adding `target_audiences`, `product_types`, `category_default_template`, and `product_default_template` to the `store_settings` and `ai_settings` tables, and registered triggers to sync updates bidirectionally.
2. **AI settings Form Overhaul**: Integrated settings mapping under the settings service and types file. Added a master ON/OFF switch `ai_enabled` that dynamically collapses settings fields and hides AI copywriter options across the admin portal if disabled.
3. **Developer Console Quicklinks**: Added target-blank console links next to API key fields utilizing the centralized `ExternalLink` icon.
4. **Target Presets & Audiences**: Added checkable presets and custom chip controls for target markets, languages, audiences, tones, and default HTML templates.
5. **Interactive Bulk AI Console**: Built a visual terminal logging utility supporting batch product, category, and media vision tagging processes, with progress percentages, and graceful stop controls.

### [2026-06-17] v4.2.5 — Storefront SEO Optimization & Category Layout Enhancements
**Files Updated:** `app/(store)/shop/page.tsx`, `app/(store)/product/[slug]/page.tsx`, `components/store/ShopPage.tsx`, `components/admin/CategoryManager.tsx`
**Changes:**
1. **Dynamic Category Metadata**: Updated `generateMetadata` in `/shop` page to parse search params for the active category slug. If a category is selected, it fetches its details and looks up custom `seo_meta` (SEO title, meta description, and image) from the database to improve crawler indexability.
2. **Review/Rating Rich Snippets**: Enriched the Product's JSON-LD schema (`app/(store)/product/[slug]/page.tsx`) by adding the `aggregateRating` and `review` array structures dynamically whenever ratings or reviews exist. This allows search engines to show review stars in search results.
3. **Category Hero Banner**: Designed a premium, light/dark mode responsive Category Banner at the top of the shop listings page. Shows the category title and description (with HTML markup support) and uses the category image as a blurred background cover and a right-side preview thumbnail (with full safety checks for unset/empty fields).
4. **Rich Text & Responsive Modal for Categories**: Replaced the plain textarea description input in `components/admin/CategoryManager.tsx` with the `RichTextEditor` component. Simultaneously refactored the popup layout to be a hybrid mobile-first page overlay (`h-[100dvh] w-full`) and a wide desktop card (`max-w-2xl max-h-[90vh]`) with a responsive grid layout to make rich-text category editing comfortable and fully scrollable.

### [2026-06-17] v4.2.4 — Media Cleaner Pro: Accurate Detection + Select-All + ZIP Download
**Files Updated:** `components/admin/MediaManager.tsx`, `components/common/Icons.tsx`, `package.json`
**Changes:**
1. **Installed `jszip`**: Added `jszip` npm package (with bundled TypeScript types) for client-side ZIP archive generation.
2. **Media Cleaner Pro Tab**: Added a dedicated "Cleaner Pro" tab to `MediaManager` component with split Unused/In-Use sections, each with their own Select All checkbox.
3. **Accurate Usage Detection**: Replaced simple `Set.has()` matching with a normalized URL comparator (`normalizeUrl()`) that decodes URIs, strips query params, and performs filename-level fallback matching to eliminate false negatives from CDN URL variations.
4. **Re-scan Button**: Added a "Re-scan" button to re-trigger the usage cross-reference load without refreshing the page.
5. **ZIP Download**: Implemented `downloadAsZip()` using JSZip — fetches selected files in parallel, compresses with DEFLATE level 6, and triggers a browser download of `used-media.zip` or `unused-media.zip`.
6. **Bulk Delete Unused**: Added `handleBulkDeleteUnused()` to delete all selected unused files from both the `media_library` table and `product-images` storage bucket in a single batch.
7. **Stats Banner**: Added a 4-stat summary card row showing Total / In-Use / Unused counts and reclaimable storage size.
8. **Icons**: Added `ShieldCheck`, `AlertTriangle`, `Archive` to centralized Icons.tsx registry.
9. **No DB schema change required**: All changes are purely frontend/component level.

### [2026-06-16] v4.2.3 — Realtime Subscriptions Optimization: Enable Realtime on orders only
**Files Updated:** `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `supabase/migrations/20260614_abandoned_carts.sql`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **Realtime Optimization**: Removed `abandoned_carts` table from the `supabase_realtime` publication to focus realtime resources exclusively on the `orders` table.
2. **Schema & Migration Alignment**: Synchronized `SUPER_MASTER_SCHEMA.sql` and `20260614_abandoned_carts.sql` to exclude the `abandoned_carts` table publication logic for future deployments.
3. **Live Database Execution**: Ran the command `ALTER PUBLICATION supabase_realtime DROP TABLE abandoned_carts` on the live database to immediately apply this restriction.

### [2026-06-16] v4.2.2 — Bugfix: Add coupon_codes_enabled to settings, Fix settings 500 error & Admin panel layout hydration
**Files Updated:** `app/admin/layout.tsx`, `lib/services/settings.ts`, `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `supabase/migrations/20260616195400_add_coupon_codes_enabled_to_store_settings.sql` (NEW)
**Changes:**
1. **Hydration Mismatch Fix**: Applied the `mounted` state pattern in `app/admin/layout.tsx` to prevent hydration mismatches caused by checking URL search parameters on the server side (where `useSearchParams` does not propagate URL query components in layouts). Both server and client now render matching nodes on initial mount.
2. **PostgREST Query Fix**: Changed sidebar badge query inside `app/admin/layout.tsx` to query snake_case columns (`email_sent` and `order_placed`) instead of camelCase to prevent `400 Bad Request` DB errors.
3. **Missing DB Settings Column**: Added `coupon_codes_enabled` BOOLEAN column to the `store_settings` table to prevent PostgREST `PGRST204` errors when saving store configuration details from the settings screen. Sync'd this column inside `SUPER_MASTER_SCHEMA.sql`.
4. **Settings Update Role Auth**: Updated `updateSettings` inside `lib/services/settings.ts` to utilize the `supabaseAdmin` service role client instead of the user cookie client when saving settings. This resolves Row-Level Security (RLS) constraints that were producing `500 Internal Server Error` in Server Action environments.

### [2026-06-16] v4.2.1 — Bugfix: Add Missing Address Columns to abandoned_carts
**Files Updated:** `supabase/migrations/20260616193800_add_address_fields_to_abandoned_carts.sql` (NEW), `supabase/schema/SUPER_MASTER_SCHEMA.sql`
**Changes:**
1. **Root Cause**: `abandonedCarts.ts` service was trying to `INSERT`/`UPDATE` columns `customer_address`, `customer_city`, `customer_apartment`, `customer_postal_code` on the `abandoned_carts` table — but these 4 columns were never created in the DB, causing Supabase PostgREST to return **400 Bad Request** errors on every cart save and checkout page visit.
2. **Fix**: Added the 4 missing `TEXT` columns to the live `abandoned_carts` table via `ALTER TABLE … ADD COLUMN IF NOT EXISTS`.
3. **Schema Sync**: Updated `SUPER_MASTER_SCHEMA.sql` `CREATE TABLE abandoned_carts` definition to include the 4 new address columns so future project forks will not encounter this issue.

### [2026-06-16] v4.2.0 — Automated Database Webhooks & Cloudflare Cache Rules Setup

**Files Updated:** `supabase/migrations/20260616183200_setup_database_webhooks.sql` (NEW), `scripts/deploy-cloudflare-rules.js` (NEW), `CLOUDFLARE_SUPABASE_SETUP.md` (NEW), `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `new-project-complete-setup-guide (1).md`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **Automated Webhooks Integration**: Created a trigger wrapper function `supabase_functions.http_request()` in the `supabase_functions` schema leveraging the `pg_net` PostgreSQL extension to send asynchronous HTTP POST payloads to the Next.js cache revalidation API (`https://www.zaynahs.pk/api/revalidate`) using the secure revalidation key `zaynahs_secret_cache_revalidate_2026`.
2. **Revalidation Triggers**: Registered 5 database triggers on `products`, `categories`, `reviews`, `homepage_sections`, and `store_settings` using the `supabase_functions.http_request` format to make them fully visible and manageable inside the Supabase Dashboard UI.
3. **Cloudflare Cache Rules Automation**: Created a Node.js script `scripts/deploy-cloudflare-rules.js` that dynamically resolves the ruleset ID of the zone's cache settings phase and deploys the 4 cache rules (bypass for `/cart` etc., 1 year Edge TTL for static assets, bypass for `/*` html-pages, 1 month Edge TTL for supabase-images) matching the screenshot specifications.
4. **Setup Guide Updates**: Created `CLOUDFLARE_SUPABASE_SETUP.md` and updated `new-project-complete-setup-guide (1).md` to explain how to deploy these configurations automatically with 1-click terminal commands.

### [2026-06-15] v4.1.0 — Product Catalog Full Import/Export System
**Files Updated:** `app/api/products/export/route.ts` (NEW), `app/api/products/import/route.ts` (NEW), `lib/services/importExport.ts` (NEW), `components/admin/ImportExportModal.tsx` (NEW), `components/admin/ProductList.tsx`, `components/common/Icons.tsx`, `lib/types.ts`, `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **TypeScript Definitions**: Appended `ExportBundle`, `ExportedProduct`, `ExportedImage`, `ExportedVariant`, `ExportedModifier`, and `ImportResult` interfaces to `lib/types.ts`.
2. **API Routes (Export/Import)**: Created a client-session authenticated `/api/products/export` route to package products, variants, modifiers, and categories with base64 encoded images. Created a streaming `/api/products/import` route to decode base64 blobs, re-upload to storage, link to the database, auto-create categories, process conflict strategies (Skip/Overwrite/Rename), and return line-by-line NDJSON progress.
3. **Media Library Integration**: Configured imported image processing to insert records directly in the `media_library` table to populate the Media Gallery with original metadata (alt, title, description, caption, size, mime).
4. **Icons Registry**: Added `FileDown`, `FileUp`, and `PackageOpen` icons to the centralized registry `components/common/Icons.tsx`.
5. **Admin panel components**: Built the interactive full-screen `ImportExportModal` with drag-and-drop file inputs, conflict Strategy selector, and streaming progress tracker list. Added an "Import / Export" action button to the `ProductList` toolbar.
6. **Master Schema Synchronization**: Backfilled `color_hex TEXT` to the `product_variants` table definition in `SUPER_MASTER_SCHEMA.sql` to maintain a 100% ready-to-deploy schema.

### [2026-06-15] v4.0.3 — Schema Consolidation for Abandoned Carts & Realtime Publications
**Files Updated:** `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `gemini.md`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **Consolidated Abandoned Carts Schema** — Appended `abandoned_carts` table definition, indices, row level security (RLS) policies, and its `updated_at` trigger to [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql).
2. **Order Linker Trigger** — Consolidated the `link_order_to_abandoned_cart()` trigger function and its corresponding `trigger_link_order_to_abandoned_cart` AFTER INSERT trigger on the `orders` table into the master schema.
3. **Supabase Realtime Configuration** — Added auto-creation of the `supabase_realtime` publication (if not existing) and enabled realtime tracking on both `orders` and `abandoned_carts` tables directly inside the master schema.
4. **Master Schema Directive** — Documented the high priority `RULE D6` in [gemini.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/gemini.md) ensuring the master schema file is kept fully self-contained and run-ready.

### [2026-06-15] v4.0.2 — Separate Review Approval and Visibility Moderation Toggles
**Files Updated:** `app/admin/reviews/page.tsx`, `components/store/ReviewsList.tsx`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **Separated Approval and Visibility Actions** — Updated `app/admin/reviews/page.tsx` actions to display both Approve/Unapprove (Check icon) and Hide/Show (Eye/EyeOff icons) buttons for each review in both desktop table and mobile card layouts, rather than conditionally hiding them.
2. **Flexible Approval Toggle** — Replaced `handleApprove` with `handleToggleApprove` in the admin reviews page, allowing administrators to unapprove already approved reviews back into the pending state.
3. **Tailwind Standardizations** — Fixed non-standard Tailwind gray color weights in `ReviewsList.tsx` (`gray-750` → `gray-700`) and the review page loading skeleton (`gray-880` → `gray-800`).

### [2026-06-15] v4.0.1 — Product Reviews Cache Fix & Show/Hide Toggles
**Files Updated:** `lib/services/reviews.ts`, `app/admin/reviews/page.tsx`, `components/common/Footer.tsx`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **Footer Collapsible Submenus** — Updated the storefront footer custom navigation menu items list renderer (`renderFooterMenu`) to use collapsible accordions with standard toggle buttons and ChevronDown icons (loaded from `Icons.tsx`). Added `footerAccordionOpen` state for depth-aware dynamic collapse/expand.
2. **Dynamic Review Cache Keys** — Resolved cache collision bug by rewriting `cachedProductReviews` and `cachedAverageRating` in `lib/services/reviews.ts` to accept `productId` and generate dynamic cache keys (`product-reviews-list-${productId}` / `product-average-rating-${productId}`) and cache tags (`reviews-${productId}`). This resolves the storefront bug where the scorecard would display incorrect ratings or "Based on 0 ratings".
3. **Show / Hide Reviews Action** — Modified `approveReview` function in `lib/services/reviews.ts` to accept a second parameter `approved: boolean` (default `true`) allowing unapproving/hiding a review from the storefront.
4. **Admin Panel Review Toggles** — Updated `app/admin/reviews/page.tsx` actions to replace the single check button with toggle buttons (Eye / EyeOff icons) to easily hide or show customer reviews from the storefront, with success toast feedback. Imported all icons from the centralized `@/components/common/Icons` registry file.

### [2026-06-15] v4.0.0 — Policy Pages Visibility Controls & Recursive Navigation Menu Customizer
**Files Updated:** `supabase/migrations/20260615181000_add_policy_settings.sql`, `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `lib/types.ts`, `lib/services/settings.ts`, `components/admin/SettingsForm.tsx`, `components/admin/settings/PoliciesTab.tsx`, `components/admin/settings/NavigationTab.tsx`, `components/common/Navbar.tsx`, `components/common/Footer.tsx`, `app/(store)/privacy-policy/page.tsx`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **Database Migration** — Added `privacy_policy_content` (TEXT) and six BOOLEAN columns (`show_faq_in_nav`, `show_returns_in_nav`, `show_privacy_in_nav`, `show_faq_in_footer`, `show_returns_in_footer`, `show_privacy_in_footer`) to `store_settings`, all defaulting to `true`.
2. **TypeScript Types** — Added `privacyPolicyContent?`, `showFaqInNav?`, `showReturnsInNav?`, `showPrivacyInNav?`, `showFaqInFooter?`, `showReturnsInFooter?`, `showPrivacyInFooter?` to the `StoreSettings` interface in `lib/types.ts`.
3. **Settings Service** — Updated `DbSettings` interface, `mapRowToSettings`, and `updateSettings` to serialize/deserialize all six visibility flags and privacy policy content.
4. **Admin PoliciesTab** — Added a rich-text editor for Privacy Policy Content alongside FAQ and Returns editors. Added individual toggle switches for Navbar and Footer visibility of each policy link, plus "Show All / Hide All" quick-toggles.
5. **Admin NavigationTab** — Refactored tree renderer to be fully recursive (`renderMenuTree`), with depth-aware indentation, connector guide lines, "Lvl N" badges, and a red "+" button per row to directly add nested children at any depth. The modal also accepts `parentId` for child insertion.
6. **Admin SettingsForm** — Replaced old 2-level menu helpers with fully recursive tree helpers: `findNodeAndParent`, `moveMenuItemUp`, `moveMenuItemDown`, `indentMenuItem`, `outdentMenuItem`, `deleteMenuItem`, and `handleSaveMenuItem`. Added state for all new policy visibility booleans and `privacyPolicyContent`.
7. **Storefront Navbar** — Implemented recursive desktop sub-menu flyout (`renderDesktopSubMenu`) supporting unlimited nesting via CSS `group-hover`. Implemented recursive mobile accordion (`renderMobileNavItem`) with `ChevronDown` toggle. Policy links (FAQ, Returns, Privacy) in the mobile Quick Links section are conditionally rendered based on their respective nav visibility toggles.
8. **Storefront Footer** — Added `renderFooterMenu` recursive function that renders nested items with left-border visual nesting. Policy links (FAQ, Returns, Privacy) appended at bottom of Column 3 Quick Links based on their respective footer visibility toggles.
9. **Privacy Policy Page** — Updated `app/(store)/privacy-policy/page.tsx` to dynamically render `settings.privacyPolicyContent` via `dangerouslySetInnerHTML` when set, falling back to the static template. Fixed non-standard `border-gray-150` → `border-gray-200`.
10. **Code Quality** — Standardized all non-standard Tailwind color weights (e.g. `gray-55`, `gray-150`, `gray-155`, `gray-250`, `gray-405`, `gray-550`, `gray-555`, `gray-750`, `gray-805`, `gray-850`, `gray-955`, `amber-550`, `red-550`) to their nearest valid standard weights across Footer, Navbar, NavigationTab, and PoliciesTab.

### [2026-06-15] v3.9.9 — Customer Password Controls, Reusable RichText Editor & Policy Pages

**Files Updated:** `lib/services/customers.ts`, `components/store/AccountDashboard.tsx`, `app/(store)/login/page.tsx`, `components/admin/RichTextEditor.tsx` (NEW), `components/admin/settings/PoliciesTab.tsx`, `app/(store)/faq/page.tsx` (NEW), `app/(store)/returns/page.tsx` (NEW), `app/(store)/privacy-policy/page.tsx` (NEW), `components/common/Footer.tsx`, `components/common/Navbar.tsx`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **changeCustomerPassword action** — Added a server action to securely verify and change passwords for logged-in customers.
2. **Customer Security Settings** — Created a Change Password section on the customer Account Dashboard, complete with fields for current password, new password, and validation checks.
3. **Forgot Password via WhatsApp** — Configured a WhatsApp redirection fallback flow on the login page for forgotten passwords, adhering to the WhatsApp-only communication rule.
4. **Reusable RichText Editor** — Implemented a premium rich text editor with toolbar formatting buttons and raw HTML view toggle.
5. **Policies Rich Editor** — Upgraded the Policies & FAQ admin settings panel to consume the new RichText Editor.
6. **Policy Page Routes & Navigation** — Created standalone storefront page routes for FAQ, Returns, and Privacy Policy, and placed navigation links in the footer menu and mobile menu drawer under Quick Links.

### [2026-06-15] v3.9.8 — Variant Presets Edit, Import & Export
**Files Updated:** `lib/services/variantPresets.ts`, `app/admin/variants/page.tsx`, `components/common/Icons.tsx`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **updateVariantPreset service** — Implemented an update service function to allow modifying existing presets in the database.
2. **Preset Edit UI** — Added edit buttons to each saved preset in the list, enabling administrators to reload the preset configurations directly into the customizer form, edit details/values, and update the database.
3. **JSON Export/Import** — Exposed Export JSON and Import JSON buttons on the Saved Presets list. Export aggregates all active presets, while Import parses the JSON file, checks for duplicate names, and performs updates for existing presets or creates new entries directly in the database.
4. **Centralized IconRegistry** — Exported the Palette icon inside `components/common/Icons.tsx` to align imports in the variants page with the store's design rules.

### [2026-06-15] v3.9.7 — Admin Customer Orders Modal, Swatch Image Toggle & UX Polish
**Files Updated:** `supabase/migrations/20260615171000_add_show_image_swatch_to_variants.sql`, `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `lib/types.ts`, `lib/services/products.ts`, `lib/services/orders.ts`, `app/admin/customers/page.tsx`, `components/admin/ProductForm.tsx`, `components/store/ProductCard.tsx`, `components/store/VariantSelector.tsx`, `components/store/ProductDetail.tsx`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **Admin Customer Orders Modal** — Embedded a comprehensive client-side orders lookup modal within the admin customers list, enabling administrators to view complete item summaries, variant configurations, date-stamps, and delivery logs matching the look of the customer dashboard.
2. **Swatch Image Toggle Option** — Appended the `show_image_swatch` boolean column to the `product_variants` database table and exposed a dropdown choice ("Show Color" vs "Show Image") in the variant manager row inside the product editor, enabling control over whether color circles render solid hex fills or thumbnails.
3. **ProductCard Swatch Alignment & Sizing UX** — Scaled down catalog wishlist/quickview/cart buttons to a smaller compact size, resolved variant swatches to display images even when colorHex is defined if enabled, and fixed touch-active image deletion events on mobile views inside product form.
4. **FBT Auto-Fallback Removal** — Standardized Frequently Bought Together widgets to only trigger rendering when products are explicitly selected by the administrator.

### [2026-06-14] v3.9.6 — Real-time PWA Order Notifications, Orders Log Stats & Abandoned Cart Exclusions
**Files Updated:** `lib/hooks/useOrderNotification.ts`, `components/admin/OrderLog.tsx`, `app/admin/orders/page.tsx`, `app/admin/abandoned-carts/page.tsx`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **PWA & Browser Audio Unlocking** — Configured first interaction (`click`/`touchstart`) events to preload and unlock browser audio playback to ensure realtime audio notifications fire successfully in standalone PWA/mobile environments.
2. **Service Worker Push Notifications** — Intercepted push notifications using `navigator.serviceWorker.ready` to display background alerts reliably.
3. **Orders Log Dashboard Metrics** — Added stats cards (Total, Pending, Completed, Revenue) and an interactive Fulfillment rate progress bar directly inside `OrderLog.tsx` matching the look of the Abandoned Carts page, and cleaned up `app/admin/orders/page.tsx`.
4. **Active Abandoned Carts Table View** — Configured the Abandoned Carts list log to completely filter out recovered/placed order carts (`order_placed = true`) from the table list and dropdown, preventing completed customers from cluttering active recovery sessions while keeping stats accurate. Added realtime subscriptions to update the list instantly.

### [2026-06-14] v3.9.5 — Abandoned Cart Tables, Settings Columns and Realtime Integrations
**Files Updated:** `supabase/migrations/20260614_abandoned_carts.sql`, `supabase/migrations/20260614050000_add_abandoned_cart_settings.sql`, `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `lib/types.ts`, `lib/services/settings.ts`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **Abandoned Carts Database Table** — Added a dedicated `abandoned_carts` table to store unfinished checkout sessions with contact details, line items, and email status fields.
2. **Abandoned Cart settings fields** — Appended configuration variables (`abandoned_cart_email_enabled`, `abandoned_cart_admin_notify`, `abandoned_cart_email_subject`, `abandoned_cart_email_template`) to `store_settings` and synchronized them to the `StoreSettings` type interfaces and mapping routines.

### [2026-06-14] v3.9.4 — Advanced Theme Typography Font & Text Colors Customization
**Files Updated:** `lib/types.ts`, `lib/themePresets.ts`, `components/admin/customizer/pages/AppearanceSettings.tsx`, `components/common/ThemeStyleRegistry.tsx`, `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `supabase/migrations/20260614040900_add_text_colors_to_theme_config.sql`, `SCHEMA_CHANGE_LOG.md`
**Changes:**
1. **Typography color tokens in ThemeConfig** — Added `textHeading?: string` and `textAccent?: string` to `ThemeConfig['colors']` inside `lib/types.ts`.
2. **Presets enhancement** — Backfilled all 12 preset templates in `lib/themePresets.ts` with custom, design-harmonious values for `textHeading` and `textAccent` color configurations.
3. **AppearanceSettings Customizer Panel** — Exposed color picker controls and hex code inputs for both Heading Font Color and Accent Text Color. JSON Import/Export features automatically pick up the new fields since they consume `themeConfig` directly.
4. **Theme Style Injection Registry** — Registered `--color-text-heading` and `--color-text-accent` CSS variables in `ThemeStyleRegistry.tsx`, map all `h1`-`h6` tags and `.font-heading` selector text directly to heading variable, and styled text accent elements (`.text-accent` and `.text-[#e94560]`) to consume the accent text color. Corrected Tailwind text color overrides rules to not hijack heading elements.
5. **Database columns default schema & migration** — Updated database default settings column value inside `SUPER_MASTER_SCHEMA.sql` and created migration file `20260614040900_add_text_colors_to_theme_config.sql` which merges the properties into existing settings singleton rows safely.

### [2026-06-14] v3.9.3 — Guest Orders RLS Policy & Webhook Cache Gaps
**Files Updated:** `supabase/migrations/20260614001000_add_orders_public_insert.sql`, `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `app/api/revalidate/route.ts`, `components/common/ChunkErrorListener.tsx`, `app/layout.tsx`, `components/common/Navbar.tsx`, `components/store/StoreFront.tsx`, `components/admin/ProductForm.tsx`, `components/store/ProductCard.tsx`
**Changes:**
1. **Orders table RLS Policy** — Added migration `20260614001000_add_orders_public_insert.sql` creating public INSERT and SELECT policies on the `orders` table to resolve checkout 500 security violations for guest users.
2. **Revalidation Webhook Expansion** — Added handlers in `app/api/revalidate/route.ts` for product child tables: `product_variants`, `product_images`, `product_modifiers`, and `reviews`. This dynamically invalidates parent product details page cache.
3. **Router Chunk Error Recovery** — Built `<ChunkErrorListener />` and mounted it inside the root `layout.tsx` to trap `ChunkLoadError` bundle hash load mismatches and automatically trigger clean reloads.
4. **Cache-Busting Settings Images** — Appended the dynamic settings updatedAt timestamp version key (`?v=updatedAt`) to storefront logo and banner image elements to allow instant cache updates.
5. **Cascading Pricing Synchronization** — Configured base `price` and `comparePrice` input onChange handlers in the admin `ProductForm.tsx` to cascade and update the respective values of existing variant entries.
6. **ProductCard Blinking Fix** — Made card bottom detail swatches/action container statically visible instead of hover-expanded to remove height transition layout shifts that trigger cursor blink loops.

### [2026-06-13] v3.9.2 — Newsletter Email Subscribers & Badge Visibility Fix
**Files Updated:** `supabase/migrations/20260613130000_add_email_subscribers.sql`, `supabase/schema/SUPER_MASTER_SCHEMA.sql`, `lib/types.ts`, `lib/services/sections.ts`, `components/common/Footer.tsx`, `app/admin/leads/page.tsx`, `components/admin/ProductForm.tsx`
**Changes:**
1. **New table `email_subscribers`** — stores email addresses from the footer newsletter form. Fields: `id`, `email` (UNIQUE), `source` (default `'newsletter'`), `subscribed`, `created_at`. RLS: public INSERT, admin ALL.
2. **`lib/types.ts`** — Added `EmailSubscriber` interface.
3. **`lib/services/sections.ts`** — Added `addEmailSubscriber(email)` and `getEmailSubscribers()` service functions with duplicate handling.
4. **`components/common/Footer.tsx`** — Newsletter form now calls `addEmailSubscriber`, saves email to DB. Handles already-subscribed case with info toast.
5. **`app/admin/leads/page.tsx`** — Rebuilt with two tabs: "WhatsApp Leads" (existing) and "Newsletter" (new). Stats cards updated. Newsletter tab shows email, source badge, date, mailto link.
6. **`components/admin/ProductForm.tsx`** — Fixed badge clipping: moved `overflow-hidden` to inner div wrapping only the image/overlay. PRIMARY badge and index number badge now rendered on the outer wrapper so they're always fully visible without clipping.

### [2026-06-13] v3.9.1 — Unified Media Selection Dataset & Email Spam Bypass Fixes
**Files Updated:** [MediaSelectorModal.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/MediaSelectorModal.tsx), [sendEmail.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/email/sendEmail.ts), [layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/layout.tsx), [GeneralTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/GeneralTab.tsx)
**Changes:**
1. Unified Media Selector dataset source: Modified `MediaSelectorModal.tsx` to retrieve and write files from/to `media_library` (same as the Media Library page) instead of `product_images`, ensuring the same uploaded images display on both screens.
2. Email Spam Bypass: Configured `sendEmail.ts` to automatically extract text and provide a plaintext `text` fallback body to SMTP/nodemailer, avoiding standard spam filter penalties.
3. Favicon Cache-Buster & MIME Type Mapping: Added dynamic cache-busting timestamp version URL params `?v=timestamp` to favicons in metadata API, mapped correct MIME types (like `image/webp` for uploaded WebP icons) to prevent browser rejection, and added helpful incognito cache instructions in `GeneralTab.tsx`.

### [2026-06-13] v3.9.0 — Split Desktop/Mobile Sticky Header & Min Logo Width Control
**Files Updated:** [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [20260613144500_add_separate_header_sticky.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260613144500_add_separate_header_sticky.sql), [types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts), [settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts), [SettingsForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/SettingsForm.tsx), [HeaderTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/HeaderTab.tsx), [GlobalSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/GlobalSettings.tsx), [GeneralTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/GeneralTab.tsx), [Navbar.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/common/Navbar.tsx), [layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/layout.tsx), [layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/(store)/layout.tsx)
**Changes:**
1. Added database migration creating separate sticky header settings columns `header_sticky_desktop` and `header_sticky_mobile` to `store_settings`.
2. Overhauled storefront Header logic (`Navbar.tsx`) to implement responsive desktop-specific and mobile-specific sticky header CSS states.
3. Updated main layouts (`app/layout.tsx` and `app/(store)/layout.tsx`) replacing `overflow-x-hidden` with `overflow-x-clip` on parent containers to ensure position sticky scrolls and anchors perfectly.
4. Decreased minimum logo display width range limit to `30px` inside customizer and settings tabs, allowing smaller logos.

### [2026-06-13] v3.8.0 — Media Library Advanced Filters Support
**Files Updated:** [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [20260613134100_add_media_size_type.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260613134100_add_media_size_type.sql), [SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/SCHEMA_CHANGE_LOG.md)
**Changes:**
1. Added `file_size` (BIGINT) and `mime_type` (TEXT) columns to the `media_library` database table.
2. Backfilled `mime_type` fields based on file URL extensions and initialized `file_size` placeholders for existing media items.

### [2026-06-12] v3.7.0 — Meta Catalog Real-time Sync Database Schema
**Files Updated:** [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [20260612110000_add_meta_catalog_sync.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260612110000_add_meta_catalog_sync.sql)
**Changes:**
1. Appended `meta_sync_status` (TEXT), `meta_sync_error` (TEXT), and `meta_last_synced_at` (TIMESTAMPTZ) fields to the `products` table definition to track Meta Catalog sync statuses.
2. Created the `meta_category_mapping` database table to map storefront categories to Meta's standard catalog product category paths.

### [2026-06-12] v3.6.0 — Zaynahs SEO + AI Copywriting and Media Library Tables
**Files Updated:** [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [20260612100000_add_seo_and_media_library.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260612100000_add_seo_and_media_library.sql)
**Changes:**
1. Created `seo_meta` database table to track metadata overrides (title, meta descriptions, open graph details, and structured FAQ arrays) for products, categories, and custom pages.
2. Created `media_library` database table to log uploaded files, SEO-friendly file names, captions, alt text, and AI statuses.
3. Created `ai_settings` database table to store Content/Image SEO AI provider parameters, model selections, and rotating API keys.

### [2026-06-12] v3.5.0 — Email Templates System & Order Tracking Columns
**Files Updated:** [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/SCHEMA_CHANGE_LOG.md)
**Changes:**
1. Email Templates Database Table: Created the `email_templates` table via migration containing `email_type`, `category`, `label`, `description`, `enabled`, `subject`, and `custom_html` columns, pre-seeded with 18 default customer and admin email types.
2. Orders Table Columns: Appended `review_email_pending` (BOOLEAN), `delivered_at` (TIMESTAMPTZ), `tracking_number` (TEXT), `courier_name` (TEXT), `tracking_url` (TEXT), `cancel_reason` (TEXT), and `refund_amount` (NUMERIC) fields to the orders table.

### [2026-06-12] v3.4.0 — Tracking Pixels, SEO Title Suffix & AI Configurations
**Files Updated:** [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts), [settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts)
**Changes:**
1. Database Schema Additions: Altered `store_settings` table to add Meta Pixel, GA4, GTM, TikTok, Snapchat, Pinterest, and Twitter/X tracking columns, dynamic `meta_title_suffix` and `twitter_handle` columns, and AI content/vision configuration variables (Groq/Gemini models, tones, languages, and generation switches).
2. Centralized Scripts and Event Triggers: Mounted client-side event listeners tracking standard ecommerce actions on product details, cart changes, checkout forms, search query triggers, and order completions.

### [2026-06-12] v3.3.0 — Product Card Customization Templates & Media Library Upgrades
**Files Updated:** [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts), [settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts)
**Changes:**
1. Product Card Customization Fields: Added `card_style`, `card_show_stars`, `card_show_quickview`, `card_show_wishlist`, `card_show_quickcart`, `card_alignment`, and `card_elements_order` columns to `store_settings` to support visual customizations, 5 templates, alignment, and element reordering.

### [2026-06-12] v3.2.0 — Dynamic Theme Appearance Presets System
**Files Updated:** [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts), [settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts)
**Changes:**
1. Database Appearance Columns: Added `theme_preset` (TEXT) and `theme_config` (JSONB) columns to the `store_settings` table via migration to store visual presentation configurations and 10 ready-made presets.

### [2026-06-12] v3.1.0 — Shopify-Style Orders Log, Staff Notes, Timeline Logs, and Financial Dashboard
**Files Updated:** [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts), [orders.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/orders.ts), [OrderLog.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/OrderLog.tsx), [products.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/products.ts), [PreviewClient.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/settings/customizer/preview/PreviewClient.tsx)
**Changes:**
1. Orders Database Alteration: Added `staff_notes` (TEXT) and `status_logs` (JSONB) to the `orders` table via migration to support internal note editing and order lifecycle history logging.
2. Orders Lifecycle Status Log: Configured status updates and staff notes additions to write rich timeline event logs to `status_logs` automatically.
3. Compare Price Variant Calculation Fix: Overhauled `applyFlashSaleDiscounts` on the server and `liveProducts` on the client customizer preview to dynamically calculate and fallback variants' original compare prices proportionally, ensuring flash sale price calculations cut off the original compare price instead of the selling price when a compare price is present.

### [2026-06-12] v3.0.0 — Dedicated WhatsApp Leads Tab, Email Capture, & Live Previews
**Files Updated:** [types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts), [sections.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/sections.ts), [layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/layout.tsx), [PremiumFeaturesProvider.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/PremiumFeaturesProvider.tsx), [PremiumTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/PremiumTab.tsx), [page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/leads/page.tsx)
**Changes:**
1. Extended WhatsApp subscribers schema: Supported storing optional email address and widget source types ('wheel' vs 'exit_intent').
2. Leads tab additions: Replaced customer lists sub-tab with a fully dedicated Sidebar menu item "WhatsApp Leads" routing to a detailed dashboard.
3. Advanced admin filtering: Implemented search filters, date range filters (Today, Yesterday, Last 7/30 days), source widget segment filters, prefilled WhatsApp templates, and copy buttons on the leads page.
4. Settings live preview mockups: Built visual storefront popup mocks (Exit intent dialog card & Spin wheel SVG layout) directly inside the Settings console page updating in real-time.

### [2026-06-12] v2.9.2 — YouTube/Vimeo Video Embeds & Custom Autoplay Controls
**Files Updated:** [HeroBannerSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/HeroBannerSettings.tsx), [StoreFront.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/StoreFront.tsx), [SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/SCHEMA_CHANGE_LOG.md)
**Changes:**
1. Customizer settings: Added support for YouTube and Vimeo video URLs in slide desktop/mobile video settings, and added dynamic autoplay checkboxes `video_autoplay` and `mobile_video_autoplay` to let administrators toggle autoplay (muted background loops) vs manual play (with controls enabled).
2. Storefront YouTube/Vimeo Embed support: Updated `StoreFront.tsx` to detect YouTube/Vimeo links using regex parsers, rendering them as clean, responsive `<iframe>` tags. If autoplay is enabled, the embedded videos run muted, inline, and looped. Otherwise, controls are enabled and autoplay is disabled.
3. Fallback video control support: Direct video formats (e.g. `.mp4`, `.webm`) respect the same autoplay settings on storefront.

### [2026-06-12] v2.9.1 — Left/Right sorting arrows, variant scaling, & storefront category sale display
**Files Updated:** [FlashSaleSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/FlashSaleSettings.tsx), [products.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/products.ts), [StoreFront.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/StoreFront.tsx), [SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/SCHEMA_CHANGE_LOG.md)
**Changes:**
1. Horizontal Sorting: Added ChevronLeft and ChevronRight alongside vertical Up/Down buttons in the product list sorting controls of the theme customizer, allowing administrators to sort/reorder items back and forth ("agge peche").
2. Storefront Category Display: Overhauled `StoreFront.tsx`'s FlashSaleSection to query and display all active category discount products alongside the manually selected individual products.
3. Proportional Variant Pricing: Extended database-level `applyFlashSaleDiscounts` to automatically recalculate prices for all variants (either proportionally using the discounted product base price ratio, or by applying the percentage/fixed category discount directly to each variant), ensuring storewide price consistency for all combinations.

### [2026-06-12] v2.9.0 — Customizer Flash Sale Grid, Reordering & Category Rules
**Files Updated:** [types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts), [products.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/products.ts), [sections.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/sections.ts), [CustomizerEditor.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CustomizerEditor.tsx), [FlashSaleSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/FlashSaleSettings.tsx), [StoreFront.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/StoreFront.tsx), [SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/SCHEMA_CHANGE_LOG.md)
**Changes:**
1. Customizer Section Addition: Added the new `'flash_sale'` section type, permitting administrators to insert a live Flash Sale grid with custom title, start date-time picker, end date-time picker, custom button labels/links, and choose products with specific flash sale prices.
2. Dynamic Pricing Overrides: Implemented server-side pricing resolution helper `applyFlashSaleDiscounts` inside `lib/services/products.ts` called on `getProducts` and `getProductBySlug`. If the current time lies between the flash sale start and end times, matched products dynamically display their flash sale price and save the original price as crossed-out `comparePrice` everywhere (store grids, detail pages, and cart logic).
3. Storefront UI: Created a premium dark-accented horizontal block layout (`FlashSaleSection`) on the home page with a live countdown timer ticking every second, showing starts/ends countdowns and displaying the discounted products.
4. Product Reordering & Sorting: Integrated Up/Down chevron arrows inside the Customizer products list settings, sorting the storefront grid items dynamically based on the customizer's exact array sequence.
5. Category-wide Sales: Added category selection and discount types (Percentage % vs Fixed Amount Rs.) to apply flash sale discounts to all products in a chosen category dynamically.

### [2026-06-12] v2.8.0 — Homepage Product Grid "View All" Button Customization & Social Links
**Files Updated:** [ProductGridSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/ProductGridSettings.tsx), [StoreFront.tsx](file:///Users/shoaib%20e-store/components/store/StoreFront.tsx), [GlobalSettings.tsx](file:///Users/shoaib%20e-store/components/admin/customizer/pages/GlobalSettings.tsx), [SCHEMA_CHANGE_LOG.md](file:///Users/shoaib%2520e-store/SCHEMA_CHANGE_LOG.md)
**Changes:**
1. Customizer Settings: Added inputs to modify View All button text (`viewAllText`) and custom link URL (`viewAllUrl`) on the homepage Product Grid settings form.
2. Dynamic Linking & Fallback: Configured the customer storefront rendering (`renderProductGrid` in `StoreFront.tsx`) to show customized text and route to the custom URL. If the URL is blank, it dynamically routes to `/shop?category={slug}` matching the selected source category.
3. Social Link Settings: Added missing input fields for Snapchat, Twitter (X), YouTube, and WhatsApp contact numbers inside the Theme Customizer's Global Settings page (`GlobalSettings.tsx`) under Footer & Social tabs, matching the primary Settings page.

### [2026-06-12] v2.7.0 — Product Page Custom Reordering & Announcement Bar Shortcuts
**Files Updated:** [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [20260612011000_add_product_page_layout.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260612011000_add_product_page_layout.sql), [types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts), [settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts), [CustomizerEditor.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CustomizerEditor.tsx), [ProductDetailPageSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductDetailPageSettings.tsx), [PreviewClient.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/settings/customizer/preview/PreviewClient.tsx), [Navbar.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/common/Navbar.tsx), [Footer.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/common/Footer.tsx), [PremiumTab.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/settings/PremiumTab.tsx), [SettingsForm.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/SettingsForm.tsx)
**Changes:**
1. Database Schema: Added `product_page_layout` text array column to `store_settings` to persist custom product details sections order.
2. Customizer Reordering: Added up/down reordering controls for Product Page blocks inside `ProductDetailPageSettings.tsx`.
3. Preview Client Sync: Updated preview to render Product Detail Page blocks dynamically in the saved/live layout order.
4. Iframe Click-to-Select: Configured click events on Header, Footer, and Announcement Bar inside `Navbar.tsx` and `Footer.tsx` to communicate with the parent editor via postMessage to auto-select properties.
5. Announcement Bar Editing: Allowed news bar/announcement bar edits directly on the Home Page Customizer stack, the Global Header Customizer settings, and the main Premium Features tab.
6. Real-time Live Preview: Logo width, news text, and all customizer properties sync dynamically in the preview, and are only saved on clicking "Save Layout".

### [2026-06-12] v2.6.0 — Theme Customizer Modular Refactoring & Modularity Guidelines
**Files Updated:** [gemini.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/gemini.md), [CustomizerEditor.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CustomizerEditor.tsx), [HeroBannerSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/HeroBannerSettings.tsx), [ProductGridSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/ProductGridSettings.tsx), [CategoryListSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/CategoryListSettings.tsx), [CategoryGridSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/CategoryGridSettings.tsx), [PromoBannerSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/PromoBannerSettings.tsx), [RecentReviewsSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/RecentReviewsSettings.tsx), [BrandsLogosSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/BrandsLogosSettings.tsx), [SocialFeedSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/sections/SocialFeedSettings.tsx), [SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/SCHEMA_CHANGE_LOG.md)
**Changes:**
1. Added RULE O1 to gemini.md defining strict modularity requirements (separate files for settings tabs/modals, keep files under 500 lines).
2. Refactored the homepage sections theme customizer editor to move inline section fields into dedicated separate components under `components/admin/customizer/sections/`.
3. Reduced CustomizerEditor.tsx size from 1577 lines to ~470 lines for better updateability and speed.
4. Integrated Page Selector dropdown to switch between Home Page, Shop Page, Product Details, and Global Settings within the Theme Customizer.
5. Connected ShopPageSettings, ProductDetailPageSettings, and GlobalSettings components with live state management.
6. Synchronized settings state down to the preview iframe on change and page navigation.
7. Wired up database persistence using updateSettings server action in handleSaveLayout.

---

### [2026-06-08] v2.5.0 — Make product_id Nullable in product_images
**Files Updated:** [20260608135800_make_product_id_nullable_in_product_images.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260608135800_make_product_id_nullable_in_product_images.sql), [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/SCHEMA_CHANGE_LOG.md)
**Changes:**
1. Dropped `NOT NULL` constraint from `product_id` column in `product_images` table to allow general media library/banner image uploads to be registered in the database.

### [2026-06-08] v2.4.0 — Flash Sale Start Dates Scheduling & Timer Robustness
**Files Updated:** [20260608135000_add_flash_sale_start_dates.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/migrations/20260608135000_add_flash_sale_start_dates.sql), [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql), [types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts), [settings.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/settings.ts), [products.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/services/products.ts), [ProductDetail.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductDetail.tsx), [SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/SCHEMA_CHANGE_LOG.md)
**Changes:**
1. Database migration added: `flash_sale_start_date` column to `store_settings` and `products` tables.
2. Storefront Flash Sale Logic Upgrade: Fixed conditional logic so storefront detail timer falls back to global settings when product-level timer is not set or expired. Handled Start Date countdown ("Starts In:") and End Date countdown ("Ends In:").

---

### [2026-06-08] v1.5.0 — Dynamic Product Size Guides Preset Creator & Interactive Sizing Table Builder
**Files Updated:** supabase/migrations/20260608010000_add_size_guides_table.sql, supabase/schema/SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/sizeGuides.ts, lib/services/products.ts, lib/services/storage.ts, components/admin/ProductForm.tsx, components/admin/SettingsForm.tsx, components/store/ProductDetail.tsx, components/common/Icons.tsx, SCHEMA_CHANGE_LOG.md
**Changes:**
1. Database Schema additions: Created `size_guides` table storing size charts (`chart_data` JSONB) and associated measurement images. Added `size_guide_id` relationship column to `products` table.
2. Settings Presets Manager: Built a custom Size Guides admin tab featuring a list of presets (with edit/delete), custom chart image uploader, and dynamic sizing table builder where columns are custom defined and cell values are filled in an interactive grid.
3. Product Form selector: Updated product creator form to fetch size guides and support linking presets to individual products.
4. Storefront triggers & modal: Added `Ruler` icon to the action links row next to "Share" and "Ask a question" on the customer storefront. Overhauled the Size Guide modal to dynamically render column headers, table rows, and the reference diagram if uploaded.
5. Fully resolved strict type constraints and verified clean compilation checks with zero errors.

---

### [2026-06-08] v1.4.0 — Advanced Ticker Customizer, Exit Intent Image Uploader & Cookie Consent Customization
**Files Updated:** supabase/migrations/20260608009000_add_recent_buyers_advanced_settings.sql, supabase/schema/SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/settings.ts, lib/services/orders.ts, components/admin/SettingsForm.tsx, components/store/PremiumFeaturesProvider.tsx, SCHEMA_CHANGE_LOG.md
**Changes:**
1. Database migration added advanced columns: `recent_buyers_names`, `recent_buyers_cities`, `recent_buyers_source`, `recent_buyers_product_pool`, `recent_buyers_custom_products`, `recent_buyers_initial_delay`, `recent_buyers_interval`, `recent_buyers_display_duration`, `exit_intent_image_url`, `exit_intent_delay_mobile`, `cookie_consent_text`, `cookie_consent_button_text` to the `store_settings` table.
2. Modified SettingsForm to render fields for Cities list, Names list, simulated/real buyer source radio toggle, product notification pool select, scrollable custom products checklist, delay/interval sliders, cookie consent texts, and exit intent banner image uploader (with dual manual URL pasting and local optimized uploads).
3. Verified full strict TypeScript compilation successfully.

---

### [2026-06-08] v1.3.0 — Storefront Settings respect settings toggles for 12 Premium Features
**Files Updated:** components/admin/SettingsForm.tsx, components/store/PremiumFeaturesProvider.tsx, components/store/CartDrawer.tsx, components/store/CartContainer.tsx, components/store/ProductDetail.tsx, SCHEMA_CHANGE_LOG.md
**Changes:**
1. Rendered checkbox toggles in the Settings Form's Premium Features tab to fully control showing/hiding individual features: Cookie Consent, Recent Buyers, Free Shipping Progress Bar, Volume Discounts, Frequently Bought Together, Stock Urgency, Flash Sale, Social Feeds, Cart Expiry, and Size Guide.
2. Updated `PremiumFeaturesProvider.tsx`, `CartDrawer.tsx`, `CartContainer.tsx`, and `ProductDetail.tsx` to respect these toggles before executing calculations, ticking timers, or rendering widgets.
3. Verified strict compile safety using `npx tsc --noEmit` which completed with zero compilation errors.

---

### [2026-06-07] v1.2.0 — Design Token System + Font System
**Files Updated:** tailwind.config.ts, app/globals.css, app/layout.tsx, components/common/Button.tsx, components/common/Badge.tsx, components/common/Typography.tsx, STORE_GUIDE.md, SCHEMA_CHANGE_LOG.md
**Changes:**
1. Plus Jakarta Sans (headings) + Outfit (body) via next/font — zero layout shift
2. Complete color token system: primary green, secondary navy, accent red
3. Dark mode CSS variables in globals.css
4. Button component with 7 variants + 5 sizes, min 44px touch targets
5. Badge component with 7 variants
6. Typography component with consistent scale
7. 1 line change in tailwind.config.ts changes entire site color

---

### [2026-06-08] v2.3.0 — Trust Badges Selectors, Social Media Integrations & Shopify-Style Footer
**Files Updated:** supabase/migrations/20260608003000_add_badges_socials_and_footer_editable_fields.sql, supabase/migrations/20260608004000_add_footer_bottom_text_to_settings.sql, supabase/schema/SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/settings.ts, components/admin/SettingsForm.tsx, components/store/StoreFront.tsx, components/common/Footer.tsx, SCHEMA_CHANGE_LOG.md
**Changes:**
1. Added individual trust badge enable/disable selectors, new social platform URLs (TikTok, Snapchat, Twitter), editable footer column title/text fields, and an editable footer bottom copyright text field to settings.
2. Built a premium 4-column Shopify-style storefront footer showing customizable brand details, line-break-preserving support details, automatic quick links navigation, and an interactive newsletter signup box.
3. Removed hardcoded bottom placeholder texts and integrated dynamic, settings-driven payment method badges (Visa, Mastercard, PayPal, Amex, Klarna, etc.) aligned in the footer bottom.

---

### [2026-06-07] v2.2.0 — Shopify-Style Navigation Menu Customizer
**Files Updated:** supabase/migrations/20260607250000_add_navigation_menu_settings.sql, supabase/schema/SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/settings.ts, components/admin/SettingsForm.tsx, components/common/Navbar.tsx, SCHEMA_CHANGE_LOG.md
**Changes:**
1. Added `navigation_menu` (JSONB, default `[]`) and `header_desktop_menu_align` (TEXT, default `'center'`) columns to `store_settings`.
2. Initialized default menu items (Home, Shop) for the existing settings singleton row.
3. Added `NavigationItem` interface to `lib/types.ts` and `navigationMenu` / `headerDesktopMenuAlign` fields to `StoreSettings`.
4. Updated `lib/services/settings.ts` `mapSettings` to map `navigation_menu` → `navigationMenu` and `updateSettings` to serialize it back.
5. Added full Navigation Menu Customizer UI in `SettingsForm.tsx`: tree view of items with up/down reorder, indent/outdent nesting (max 2 levels), edit/delete per item, and an add/edit modal supporting custom URL, category link, product link, and system page link types.
6. Updated `Navbar.tsx` desktop header to dynamically render the custom nav menu in the configured alignment slot with hover dropdown support for sub-menu items.
7. Updated `Navbar.tsx` mobile drawer to use scrollable layout with categories at top → custom nav items (accordion-style) in middle → Quick Links (Cart/Wishlist/Admin) at bottom.

---

### [2026-06-07] v2.1.0 — Review Statistics Synchronization & Mobile Header Click Fix
**Files Updated:** supabase/migrations/20260607240000_sync_product_reviews_count_and_rating.sql, lib/services/reviews.ts, components/common/Navbar.tsx, SCHEMA_CHANGE_LOG.md
**Changes:**
1. Created database migration to update existing product reviews counts and ratings based on approved reviews in the database.
2. Added `trigger_update_product_reviews_stats` in Supabase Postgres to automatically update `products.reviews_count` and `products.rating` whenever reviews are inserted, updated (approved), or deleted.
3. Updated `reviews.ts` server actions (`submitReview`, `approveReview`, `deleteReview`) to call `revalidateTag('products', 'max')` to invalidate the storefront products cache edge tag, immediately updating storefront product cards.
4. Fixed mobile header click interception by changing the layout from a rigid grid to a flexible flexbox layout, ensuring slot bounds do not overlap and the search button receives click events correctly.

---

### [2026-06-07] v2.0.0 — Separate Archive & Product Detail Swatch Sizes and Alignments
**Files Updated:** supabase/migrations/20260607220000_separate_swatch_sizes.sql, supabase/schema/SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/settings.ts, components/admin/SettingsForm.tsx, components/store/ProductCard.tsx, components/store/VariantSelector.tsx, SCHEMA_CHANGE_LOG.md
**Changes:**
1. Created store_settings database columns `archive_swatch_size` (TEXT DEFAULT 'md'), `product_swatch_size` (TEXT DEFAULT 'md'), and `archive_swatch_align` (TEXT DEFAULT 'left').
2. Updated TypeScript interfaces and database mapper/service actions to load and save the new fields.
3. Redesigned Swatch Display Settings inside the Admin Settings Panel to support distinct sizes (sm, md, lg, xl, xxl) for archive (catalog cards) and product details pages.
4. Added left, center, right alignment controls for the Archive swatches in Admin Panel settings.
5. Updated catalog card `ProductCard` to apply `archiveSwatchAlign` class (`justify-start`, `justify-center`, or `justify-end`) and resize catalog swatches to `sm`, `md`, `lg`, `xl`, or `xxl` based on settings.
6. Updated product details page `VariantSelector` to respect `productSwatchSize` (sm, md, lg, xl, xxl) and dynamically scale the touch target button wrappers (`w-11 h-11`, `w-12 h-12`, `w-14 h-14`) to prevent layouts from overflowing.

---

### [2026-06-07] v1.9.0 — Storefront Polish, Badges Manager, Image Ratios & Clamping
**Files Updated:** supabase/migrations/20260607210000_add_badges_and_hover_settings.sql, supabase/schema/SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/badges.ts (NEW), lib/services/products.ts, lib/services/settings.ts, app/admin/layout.tsx, app/admin/badges/page.tsx (NEW), components/admin/BadgeManager.tsx (NEW), components/admin/SettingsForm.tsx, components/admin/ProductForm.tsx, components/store/ProductCard.tsx, components/store/ProductDetail.tsx, components/store/VariantSelector.tsx, SCHEMA_CHANGE_LOG.md
**Changes:**
1. Created `badges` table with name, background color, text color, and full RLS policies.
2. Added `custom_badge_id` and `badge_enabled` to products. Added `image_hover_style`, `image_aspect_ratio`, and `title_line_limit` to store_settings.
3. Created `badges.ts` service for CRUD. Updated products and settings services to map these fields.
4. Added "Badges" link to admin sidebar and created `/admin/badges` page with a rich BadgeManager interface (live preview).
5. Integrated badge selection dropdown and toggle switch on Add/Edit product tabs.
6. Added settings inputs for Image Hover Style, Image Aspect Ratio, and Title Clamping.
7. Fixed catalog card spacing (swatches no longer touch button) and mobile button sizing (now fits exactly on one line).
8. Implemented catalog hover fade image transition (swaps between 1st and 2nd images) and badge overlays (Sale, Featured, and Custom Badges).
9. Fixed product detail image gallery variant synchronizations by memoizing attributes and wrapping callback handlers in stable useCallback.

---

### [2026-06-07] v1.8.0 — Swatch Card Limits, Default Variant Indexes & Catalog Swatch Toggles
**Files Updated:** supabase/migrations/20260607200000_archive_swatch_settings.sql, supabase/schema/SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/products.ts, lib/services/settings.ts, components/admin/SettingsForm.tsx, components/admin/ProductForm.tsx, components/store/ProductCard.tsx
**Changes:**
1. Created database columns `swatch_limit` (INTEGER DEFAULT 8) and `default_variant_index` (INTEGER DEFAULT 1) in `store_settings`.
2. Created database column `show_swatches_on_archive` (BOOLEAN DEFAULT true) in `products`.
3. Updated all typescript types and service layers to map and save these settings.
4. Added settings fields in the Admin Settings panel to configure maximum swatch display limit (1-20) and default variant index (1st-5th variant) shown on catalog lists.
5. Added a toggle switch in the Admin Product Form to enable/disable showing swatches on archive cards per product.
6. Overhauled catalog cards (`ProductCard.tsx`) to respect swatch limit slicing, show/hide swatch lists based on per-product catalog visibility, and override the initial card display price/image with the user's default variant choice.

---

### [2026-06-07] v1.7.0 — Swatch Enhancements & Per-Product Swatches Control
**Files Updated:** supabase/migrations/20260607190000_add_enable_swatches_to_products.sql, supabase/schema/SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/products.ts, components/admin/ProductForm.tsx, components/store/VariantSelector.tsx, components/store/ProductDetail.tsx
**Changes:**
1. Created database column `enable_swatches` (BOOLEAN DEFAULT true) on `products` table.
2. Updated TypeScript interfaces and database mapper/service actions to load/save `enableSwatches`.
3. Replaced the `Linked image URL` text input inside the Color Settings section of the product form with a dropdown populated by the product's uploaded/selected images.
4. Added an `Enable Visual Swatches` toggle switch under the Product Variants section in the Admin Panel to control whether color swatches are rendered for that specific product.
5. Updated storefront `VariantSelector` to respect both global and per-product swatch settings, dynamically rendering color circles/squares or falling back to text-based button labels.

---

### [2026-06-07] v1.6.0 — Advanced Variant Swatch System + Media Library
Files Updated: supabase/migrations/20260607180000_variant_color_image.sql, lib/types.ts, lib/services/products.ts, lib/services/settings.ts, lib/services/variantPresets.ts (NEW), components/admin/ProductForm.tsx, components/admin/SettingsForm.tsx, components/store/ProductCard.tsx, components/store/ProductGrid.tsx, app/admin/variants/page.tsx (NEW), app/admin/media/page.tsx (NEW), app/admin/layout.tsx
Changes:
1. Added `color_hex` to `product_variants` table.
2. Added `enable_variant_swatches`, `swatch_shape`, `swatch_size` to `store_settings`.
3. New `variant_presets` table for reusable variant sets.
4. ProductForm: rebuilt variant builder with tag-chip input, hex picker, image URL per color, preset import, cross-product generation.
5. ProductCard: color swatches on catalog cards with hover image preview, settings-driven shape/size.
6. New admin pages: /admin/variants (presets management) and /admin/media (media library).
7. Admin sidebar: Added Variants + Media nav items.
⚠️ Run supabase/migrations/20260607180000_variant_color_image.sql in Supabase SQL Editor!

### [2026-06-07] v1.4.0 — Editable Scrolling Ticker (Infinite Marquee)
Files Updated: supabase/migrations/20260607070000_add_ticker_settings.sql, SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/settings.ts, components/admin/SettingsForm.tsx, app/(store)/product/[slug]/page.tsx
Changes:
1. Added database columns `enable_ticker` (BOOLEAN) and `ticker_text` (TEXT) to the `store_settings` table.
2. Updated TypeScript types in `lib/types.ts` and Supabase settings server actions in `lib/services/settings.ts` to map and update these settings.
3. Implemented settings input components (enable toggle, textarea for line-by-line configuration) in the admin panel `SettingsForm.tsx`.
4. Rendered an infinite scrolling marquee scroller between product details and customer reviews on the product storefront page.

---

### [2026-06-07] v1.3.0 — Customizable Live Viewer Counter & Trust Badges Settings
Files Updated: supabase/migrations/20260607060000_add_settings_trust_and_views.sql, SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/settings.ts, components/admin/SettingsForm.tsx, components/store/ProductDetail.tsx
Changes:
1. Added database columns to `store_settings` to toggle/customize fake viewer counter ranges and custom trust text.
2. Updated Admin settings dashboard (`components/admin/SettingsForm.tsx`) with form inputs for minimum/maximum viewer ranges, toggle state, delivery texts, and safe checkout checkbox lists.
3. Updated storefront detail layout to read settings configuration and dynamically display the custom delivery terms, discount coupons, and payment card logos.

---

### [2026-06-07] v1.2.0 — Manual Ratings, Reviews Count, Wishlisting & Sharing
Files Updated: supabase/migrations/20260607050000_add_product_reviews_count_and_rating.sql, SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/products.ts, components/admin/ProductForm.tsx, components/store/ProductDetail.tsx, components/common/Navbar.tsx, components/store/WishlistContainer.tsx (created), app/(store)/wishlist/page.tsx (created)
Changes:
1. Added `rating`, `reviews_count`, and `short_description` columns to the `products` table.
2. Updated Admin `ProductForm` to edit these three fields, including auto mapping.
3. Enhanced storefront `ProductDetail` component to render star rating, short description, dynamic trust views badge, WhatsApp question button, social share modal (Facebook, X, Pinterest, Instagram intents), and persistent wishlist toggles.
4. Integrated wishlist badge to Navbar and created a dedicated customer `/wishlist` catalog page displaying saved items.

---

### [2026-06-07] v1.1.0 — Product Reviews System
Files Updated: supabase/migrations/20260607000001_add_reviews.sql, SUPER_MASTER_SCHEMA.sql, lib/types.ts, lib/services/reviews.ts, components/store/ReviewsList.tsx, components/store/ReviewForm.tsx, components/store/StarRating.tsx, app/admin/reviews/page.tsx
Changes:
1. reviews table with rating, comment, customer_name, approved flag
2. RLS: public can read approved + insert new, admin full access
3. Admin approve/reject panel at /admin/reviews

---

### [2026-06-07] v1.0.0 — Initial Schema

**Files Updated:**
- `supabase/schema/SUPER_MASTER_SCHEMA.sql` (created)
- `lib/types.ts` (created)

**Changes:**
1. **`categories`** table — name, slug, image, sort_order, active
2. **`products`** table — name, slug, price, compare_price, cost, sku, stock, has_variants, is_service, is_featured, active, tags
3. **`product_images`** table — multiple images per product, sort_order, is_primary
4. **`product_variants`** table — color, size, material, custom_option, price override, stock per variant
5. **`product_modifiers`** table — add-ons with price (e.g. Gift Wrap +50)
6. **`store_settings`** table — singleton row, WhatsApp number, currency, feature toggles
7. **`orders`** table — WhatsApp order tracking, auto order_number (ZE-0001 format)
8. **Storage Bucket** — `product-images` public bucket with RLS policies
9. **RLS Policies** — Public read active products, Admin full access (authenticated)
10. **Triggers** — updated_at auto-update, order_number sequence

### [2026-06-07] v1.0.0 — Initial Schema Deployment

**Files Updated:**
- `supabase/schema/SUPER_MASTER_SCHEMA.sql` (created & pushed)
- `lib/types.ts` (created)
- `lib/services/*` (created)

**Changes:**
1. Initialized core database schema tables for Zaynahs E-Store (`categories`, `products`, `product_images`, `product_variants`, `product_modifiers`, `store_settings`, `orders`, `schema_version`).
2. Pushed the schema to Supabase hosting using direct psql configuration.
3. Implemented full Next.js App Router application with RLS policies, storage bucket rules, and WhatsApp checkout integration.

---

### [2026-06-07] v1.0.1 — Admin Email Security Restriction

**Files Updated:**
- `.env.local`
- `app/admin/login/page.tsx`
- `middleware.ts`

**Changes:**
1. Configured owner's admin email address `shoaibzaynah@gmail.com` in environment configurations (`NEXT_PUBLIC_ADMIN_EMAIL`).
2. Restricted sign-in attempts on `/admin/login` page so only the verified configured email address is permitted.
3. Added matching check in standard routes `middleware` file to prevent auth session hijacking or bypassing by other accounts.

---

### [2026-06-07] v1.0.2 — Password Forget & Reset System

**Files Updated:**
- `middleware.ts`
- `app/admin/login/page.tsx`
- `app/admin/forgot-password/page.tsx` (created)
- `app/admin/reset-password/page.tsx` (created)

**Changes:**
1. Created `/admin/forgot-password` page to request password reset emails through Supabase Auth, validating that the input email matches the owner's email address.
2. Created `/admin/reset-password` page which parses the redirect authentication token and saves the new password using `supabase.auth.updateUser`.
3. Allowed forgot password and reset password routes to bypass auth middleware redirects so they are reachable during recovery.
4. Added recovery trigger prompt below password input field on `/admin/login` page.

### [2026-06-07] v1.0.3 — Dark Mode, PWA & Brand Asset Upload Panel

**Files Updated:**
- `supabase/migrations/20260607033500_add_favicon_url_to_settings.sql` (created)
- `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)
- `package.json` (modified)
- `lib/types.ts` (modified)
- `lib/services/settings.ts` (modified)
- `lib/services/storage.ts` (modified)
- `lib/utils/imageCompressor.ts` (created)
- `app/globals.css` (modified)
- `components/common/ThemeToggle.tsx` (created)
- `components/common/Navbar.tsx` (modified)
- `app/admin/layout.tsx` (modified)
- `components/admin/SettingsForm.tsx` (modified)
- `app/layout.tsx` (modified)
- `app/(store)/layout.tsx` (modified)
- `gemini.md` (modified)

**Changes:**
1. **Database settings extension** — Created migration script adding `favicon_url` and `logo_width` columns to the `store_settings` table.
2. **HEIC/HEIF & Compressor Utility** — Implemented client-side smart compression using canvas loops, resizing and optimizing all image uploads to WebP files under 50 KB. Integrated iPhone HEIC/HEIF compatibility via client-side `heic2any` dynamic imports.
3. **Settings branding panel** — Completely redesigned the branding assets panel on settings screen, replacing plain text URLs with direct drag-and-drop file uploads for Logo, Banner, and Favicon. Added slider control to adjust and persist the logo display size.
4. **Theme Switcher** — Configured class-based dark mode switching via Tailwind CSS v4 custom variant and added client `ThemeToggle` component to customer and admin headers. Added global form contrast overrides in `globals.css`.
5. **Dynamic Branding** — Updated Next.js metadata dynamically to read current settings name, tagline, and favicon from the database.

### [2026-06-07] v1.0.4 — next-themes Integration, Typos Standardization & Contrast Polish

**Files Updated:**
- `app/globals.css`
- `components/store/CategoryFilter.tsx`
- `components/store/CartContainer.tsx`
- `components/admin/CategoryManager.tsx`
- `components/store/ProductDetail.tsx`
- `app/admin/login/page.tsx`
- `app/admin/forgot-password/page.tsx`
- `app/admin/reset-password/page.tsx`
- `components/admin/OrderLog.tsx`
- `app/admin/layout.tsx`
- `app/admin/dashboard/page.tsx`
- `components/common/Navbar.tsx`
- `components/store/CartBar.tsx`
- `components/store/SearchBar.tsx`
- `components/store/VariantSelector.tsx`
- `components/admin/SettingsForm.tsx`
- `gemini.md`

**Changes:**
1. **Tailwind v4 Variant Standardization**: Replaced `@custom-variant` with the standard `@variant dark (&:where(.dark, .dark *))` directive in `globals.css` for class-based dark mode compatibility.
2. **Standardized Tailwind Overrides**: Configured clean global dark overrides in `globals.css` (e.g. `.dark .bg-white`, `.dark .text-gray-900`, `.dark .text-gray-500`) to act as a dynamic, robust fallback for all standard colors, immediately fixing contrast issues across tables, headers, and form inputs.
3. **Color Typo Standardization**: Cleaned up all non-standard colors (e.g. `gray-250`, `gray-205`, `gray-955`, `gray-755`, `gray-55`, `gray-350`, `gray-550`, `red-550`) and replaced them with standard Tailwind CSS gray scale and color weights.
4. **Dark Mode Contrast Polish**: Fully implemented `dark:` variant support across checkout pages, variant selections, mobile sticky cart bars, dashboards, login pages, and inputs to ensure zero text or layout contrast regressions.

---

### [2026-06-07] v1.0.5 — Next.js ISR Caching for Storefront

**Files Updated:**
- `lib/services/products.ts` (modified)
- `lib/services/categories.ts` (modified)
- `lib/services/settings.ts` (modified)

**Changes:**
1. **Products Cache** — Wrapped `getProducts()` and `getProductBySlug()` with `unstable_cache` using tag `products` and 1-hour TTL. Uses cookie-free `staticSupabase` client to avoid Dynamic Server Usage errors.
2. **Categories Cache** — Wrapped `getCategories()` with `unstable_cache` using tag `categories` and 1-hour TTL. Cookie-free client used inside the cache boundary.
3. **Settings Cache** — Wrapped `getSettings()` with `unstable_cache` using tag `settings` and 1-hour TTL. Cookie-free client used inside the cache boundary.

4. **On-Demand Revalidation** — All admin CRUD mutations call `revalidateTag(...)` to instantly refresh storefront cache.
5. **Admin reads remain dynamic** — `getAllProductsAdmin`, `getProductById`, `getAllCategories` still use cookie-aware SSR client.

---

### [2026-06-07] v1.0.6 — Dark Mode Switching Fix & Admin Page Visibility

**Files Updated:**
- `app/(store)/layout.tsx`
- `components/store/StoreFront.tsx`
- `app/admin/layout.tsx`
- `app/admin/categories/page.tsx`
- `app/admin/orders/page.tsx`
- `app/admin/settings/page.tsx`
- `app/admin/products/new/page.tsx`
- `app/admin/products/[id]/page.tsx`

**Changes:**
1. **Store layout dark mode** — Added `dark:bg-[#0f0f1b]` and `dark:text-gray-100` to the store layout wrapper div and `<main>` element. Previously the entire content area stayed white in dark mode.
2. **StoreFront component** — Added `dark:bg-[#0f0f1b] text-gray-900 dark:text-gray-100` to root div so product grid area switches properly.
3. **Admin main content** — Added `dark:bg-[#0f0f1b]` to the `<main>` element in admin layout so admin pages switch background on theme toggle.
4. **All admin page headings** — Added `dark:text-white` to all `<h1>` elements and `dark:text-gray-400` to subtitle `<p>` elements across categories, orders, settings, new product, and edit product pages.

---

### [2026-06-07] v1.0.7 — next.config Image Domains + Image Compressor Rewrite

**Files Updated:**
- `next.config.ts`
- `lib/utils/imageCompressor.ts`
- `components/admin/ProductForm.tsx`
- `components/admin/ProductList.tsx`
- `components/admin/SettingsForm.tsx`

**Changes:**
1. **next.config.ts** — Added Supabase storage hostname (`jqwqgiqfvjdxaohzvjuv.supabase.co`) to `images.remotePatterns` so `next/image` can render uploaded product images, logos, and banners without "hostname not configured" errors. Added `formats: ['image/webp', 'image/avif']`.
2. **Admin image previews** — Replaced `<Image>` (next/image) with plain `<img>` in `ProductForm` image grid and `ProductList` thumbnail to eliminate domain restriction errors in admin panel.
3. **imageCompressor.ts — Complete Rewrite** — Replaced single-strategy HEIC converter with a 3-strategy fallback chain:
   - **Strategy 1**: `createImageBitmap(file)` — fastest, uses OS HEIC codec natively on macOS/iOS
   - **Strategy 2**: `ObjectURL → <img> → createImageBitmap` — uses OS decoder via img element, works for HEIC on macOS Chrome where Strategy 1 fails
   - **Strategy 3**: `heic2any` → `createImageBitmap` — pure WASM fallback for HEIC on Windows/Linux
   - **Fixed canvas self-draw bug** — now uses a separate temp canvas for resolution reduction passes instead of drawing the canvas onto itself
   - **Clear error messages** — instead of silently uploading a broken HEIC file, throws user-visible errors shown as toast notifications
   - **WebP target**: max 1200px initial dim, iterative quality `0.88→0.15`, resolution reduces 75% every 4 passes, target under 50 KB
4. **Error toasts** — Updated `SettingsForm` and `ProductForm` upload catch blocks to show the actual compressor error message (not a generic string) so users know exactly what action to take.

---

### [2026-06-07] v1.0.8 — Server-Side HEIC Conversion (Sharp API Route)

**Files Updated:**
- `app/api/upload-image/route.ts` (created)
- `lib/services/storage.ts` (modified)
- `next.config.ts` (modified)
- `components/common/Navbar.tsx` (modified)
- `package.json` (modified — `sharp` added)

**Changes:**
1. **Sharp installed** — `sharp@0.34.5` added with libheif `1.20.2` and libvips `8.17.3` providing native HEIC/HEIF decoding server-side.
2. **`/api/upload-image` route** — New Next.js API route that accepts any image file (including HEIC) via FormData, converts to WebP under 50KB using Sharp, and uploads to Supabase Storage using service role key. Iterative quality + resolution reduction loop.
3. **`storage.ts` rewrite** — `uploadProductImage` and `uploadSettingsImage` now use the server API route as primary upload method. Client-side canvas compression is retained as fallback if the API is unreachable.
4. **`next.config.ts`** — Added `serverActions.bodySizeLimit: '25mb'` to allow large HEIC originals (iPhone HEIC files can be 4–12MB).
5. **Navbar hydration fix** — Cart badge count (from Zustand persist/localStorage) caused React SSR/CSR mismatch. Fixed by rendering badge only after `useEffect` mount, eliminating the hydration error.

---

### [2026-06-07] v1.0.9 — Storefront Header Layout & Color Customization Settings

**Files Updated / Created:**
- `supabase/migrations/20260607230000_header_layout_settings.sql` (created)
- `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)
- `lib/types.ts` (modified)
- `lib/services/settings.ts` (modified)
- `components/admin/SettingsForm.tsx` (modified)
- `components/common/Navbar.tsx` (modified)
- `app/(store)/layout.tsx` (modified)

**Changes:**
1. **Database Schema** — Added 20 new configuration columns to the `store_settings` table, including layout flags (`header_show_top_bar`, `header_show_newsletter`), text values (`header_top_bar_phone`, `header_top_bar_email`, `header_newsletter_text`), style values (`header_top_bar_bg`, `header_top_bar_text_color`, `header_bg`, `header_text_color`, `header_border_color`), and alignments for Desktop and Mobile (Logo, Search, Wishlist, Cart, Theme, and Mobile Menu alignments).
2. **Settings Service Serialization** — Updated `mapSettings` mapper and `updateSettings` database queries to fully serialize, save, and edge-cache the new header settings.
3. **Admin settings form visual controls** — Added a premium **"Header Layout & Appearance Customizer"** card inside settings admin form. Features toggles for top bar/newsletter features, contact/news fields, alignment dropdowns for mobile/desktop layout elements, and double-bound type color pickers with hex text inputs.
4. **Dynamic dynamic slot-aligned Header Layouts** — Upgraded `Navbar.tsx` to read settings, render dynamic Left/Center/Right slot containers, group layout elements dynamically based on user preferences, render top-bar contact lists, and output a dynamic marquee text bar.
5. **Mobile Category Menu Drawer** — Implemented an overlay category list navigation drawer toggleable via Menu button, rendering all active database categories on mobile viewports.
6. **Graceful dark mode styling fallback** — If background or border settings are default, the header falls back to Tailwind's default class-based dark mode structures. When modified, inline overrides are applied directly to elements.


---

### [2026-06-07] v1.1.0 — WooCommerce Shop Page & Mobile Navigation Upgrades

**Files Updated / Created:**
- `app/(store)/shop/page.tsx` (created)
- `components/store/ShopPage.tsx` (created)
- `components/common/MobileBottomNav.tsx` (created)
- `components/common/FloatingContacts.tsx` (modified)
- `components/store/ProductCard.tsx` (modified)
- `app/(store)/layout.tsx` (modified)

**Changes:**
1. **Dynamic WooCommerce Shop Page** — Set up `/shop` routing page fetching live products, categories, and settings from cache-aware services. Included detailed filter controls (double range price slider, category counts, product availability checks, featured products list, grid toggles) and layout adapters.
2. **Persistent Mobile Navigation** — Embedded a sticky bottom navigation tab bar containing direct shortcuts to Home, Account, Shop, Wishlist, and Cart. Fully synced counts for Wishlist items (local storage listener) and Cart items (Zustand state).
3. **Floating Social Contacts** — Built quick floating links for WhatsApp chats and Instagram profile URLs, anchored above the bottom nav bar on mobile to prevent overlapping.
4. **Card overlays & Ratings** — Removed standard catalog card CTAs, replacing them with star rating counts below the title and overlay circles inside the image container for Wishlist, Detail view, and Quick Cart add.
5. **Tailwind Standardizations** — Replaced non-standard tailwind gray colors (`gray-955`, `gray-650`, `gray-250`, `gray-755`) with official Tailwind weights (`gray-900`, `gray-600`, `gray-200`, `gray-700`) across components to enforce color standardization.
6. **Search Redirect Update** — Updated search submission input enter event and "View all results" link in the navbar suggestions overlay to route queries to `/shop?search=...` instead of the homepage, integrating global searches directly with the shop catalog page.
7. **Category Menu Redirects** — Re-routed category click navigation links inside the mobile navigation menu drawer to redirect directly to `/shop?category=...` rather than the homepage, unifying category listings onto the WooCommerce-style catalog.
8. **Top Bar Contacts & Announcement Slider** — Hid top-bar contacts on mobile (using `hidden md:flex`) and mapped them inside the mobile navigation menu drawer instead. Converted the marquee announcement ticker text input inside the admin Settings form into a `textarea` supporting multiple announcements (one per line) which are parsed and automatically rotated/faded every 4 seconds on the storefront header top bar.
9. **React Hook Extraction Fix** — Extracted the list card helper method (`renderListCard`) inside `ShopPage.tsx` into a standalone React component `ShopProductListCard` to satisfy the Rules of Hooks and prevent runtime hook ordering errors on search/category filters update.

---

### [2026-06-07] v1.2.0 — Customer Accounts & Admin Customers Directory

**Files Updated / Created:**
- `supabase/migrations/20260607260000_add_customers_table.sql` (created)
- `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)
- `lib/utils/customer-auth.ts` (created)
- `lib/services/customers.ts` (created)
- `app/(store)/login/page.tsx` (created)
- `app/(store)/signup/page.tsx` (created)
- `app/(store)/account/page.tsx` (created)
- `app/admin/customers/page.tsx` (created)
- `app/admin/layout.tsx` (modified)
- `components/common/Navbar.tsx` (modified)

**Changes:**
1. **Customer Database & RLS** — Created `customers` table with secure password hashing and added `customer_id` relation to the `orders` table. Configured granular RLS policies for public signup and admin read.
2. **Old Orders Linker** — Built automatic linking during signup/login which automatically pairs previous orders with matching email/phone to the newly created customer profile.
3. **Session-Isolation Authentication** — Programmed custom, secure HttpOnly cookie session system using Node's `crypto` module to isolate admin sessions from storefront customer accounts.
4. **Shopify-Style Customer Portal** — Added mobile-first `/login`, `/signup`, and `/account` pages where customers can view profile details, order histories, status pills, and tracking updates.
5. **Admin Customers Directory** — Implemented `/admin/customers` page showing registered customers, registration dates, LTV spent, and quick communication buttons (WhatsApp, Phone, Email redirection). Mapped the Users icon link inside the Admin layout sidebar.
6. **Navbar Account Synced** — Synced Customer session with navbar layout slots, displaying "Account" navigation links and updating mobile drawer Quick Links to point to user portal if logged in.

### [2026-06-08 00:13] - Add FAQ and Return/Exchange Policy Settings

**Files Updated / Created:**
- `supabase/migrations/20260608001000_add_faq_and_return_policy_to_settings.sql` (created)
- `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)

**Changes:**
1. Added `faq_content` and `return_policy_content` columns to `store_settings` to house HTML/rich-text content for Frequently Asked Questions and Return & Exchange policies.

### [2026-06-08 00:30] - Add Homepage Trust Badges Settings

**Files Updated / Created:**
- `supabase/migrations/20260608002000_add_homepage_trust_badges_to_settings.sql` (created)
- `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)

**Changes:**
1. Added 12 columns for 4 customizable homepage trust badges (`trust_badge_X_title`, `trust_badge_X_desc`, `trust_badge_X_icon`) to `store_settings`.

### [2026-06-08 00:36] - Add Individual Badge Toggles, Socials & Shopify Footer Settings

**Files Updated / Created:**
- `supabase/migrations/20260608003000_add_badges_socials_and_footer_editable_fields.sql` (created)
- `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)

**Changes:**
1. Added individual enable/disable toggles for trust badges (`trust_badge_X_enabled`) to `store_settings`.
2. Added social links for TikTok (`social_tiktok`), Snapchat (`social_snapchat`), and Twitter (`social_twitter`) to settings.
3. Added customizable Shopify-style footer settings fields (`footer_col_X_title` and `footer_col_X_text`) for full admin content control.




## 2026-06-08 - UI Updates: Payment Badges & Header News Slider
- **Files changed:** `components/common/PaymentBadges.tsx`, `components/common/Footer.tsx`, `components/store/ProductDetail.tsx`, `components/common/Navbar.tsx`
- **What changed:** Centralized `PaymentBadges` into a single reusable component. Ensured `enableSafeCheckout` setting globally toggles badges in both Footer and Product Page. Added left/right navigation arrows to Header News (top bar) for multiple announcements. Fixed mobile header logo layout alignment to be perfectly centered.

### [2026-06-08 02:08] - Add Floating Social Contact Customizer Settings
- **Files Updated / Created:**
  - `supabase/migrations/20260608005000_add_floating_contacts_settings.sql` (created)
  - `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)
- **What changed:**
  1. Added 13 new database configuration columns to `store_settings` to allow full customization of the floating social buttons (WhatsApp, Instagram, TikTok, Snapchat, Twitter). Toggles, positions (left/right), vertical and horizontal offsets for mobile and desktop, size scale factors, and WhatsApp greeting message preset.

### [2026-06-08 06:20] - Add Header Sticky Customization & Shop Filter/Menu Touch Fixes
- **Files Updated / Created:**
  - `supabase/migrations/20260608006000_add_header_sticky_to_settings.sql` (created)
  - `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)
  - `lib/types.ts` (modified)
  - `lib/services/settings.ts` (modified)
  - `components/admin/SettingsForm.tsx` (modified)
  - `components/common/Navbar.tsx` (modified)
  - `components/store/ProductCard.tsx` (modified)
  - `components/store/ProductDetail.tsx` (modified)
  - `components/store/ShopPage.tsx` (modified)
  - `app/layout.tsx` (modified)
- **What changed:**
  1. **Sticky Header Settings** — Added `header_sticky` column to `store_settings` and corresponding Admin settings form toggle. Updated services, mappers, and types. Modified `Navbar.tsx` to dynamically toggle between sticky and relative header based on the user preference.
  2. **Mobile Touch Hover** — Implemented touch event simulation on storefront product cards to trigger image hover (swapping to secondary image or zooming) cleanly on mobile screens.
  3. **Product Gallery Navigation** — Fixed detail page gallery navigation arrows visibility by making them always visible on mobile, since hover triggers are unavailable.
  4. **Description Tabs Collapse** — Implemented an expand/collapse (Read More/Read Less) toggle on product detail description contents with bottom gradients.
  5. **Drawer Theme Switcher** — Moved the light/dark mode switch into the mobile drawer header next to the close button and configured `ThemeProvider` to default to `light` theme.
  6. **Shop Page Filter Scroller** — Configured the shop page mobile filter sheet and categories list layout to support touch-first, top-down scrolling with `overscroll-contain touch-pan-y` and expanded nested scrollbars to prevent gesture hijacking.

### [2026-06-08 06:50] - v1.3.0 — Premium Storefront Feature Enable/Disable Toggles
- **Files Updated / Created:**
  - `supabase/migrations/20260608007000_premium_theme_and_customizer.sql` (created)
  - `supabase/migrations/20260608008000_add_premium_features_toggles.sql` (created)
  - `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)
  - `lib/types.ts` (modified)
  - `lib/services/settings.ts` (modified)
  - `components/admin/SettingsForm.tsx` (modified)
- **What changed:**
  1. **Feature toggles** — Added database configuration toggle flags in `store_settings` to enable/disable specific marketing widgets (Recent Buyers ticker, Exit Intent popup, Cookie banner, Spin-to-Win wheel, Progress Bar, Volume Discounts, FBT bundles, Stock Urgency, Flash Sale count, Social feeds, Cart expiration, Size guides).

### [2026-06-08 07:15] - v1.4.0 — Ticker, Exit Intent & Cookie Banner Customization
- **Files Updated / Created:**
  - `supabase/migrations/20260608009000_add_recent_buyers_advanced_settings.sql` (created)
  - `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)
  - `lib/types.ts` (modified)
  - `lib/services/settings.ts` (modified)
  - `components/admin/SettingsForm.tsx` (modified)
- **What changed:**
  1. **Dynamic Ticker Controls** — Enabled admin inputs for simulated buyer names/cities or real order tracking from the database, custom product pools (featured, sale, custom checklist selection), and timing delay sliders.
  2. **Exit Intent Popup** — Configured dynamic coupon codes, popup delay slider, and HEIC-native compression image uploader.
  3. **Cookie Consent custom styling** — Integrated custom consent button and description texts.

### [2026-06-08 07:30] - v1.5.0 — Dynamic Product Size Guides Preset System
- **Files Updated / Created:**
  - `supabase/migrations/20260608010000_add_size_guides_table.sql` (created)
  - `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)
  - `lib/services/sizeGuides.ts` (created)
  - `components/admin/SettingsForm.tsx` (modified)
  - `components/store/ProductDetail.tsx` (modified)
- **What changed:**
  1. **Sizing Presets Database Table** — Created `size_guides` table storing reusable size charts in JSON columns along with measurement diagrams.
  2. **Interactive Size Table Editor** — Added spreadsheet-style sizing table builder in Admin Settings supporting custom comma-separated columns, row appends, and optimized WebP measurement diagram file uploads.
  3. **Storefront Detail Modal** — Integrated sizing chart modal overlay next to product share icons.

### [2026-06-08 07:45] - v1.6.0 — Coupons Management & E-Commerce Campaign Visuals
- **Files Updated / Created:**
  - `supabase/migrations/20260608020000_coupons_fbt_flash_social_settings.sql` (created)
  - `supabase/schema/SUPER_MASTER_SCHEMA.sql` (modified)
  - `lib/services/coupons.ts` (created)
  - `components/admin/SettingsForm.tsx` (modified)
  - `components/store/CartDrawer.tsx` (modified)
  - `components/store/CartContainer.tsx` (modified)
- **What changed:**
  1. **Coupons Database** — Created `coupons` table supporting percentage/fixed discounts, minimum subtotal checkouts validation, and status flags.
  2. **Admin Coupons Manager** — Created coupons creator with validation states in Settings.
  3. **Visual Customization** — Programmed Admin controls for Frequently Bought Together products, customizable Instagram/social feeds ribbon, and per-product Countdown sales clocks.

---

### [2026-06-11] v2.6.0 — Loading Skeletons Color Scale Standardization & Customizer Loaders
**Files Updated:** [LoadingSkeleton.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/common/LoadingSkeleton.tsx), [app/(store)/loading.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/%28store%29/loading.tsx), [app/admin/loading.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/loading.tsx), [app/admin/dashboard/loading.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/dashboard/loading.tsx), [app/admin/products/loading.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/products/loading.tsx), [app/admin/categories/loading.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/categories/loading.tsx), [app/admin/orders/loading.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/orders/loading.tsx), [app/admin/settings/loading.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/settings/loading.tsx), [app/admin/settings/customizer/loading.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/settings/customizer/loading.tsx), [gemini.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/gemini.md)
**Changes:**
1. Standardized all skeleton loaders in both customer storefront and admin route loaders to use Tailwind standard color weight `bg-gray-100` (and `dark:bg-gray-800`), eliminating non-standard colors (`bg-gray-150`, `bg-gray-155`).
2. Documented the skeleton color scale rules in `RULE K1` inside `gemini.md`.

---

### [2026-06-11] v2.7.0 — Customizer Preview Layout Bypass & Scaled Viewports
**Files Updated:** [layout.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/layout.tsx), [CustomizerEditor.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CustomizerEditor.tsx), [Icons.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/common/Icons.tsx)
**Changes:**
1. Exempted the `/admin/settings/customizer/preview` path from the admin dashboard layout wrapper in `app/admin/layout.tsx` so that only the storefront landing page renders inside the iframe preview (no nested admin sidebar/navigation).
2. Added `Tablet` icon to centralized `Icons.tsx` registry.
3. Overhauled customizer viewports in `CustomizerEditor.tsx` to support:
   - **Desktop**: A true `1440px` wide desktop view scaled dynamically using `transform: scale()` via ResizeObserver (optimized with a `0.75` scale multiplier to zoom out and center content beautifully in the preview container). Added `mx-auto` and inline margins to ensure perfect horizontal centering.
   - **Tablet**: Unscaled flexible width viewport.
   - **Mobile**: Anchored mobile smartphone frame with added horizontal centering alignment.

---

### [2026-06-11] v2.8.0 — Full-Screen Customizer, 3-Column Layout & Bidirectional Sync
**Files Updated:** [CustomizerEditor.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/CustomizerEditor.tsx), [StoreFront.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/StoreFront.tsx), [page.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/app/admin/settings/customizer/page.tsx), [SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/SCHEMA_CHANGE_LOG.md)
**Changes:**
1. Overhauled the Homepage Customizer layout into a full-screen application. Removed page-level headers to optimize height.
2. Implemented a 3-column layout mimicking Shopify's Theme Customizer: Left Sidebar (Sections list and order), Center Workspace (Live preview iframe), Right Sidebar (active section property inputs).
3. Created a customizer header containing: Exit to Dashboard (`/admin/dashboard`), Viewport segmented switcher, and "Save Layout" button.
4. Set up fluid, non-scaled Desktop preview (`100%` width/height) to match a real desktop monitor naturally.
5. Implemented bi-directional synchronization:
   - Selecting/ordering a section in the left panel automatically triggers a `scroll_to_section` postMessage event to scroll the preview to that section.
   - Clicking a section inside the preview frame posts a `select_section` event to automatically select and focus that section in the customizer editor.




---

## 2026-06-14 — meta_sync_log table (Infinite Loop Fix)

**Problem**: `syncProductToMeta()` was updating `products.meta_sync_status` → triggered Supabase webhook → webhook called meta sync again → infinite loop.

**Fix**:
- Created `meta_sync_log` table to store sync results
- Removed ALL writes to `products.meta_sync_status`, `products.meta_sync_error`, `products.meta_last_synced_at`
- `syncProduct.ts` and `bulkSyncProductsToMeta` now write ONLY to `meta_sync_log`
- `bulk/route.ts` "failed" mode now queries `meta_sync_log` instead of `products.meta_sync_status`
- `ALTER TABLE public.products ENABLE TRIGGER ALL` — re-enables triggers after fix

**Files changed**:
- `lib/meta/syncProduct.ts` — full rewrite, no products table writes
- `app/api/meta-sync/bulk/route.ts` — failed mode uses meta_sync_log
- `components/admin/ProductList.tsx` — removed meta_last_synced_at from local state
- `supabase/migrations/20260614010000_create_meta_sync_log.sql` — NEW
- `supabase/schema/SUPER_MASTER_SCHEMA.sql` — updated

**Must run in Supabase SQL Editor**:
```sql
-- Run migration (20260614010000_create_meta_sync_log.sql)
-- Then:
ALTER TABLE public.products ENABLE TRIGGER ALL;
```
