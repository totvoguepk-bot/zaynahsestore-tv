# 🎨 Zaynahs E-Store — Premium Theme Features & Customizer Blueprint

This document serves as the single source of truth for the store's premium theme features. It maps all existing and pending features, details their current file locations and database binds, and outlines the system architecture for a code-free **Landing Page Section Customizer** (Shopify/Elementor style).

---

## 🚀 SECTION 1: MASTER THEME FEATURES MATRIX
Below is the status of the premium features list from your request.

| Feature Category | Feature Name | Status | Technical Details (Files & DB Columns) |
| :--- | :--- | :---: | :--- |
| **1. Social Proof** | 🔴 Live Visitor Counter | **[x] Active** | `store_settings.enable_fake_views` • `components/store/ProductDetail.tsx` |
| | ⭐ Star Ratings & Review Counts | **[x] Active** | `products.rating` • `components/store/ProductCard.tsx` |
| | 🛡️ Verified Buyer Badges | **[x] Active** | `components/store/ReviewsList.tsx` • `StoreFront.tsx` |
| | ⚠️ Low Stock Alert badge | **[x] Active** | `store_settings.show_stock` • `ProductDetail.tsx:340` |
| | 📦 Recent Purchase Popup (bottom-left) | **[ ] Pending** | *Requires dynamic state or localStorage orders log.* |
| **2. Lead Capture** | 📢 Announcement Slider (Marquee Ticker) | **[x] Active** | `header_show_newsletter` • `header_newsletter_text` • `Navbar.tsx` |
| | 🎁 Exit-Intent / Newsletter Popup | **[ ] Pending** | *Requires cookie state & mouse pointer exit-intent trigger.* |
| | 🎡 Spin-to-Win Discount Wheel | **[ ] Pending** | *Requires SVG/Canvas wheel component and email validation check.* |
| **3. Urgency & Scarcity** | 🏷️ SALE Comparison Badges | **[x] Active** | `products.compare_price` • `ProductCard.tsx` |
| | ⏳ countdown Timers (Flash Sales) | **[ ] Pending** | *Requires JS countdown state & time deadline parser.* |
| **4. Promotions & Discounts** | 🎫 Promo Code Bar Banner | **[x] Active** | `store_settings.promo_code_text` • `ProductDetail.tsx:504` |
| | 🚚 Free Shipping Limit Banner | **[x] Active** | `store_settings.free_shipping_text` • `ProductDetail.tsx:491` |
| | 📈 Free Shipping Progress Bar | **[ ] Pending** | *Requires Zustand state listener: compares cart subtotal to target.* |
| **5. Popups & Modals** | 💬 Floating Contacts Widget (WhatsApp/IG) | **[x] Active** | `store_settings.floating_contacts_enabled` • `FloatingContacts.tsx` |
| | 🍪 Cookie Consent Bar | **[ ] Pending** | *Requires localStorage consent key check.* |
| **6. Cart & Checkout Boosters**| 🛒 Mobile Sticky Bottom Cart Bar | **[x] Active** | `components/store/CartBar.tsx` (Zustand state synced) |
| | 🔍 Quick View Overlay Modal | **[x] Active** | `components/store/QuickViewModal.tsx` |
| | ❤️ LocalStorage Wishlist Drawer | **[x] Active** | `components/store/WishlistContainer.tsx` |
| | ⚡ Sticky Add to Cart / Sidebar | **[x] Active** | `CartContainer.tsx` (uses CSS `lg:sticky lg:top-24`) |
| **7. Mobile Premium** | 📱 Touch Swipeable Image Gallery | **[x] Active** | `components/store/ProductDetail.tsx` (swipe/dot navigation) |
| | 🔍 Tap-to-Zoom lightbox Overlay | **[x] Active** | `ProductDetail.tsx` (arrow click and full lightbox mode) |
| | 👆 Touch-First Scrollable Overlays | **[x] Active** | `ShopPage.tsx` mobile drawer with unified top-down scrolling |
| **8. Badges & Trust Signals** | 🛡️ Homepage Trust Badges | **[x] Active** | `trust_badge_X_title/desc/icon/enabled` • `StoreFront.tsx` |
| | 💳 Safe Checkout payment Badges | **[x] Active** | `safe_checkout_methods` • `PaymentBadges.tsx` |
| | 🏷️ Custom Product Badges (Sale/New) | **[x] Active** | `products.custom_badge_id` • `badges` table relation |
| **9. Visual Marketing** | 🎨 Color Swatch Selector (Hex / Image) | **[x] Active** | `ProductCard.tsx` swatches • `VariantSelector.tsx` |
| **10. Analytics & Personalization**| 🔍 Live Search with suggestions | **[x] Active** | `components/common/Navbar.tsx` (Search overlay dropdown) |
| | 🎛️ Dual-Range Price Slider & Sorting | **[x] Active** | `components/store/ShopPage.tsx` filters |
| **11. Credibility** | 💬 Customer Review Submission form | **[x] Active** | `components/store/ReviewForm.tsx` (Inserts to database) |
| | ❓ FAQs & Returns Policy Accordions | **[x] Active** | `faq_content` • `return_policy_content` • `ProductDetail.tsx` |

