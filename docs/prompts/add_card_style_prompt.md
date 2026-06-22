# Prompt Guide: How to Add a New Product Card Style

Use this prompt template when instructing an AI agent to add a new custom product card design layout to the Zaynahs E-Store.

---

```markdown
# Goal: Add a New Product Card Design Template

Implement a new product card style named `[STYLE_ID]` (e.g. `showcase_11`) based on the provided HTML mockup or layout description. Ensure it is fully integrated with the admin customizer settings panel and respects all store configurations.

## 📁 Files to Update & Implementation Workflow

Follow this step-by-step workflow to implement and wire up the new template:

### 1. Extend Settings Type Declarations
**File to Modify**: [lib/types.ts](file:///Users/shoaib/Desktop/Zaynahs%20e-store/lib/types.ts)
- Locate the `card_style` union type definition inside the `StoreSettings` interface.
- Add your new style identifier `'[STYLE_ID]'` (e.g., `'showcase_11'`) to the string union.
- **Example**:
  ```typescript
  card_style?: 'style1' | 'neumorphic' | ... | '[STYLE_ID]';
  ```

### 2. Register Option in Admin Customizer Panel
**File to Modify**: [ProductCardSettings.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/admin/customizer/pages/ProductCardSettings.tsx)
- Add a new object for `[STYLE_ID]` inside the `styles` array variable:
  ```typescript
  {
    id: '[STYLE_ID]',
    name: 'Showcase XX — [Friendly Name]',
    desc: '[Short description of layout behavior, hover effects, and unique visuals].'
  }
  ```
- This automatically registers the template option inside the customizer select dropdown list.

### 3. Add Scoped CSS Styles
**File to Modify**: [ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%20e-store/components/store/ProductCard.tsx)
- Locate the `customCss` string block inside the `ProductCard` component definition.
- Append the CSS declarations for the new card style, scoped strictly under the namespace class `.z-card-container .[STYLE_CLASS_NAME]` (e.g., `.z-card-container .sc11`).
- **Critical Styling Rules**:
  - **Dynamic Theme Vars**: Do not use hardcoded static color codes for elements. Map them to dynamic CSS vars (e.g., border color using `var(--color-border)`, accent highlights using `var(--color-accent)`).
  - **No backdrop-filter**: Do not use CPU-heavy filter blurs (e.g., `backdrop-blur-sm`). Use high-contrast solid backgrounds (e.g. `bg-black/60`).
  - **Transitions**: Define soft transitions (e.g., `transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`).
  - **Responsive Sizing in 2-Column Grid (MANDATORY)**: To prevent cards from stretching vertically and losing their original aspect ratio when the grid switches to 2 columns on mobile devices (< 640px), you must add specific CSS overrides scoped under `.grid-cols-2 .z-card-container .[STYLE_CLASS_NAME]`.
    - **Paddings**: Reduce wrap/body/image container paddings by ~50%.
    - **Fonts**: Reduce title/price/rating font sizes so text does not wrap excessively.
    - **Action Controls & Badges**: Shrink absolute overlays, buttons, and badges to match the ~160px card width.
    - **Example**:
      ```css
      @media (max-width: 640px) {
          /* Scale down showcase style sc11 in 2-column view */
          .grid-cols-2 .z-card-container .sc11 {
              padding: 6px !important;
          }
          .grid-cols-2 .z-card-container .sc11 .img-box {
              padding: 8px !important;
          }
          .grid-cols-2 .z-card-container .sc11 .card-title {
              font-size: 0.72rem !important;
              line-height: 1.25 !important;
          }
          .grid-cols-2 .z-card-container .sc11 .card-price {
              font-size: 0.82rem !important;
          }
          .grid-cols-2 .z-card-container .sc11 .action-btn {
              width: 26px !important;
              height: 26px !important;
          }
      }
      ```

### 4. Implement JSX Render Logic
**File to Modify**: [ProductCard.tsx](file:///Users/shoaib/Desktop/Zaynahs%2520e-store/components/store/ProductCard.tsx)
- Create a new return block matching the style check: `if (activeStyle === '[STYLE_ID]') { ... }` before the final default fallback return.
- **Wired-Up Elements & Helpers**:
  - **Link Tag Wrapper**: The root card container must be wrapped in a Next.js `<Link>` containing the restoration scroll anchor:
    ```tsx
    <Link
      id={`product-card-${product.id}`}
      href={`/product/${product.slug}`}
      onClick={() => saveScrollPosition(product.id)}
      className="[STYLE_CLASS_NAME] group relative flex flex-col h-full"
    >
    ```
  - **Dynamic Aspect Ratio & Image Hover Style**: Wrap images inside a container bound to `${aspectClass}` and invoke the `renderCardImages` helper with the appropriate fit class:
    ```tsx
    <div className={`img-box relative ${aspectClass} w-full`}>
      {renderCardImages('object-contain')}
    </div>
    ```
  - **Stacked Badges Wrapper (MANDATORY)**: Always render product badges by calling the unified `renderCardBadge()` helper inside a wrapper, allowing multiple badges (Sale, Featured, Custom, Limited) to stack vertically:
    ```tsx
    {renderCardBadge()}
    ```
  - **Action Controls (Wishlist/Quickview/Cart)**: Map buttons directly or use `renderActionButtons()` with click event preventers (`e.preventDefault()`, `e.stopPropagation()`) and add-to-cart triggers:
    ```tsx
    <div className="card-actions" onClick={(e) => e.preventDefault()}>
      {showWishlist && <button onClick={handleToggleWishlist} ... />}
      {showQuickview && <button onClick={() => setQuickViewOpen(true)} ... />}
      {showQuickcart && <button onClick={handleAddToCart} ... />}
    </div>
    ```
  - **Vertical Elements Order & Content Alignment**: Render all card content blocks dynamically using the unified helper `renderShowcaseContent('[STYLE_SHORT_CLASS]')` (e.g. `'sc11'`), which automatically parses the `elementsOrder` settings list and links the `alignClass` text alignment rules:
    ```tsx
    {renderShowcaseContent('sc11')}
    ```
  - **Quick View Modal Context**: Include the React `<QuickViewModal>` conditional portal trigger at the bottom of the JSX block:
    ```tsx
    {quickViewOpen && settings && (
      <QuickViewModal
        product={product}
        settings={settings}
        onClose={() => setQuickViewOpen(false)}
      />
    )}
    ```

### 5. Document Database & Code Version
**File to Modify**: [SCHEMA_CHANGE_LOG.md](file:///Users/shoaib/Desktop/Zaynahs%20e-store/docs/SCHEMA_CHANGE_LOG.md)
- Log the addition under the latest incremental version code, summarizing the files touched and the theme details.

---

## 🛠️ Verification & Compile Checks

After implementing, run a TypeScript compiler check inside the workspace terminal to verify everything passes type safety checks successfully:
```bash
npx tsc --noEmit
```
```
