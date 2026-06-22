# 🏪 Product Card Customizer — Core Bases & Layout Styles Documentation

This document defines the 10 functional and visual "Bases" of the Zaynah's E-Store product card system and details the design variations of the 11 modern layout presets.

---

## 🔗 The 10 Core Bases

Every product card design must fully link to and implement the following functional and visual requirements:

### 1. Touch & Focus Target (Restoration Binding)
- **Wrapper**: Every product card must wrap its main content in a Next.js client `<Link>` with `href={"/product/" + product.slug}`.
- **Scroll & Focus ID**: Must assign `id={"product-card-" + product.id}` to the parent container.
- **Action**: Must call `onClick={() => saveScrollPosition(product.id)}` to preserve the user's current scroll position upon navigating away.

### 2. Badge Overlay Layer (`renderCardBadge`)
- **Sale Badge**: Displays `-X%` (calculated from `comparePrice` vs `price`) using a high-contrast style.
- **Featured Badge**: Displays `Featured` label.
- **Custom Tag Badge**: Displays dynamic custom badge name with customized colors (e.g. background, text color) from the database settings.
- **Limited Stock Badge**: Displays `Limited` badge when stock is low (e.g. between 1 and 8).

### 3. Action Buttons Overlay (`renderActionButtons`)
- **Wishlist Toggle**: Heart button that writes to localStorage and triggers the custom `wishlist-updated` event. Employs `animateFlyTo` on click.
- **Quick View Modal**: Eye button that changes local component state `quickViewOpen = true` to mount the detail drawer.
- **Quick Add to Cart**: Shopping bag button. Triggers a direct addition to cart (if single variation product) or triggers variant selection popup.

### 4. Dynamic Visual Asset (Image)
- **Aspect Ratio**: Constrained by `imageAspectRatio` styling (`1:1`, `3:4`, `4:3`, `16:9`, `auto`).
- **Alternate Hover Style**: Swaps to `secondImage` or zooms/scales image on cursor hover when customizer hover rules are enabled.
- **Fallback Handler**: Binds `fallbackPlaceholder` on image load error.
- **Variant Swap**: Swatch hovering/clicking dynamically switches active image to variant-specific images.

### 5. Elements Layout Order
- Renders product name (title), review counts (rating), pricing (price), and variant swatches (swatches) according to the order array defined in `elementsOrder` (e.g. `['title', 'rating', 'price', 'swatches']`).

### 6. Card Alignment
- Formats container alignment using flex alignments (`left` | `center` | `right`) defined in `card_alignment`.

### 7. Swatches Selection Panel
- Lists color swatches, sizes, materials, or other custom options. Handles select state changes and locks index display to `swatchLimit`.

### 8. Text Line Limits
- Imposes constraints on title lines (`titleLineLimit`) and decides description preview toggling based on `card_show_description`.

### 9. Fly-to-Cart Animation Target
- Links shopping bag triggers to the correct fly-to-cart selectors (`header-cart-icon-mobile` or `header-cart-icon-desktop`).

### 10. Lazy Quick View Modal Mounting
- Instantiates the `<QuickViewModal>` only when `quickViewOpen` is true to optimize page loading performance.

---

## 🎨 Layout Styles & Variant Presets Mappings

All custom styles inherit color schemes from three distinct variant models:
*   **V1 (Light Preset)**: Pastel, clean cream/white backgrounds with subtle text shadows and colored borders.
*   **V2 (Dark/Colored Preset)**: Highly immersive, dark slate, deep blue, orange, or black backgrounds with bright neon color highlights.
*   **V3 (Theme Adaptive)**: Reads client theme state (`isDark` from `next-themes`). Resolves to the V1 (Light) style if theme is light, and resolves to the V2 (Dark) style if theme is dark.

### Mapped Class Associations

| Layout Style Name | V1 (Light Preset) CSS Class | V2 (Dark/Colored) CSS Class | Key Aesthetic Detail |
| :--- | :--- | :--- | :--- |
| **01. Neumorphic** | `z-nm l` | `z-nm d` | Convex elements, concave internal images, soft shadows |
| **02. Color Block** | `z-cb p` | `z-cb o` | Diagonal background highlight panel, bright buttons |
| **03. Glassmorphism** | `z-gl-out a` / `la` | `z-gl-out b` / `da` | 25px frosted blur, colorful flowing border gradient |
| **04. Claymorphism** | `z-cl blu` | `z-cl pnk` | Smooth inset white border, soft colored background blobs |
| **05. Micro-Interaction** | `z-mi lt` | `z-mi dk` | Intricate specifications tab, thumbnail gallery |
| **06. Dark Elegance** | `z-de wt` | `z-de bk` | Luxury brand logo header bar, minimalist info details |
| **07. Luxury** | `z-lx gd` | `z-lx sl` | Gold/silver sepia image filters, floating particle animations |
| **08. Typographic** | `z-tp cr` | `z-tp bw` | Georgia serif headers overlapping product illustration |
| **09. Geometric** | `z-ge lc` | `z-ge dc` | Heavy 3px borders, Mondrian yellow/red/blue grids |
| **10. Material Design M3** | `z-mt gr` | `z-mt nr` | Pill buttons, 28px extra-round card, mini-FAB badge |
| **11. Organic** | `z-og lt` | `z-og dk` | Brush cursive scripts, wavy organic pastel accent cards |