---

## 🔗 SECTION 2: PRODUCT PAGE PROMO AUTO-SCROLLER (TICKER)
The product page has a custom built auto-scrolling ticker component that scrolls promotional lines continuously.

* **Database Setting:** `store_settings.ticker_text` (Text field, lines separated by newlines).
* **Enable Switch:** `store_settings.enable_ticker` (Boolean toggle).
* **Render File:** `app/(store)/product/[slug]/page.tsx` (around lines 54-95).
* **Technical Setup:** Uses CSS keyframes to create a hardware-accelerated continuous infinite scroll banner:
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee-infinite {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
}
```

---

## 🎨 SECTION 3: CODE-FREE LANDING PAGE CUSTOMIZER ARCHITECTURE
To allow the user to build, reorder, resize, and configure sections without touching the codebase, we design the following system.

### 1. Database Schema Extensions (`homepage_sections`)
We will create a schema supporting dynamic homepage layouts.
```sql
CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_type TEXT NOT NULL,          -- 'hero_banner', 'product_grid', 'category_list', 'promo_banner', 'trust_badges'
  title TEXT,
  settings JSONB NOT NULL DEFAULT '{}', -- config values (columns, styling, item limit)
  content_data JSONB DEFAULT '{}',     -- linked data: category_ids, selected_product_ids, etc.
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Available Customizer Section Types
* **`hero_banner`**
  * Settings: Image aspect ratio, desktop/mobile height, overlay opacity, text alignment, button link.
* **`product_grid`**
  * Settings: Grid columns (2, 3, 4), layout mode (grid vs slider), spacing scale, product limit.
  * Content: Source selection (`all`, `featured`, `sale`, or manual selected IDs).
* **`category_list`**
  * Settings: Circle vs square thumbnails, slider enabled, badge counts.
  * Content: Selected categories.
* **`promo_banner`**
  * Settings: Auto-scroll ticker speed, background color picker, text size.

### 3. Rendering Pipeline (`components/store/StoreFront.tsx`)
Instead of rendering static components, `StoreFront` loops through sections sorted by `sort_order`:
```tsx
export default function StoreFront({ sections, products, categories, settings }) {
  return (
    <div className="space-y-8">
      {sections.map(section => {
        switch (section.sectionType) {
          case 'hero_banner':
            return <HeroBannerSection key={section.id} config={section.settings} />;
          case 'product_grid':
            return <ProductGridSection key={section.id} config={section.settings} data={section.contentData} products={products} />;
          case 'category_list':
            return <CategoryListSection key={section.id} config={section.settings} categories={categories} />;
          // ... rest of dynamic layouts
        }
      })}
    </div>
  );
}
```

### 4. Admin Control Panel (`app/admin/settings/customizer/page.tsx`)
A drag-and-drop dashboard showing:
1. **Left Sidebar:** Add Section button, drag handles to reorder sections, edit configuration panels.
2. **Right Preview Panel:** Simulated viewport showing the layout exactly as it will appear on mobile, tablet, or desktop.
3. **Double-Sided Syncing:** Saves section changes to `homepage_sections` table which triggers edge CDN cache revalidation instantly (`revalidateTag('settings')`).
