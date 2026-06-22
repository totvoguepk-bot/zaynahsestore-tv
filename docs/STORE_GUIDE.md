# 🏪 Zaynahs E-Store — COMPLETE BUILD GUIDE
> Cursor Agent yeh file padh ke poora store khud banaye. Koi manual step nahi.

## 🔑 GITHUB & CREDENTIALS

GitHub Repo: https://github.com/totvoguepk-bot/zaynahsestore-tv
GitHub Token: [YOUR_GITHUB_TOKEN]
Clone Command: git clone https://[YOUR_GITHUB_TOKEN]@github.com/totvoguepk-bot/zaynahsestore-tv.git

Supabase Dashboard: https://supabase.com/dashboard/project/ziucrfpebpxijqhwmqre
DB Password: SgctHbxOSeqSkCYg

---

## 📋 MASTER TODO (Agent tracks progress here)

- [ ] STEP 1 — Project Setup & Dependencies
- [ ] STEP 2 — Supabase Schema Push
- [ ] STEP 3 — Storage Bucket Setup
- [ ] STEP 4 — Environment & Types
- [ ] STEP 5 — Supabase Clients & Services
- [ ] STEP 6 — Cart Store (Zustand)
- [ ] STEP 7 — Store UI (Customer Side)
- [ ] STEP 8 — Admin Panel
- [ ] STEP 9 — Middleware & Auth
- [ ] STEP 10 — Final Polish & Build Check

---

## 🔑 CREDENTIALS (Already Set)

```
Supabase URL:        https://ziucrfpebpxijqhwmqre.supabase.co
Anon Key:            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdWNyZnBlYnB4aWpxaHdtcXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDUxMzcsImV4cCI6MjA5NzE4MTEzN30.QNLEQGfznwAU8mgLCW9Qiau_8teNTj5K7vdDP62wk38
Service Role Key:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdWNyZnBlYnB4aWpxaHdtcXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTYwNTEzNywiZXhwIjoyMDk3MTgxMTM3fQ.EHmWd70KE_D8UhCQpgVYC1w0_wV8nyrjqdoQUUsLgWU
DB Password:         SgctHbxOSeqSkCYg
DATABASE_URL:        postgresql://postgres.ziucrfpebpxijqhwmqre:SgctHbxOSeqSkCYg@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL:          postgresql://postgres.ziucrfpebpxijqhwmqre:SgctHbxOSeqSkCYg@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

---

## STEP 1 — Project Setup

### 1.1 Create Next.js Project
```bash
npx create-next-app@latest zaynahs-estore \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd zaynahs-estore
```

### 1.2 Install All Dependencies
```bash
npm install \
  @supabase/supabase-js \
  @supabase/ssr \
  zustand \
  sonner \
  embla-carousel-react \
  embla-carousel-autoplay \
  @radix-ui/react-dialog \
  @radix-ui/react-select \
  @radix-ui/react-tabs \
  @radix-ui/react-switch \
  @radix-ui/react-label \
  @radix-ui/react-slot \
  class-variance-authority \
  clsx \
  tailwind-merge \
  lucide-react \
  react-dropzone \
  date-fns \
  next-themes
```

---

## STEP 2 — Database Schema

### 2.1 Create `supabase/schema/SUPER_MASTER_SCHEMA.sql`

```sql
-- ============================================================
-- ZAYNAHS E-STORE — SUPER MASTER SCHEMA
-- Version: 1.0.0
-- Updated: 2026-06-07
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories (LOWER(slug));

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  compare_price NUMERIC(10,2),          -- original price (for sale display)
  cost NUMERIC(10,2) DEFAULT 0,         -- purchase cost (admin only)
  sku TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0,              -- total stock (sum of variants or direct)
  has_variants BOOLEAN DEFAULT false,   -- true if variants exist
  is_featured BOOLEAN DEFAULT false,
  is_service BOOLEAN DEFAULT false,     -- no stock tracking
  active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products (LOWER(slug));
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products (active);

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images (product_id);

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  -- Variant attributes (any combination)
  color TEXT,
  size TEXT,
  material TEXT,
  custom_option TEXT,              -- custom label like "flavor", "style" etc
  custom_value TEXT,               -- value for custom option
  -- Variant specific data
  price NUMERIC(10,2),             -- override product price if set
  compare_price NUMERIC(10,2),
  stock INTEGER DEFAULT 0,
  sku TEXT,
  image_url TEXT,                  -- variant specific image
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants (product_id);

-- ============================================================
-- PRODUCT MODIFIERS (Add-ons)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,              -- e.g. "Gift Wrap", "Custom Print"
  price NUMERIC(10,2) DEFAULT 0,   -- additional charge
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_modifiers_product ON product_modifiers (product_id);

-- ============================================================
-- STORE SETTINGS (Singleton)
-- ============================================================
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-4000-8000-000000000001',
  store_name TEXT DEFAULT 'Zaynahs E-Store',
  whatsapp_number TEXT DEFAULT '',         -- format: 923001234567 (no + or spaces)
  currency TEXT DEFAULT 'PKR',
  currency_symbol TEXT DEFAULT 'Rs.',
  logo_url TEXT,
  banner_url TEXT,
  tagline TEXT,
  address TEXT,
  -- Feature toggles
  show_stock BOOLEAN DEFAULT false,         -- show "X left in stock" to customers
  show_compare_price BOOLEAN DEFAULT true,  -- show strikethrough original price
  enable_search BOOLEAN DEFAULT true,
  enable_category_filter BOOLEAN DEFAULT true,
  -- WhatsApp message customization
  whatsapp_greeting TEXT DEFAULT 'Hello! I would like to order:',
  whatsapp_footer TEXT DEFAULT 'Please confirm my order. Thank you!',
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO store_settings (id) VALUES ('00000000-0000-4000-8000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ORDERS (WhatsApp order tracking — optional)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,        -- e.g. ZE-001
  customer_name TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]',        -- snapshot of cart at order time
  subtotal NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',            -- pending, confirmed, shipped, delivered, cancelled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto increment order number
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ZE-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_variants_updated_at ON product_variants;
CREATE TRIGGER update_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_settings_updated_at ON store_settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ (customers can read active products)
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (active = true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (active = true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read product_variants" ON product_variants FOR SELECT USING (active = true);
CREATE POLICY "Public read product_modifiers" ON product_modifiers FOR SELECT USING (active = true);
CREATE POLICY "Public read store_settings" ON store_settings FOR SELECT USING (true);

-- ADMIN FULL ACCESS (authenticated users = admin)
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all product_images" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all product_variants" ON product_variants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all product_modifiers" ON product_modifiers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all store_settings" ON store_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all orders" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin upload product images" ON storage.objects;
CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update product images" ON storage.objects;
CREATE POLICY "Admin update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete product images" ON storage.objects;
CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ============================================================
-- SCHEMA VERSION
-- ============================================================
CREATE TABLE IF NOT EXISTS schema_version (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO schema_version (version) VALUES ('1.0.0') ON CONFLICT DO NOTHING;
```

### 2.2 Push Schema to Supabase
```bash
# Direct push via psql
psql "postgresql://postgres.ziucrfpebpxijqhwmqre:SgctHbxOSeqSkCYg@aws-1-ap-south-1.pooler.supabase.com:5432/postgres" \
  -f supabase/schema/SUPER_MASTER_SCHEMA.sql
```

---

## STEP 3 — Environment Files

### 3.1 Create `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://ziucrfpebpxijqhwmqre.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdWNyZnBlYnB4aWpxaHdtcXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDUxMzcsImV4cCI6MjA5NzE4MTEzN30.QNLEQGfznwAU8mgLCW9Qiau_8teNTj5K7vdDP62wk38
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdWNyZnBlYnB4aWpxaHdtcXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTYwNTEzNywiZXhwIjoyMDk3MTgxMTM3fQ.EHmWd70KE_D8UhCQpgVYC1w0_wV8nyrjqdoQUUsLgWU
DATABASE_URL=postgresql://postgres.ziucrfpebpxijqhwmqre:SgctHbxOSeqSkCYg@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ziucrfpebpxijqhwmqre:SgctHbxOSeqSkCYg@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## STEP 4 — TypeScript Types

### 4.1 Create `lib/types.ts`
```typescript
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  color?: string;
  size?: string;
  material?: string;
  customOption?: string;
  customValue?: string;
  price?: number;
  comparePrice?: number;
  stock: number;
  sku?: string;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
}

export interface ProductModifier {
  id: string;
  productId: string;
  name: string;
  price: number;
  active: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  sku?: string;
  categoryId?: string;
  category?: Category;
  stock: number;
  hasVariants: boolean;
  isService: boolean;
  isFeatured: boolean;
  active: boolean;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  modifiers: ProductModifier[];
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  whatsappNumber: string;
  currency: string;
  currencySymbol: string;
  logoUrl?: string;
  bannerUrl?: string;
  tagline?: string;
  address?: string;
  showStock: boolean;
  showComparePrice: boolean;
  enableSearch: boolean;
  enableCategoryFilter: boolean;
  whatsappGreeting: string;
  whatsappFooter: string;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;                          // unique cart item id
  product: Product;
  selectedVariant?: ProductVariant;
  selectedModifiers: ProductModifier[];
  quantity: number;
  unitPrice: number;                   // final price (variant price or product price)
  total: number;                       // unitPrice * quantity + modifiers
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName?: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## DESIGN SYSTEM

We use a complete, centralized Design Token & Font System to manage colors, typography, buttons, badges, and spacing variables consistently.

### Fonts
- **Headings & Interactive UI (Buttons, Badges, etc.)**: `Plus Jakarta Sans` (CSS variable: `font-heading`)
- **Body & Description Text**: `Outfit` (CSS variable: `font-body`)

### Color Tokens

| Token | Light Value | Dark Value | Purpose |
| :--- | :--- | :--- | :--- |
| `primary` | `#16a34a` (Green) | `#22c55e` (Bright Green) | Main brand brandings, checkout, success links |
| `secondary` | `#1a1a2e` (Navy) | `#0f172a` (Dark Slate) | Headers, layout backgrounds, secondary cards |
| `accent` | `#e94560` (Red) | `#fb7185` (Rose Red) | Discount badges, sales, attention indicators |
| `surface` | `#ffffff` | `#0f0f0f` | Main background elements |
| `surface-2` | `#f8f8f8` | `#1a1a1a` | Secondary background wrappers |
| `surface-3` | `#f1f1f1` | `#262626` | Tertiary dividers/borders |
| `text` | `#1a1a1a` | `#f5f5f5` | Text contrast colors |
| `border` | `#e5e7eb` | `#27272a` | Layout border strokes |
| `whatsapp` | `#25D366` | `#25D366` | WhatsApp brand color |

### Button Components (`components/common/Button.tsx`)
Interactive elements support 7 color themes and 5 responsive sizes:
- **Variants**: `primary`, `secondary`, `outline`, `accent`, `ghost`, `danger`, `whatsapp`
- **Sizes**: `sm`, `md`, `lg`, `xl`, `full`
- *Note: Touch targets have a strict minimum size height of `44px` enforced.*

### Badge Components (`components/common/Badge.tsx`)
Labels automatically convert to custom stylized badges:
- **Variants**: `sale`, `new`, `hot`, `bestseller`, `limited`, `outofstock`, `featured`

### How to Change Primary Theme Color
To update the store's primary accent color:
1. **Option A (CSS)**: Change `--primary` and `--primary-hover` variables in `app/globals.css`.
2. **Option B (Tailwind)**: Edit `colors.primary` configuration in `tailwind.config.ts`.

---

## STEP 5 — Supabase Clients

### 5.1 `lib/supabase/client.ts` (Browser)
```typescript
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

### 5.2 `lib/supabase/server.ts` (Server Components)
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
};
```

### 5.3 `lib/supabase/admin.ts` (Service Role — Server Only)
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
```

---

## STEP 6 — Cart Store (Zustand)

### 6.1 `store/cartStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant, ProductModifier } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant, modifiers?: ProductModifier[], qty?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const calculateItemPrice = (
  product: Product,
  variant?: ProductVariant,
  modifiers?: ProductModifier[]
): number => {
  let price = variant?.price ?? product.price;
  const modifierTotal = modifiers?.reduce((sum, m) => sum + m.price, 0) ?? 0;
  return price + modifierTotal;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, modifiers = [], qty = 1) => {
        const unitPrice = calculateItemPrice(product, variant, modifiers);
        const cartItemId = `${product.id}-${variant?.id ?? 'base'}-${modifiers.map(m => m.id).join('-')}`;

        set(state => {
          const existing = state.items.find(i => i.id === cartItemId);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === cartItemId
                  ? { ...i, quantity: i.quantity + qty, total: unitPrice * (i.quantity + qty) }
                  : i
              )
            };
          }
          return {
            items: [...state.items, {
              id: cartItemId,
              product,
              selectedVariant: variant,
              selectedModifiers: modifiers,
              quantity: qty,
              unitPrice,
              total: unitPrice * qty
            }]
          };
        });
      },

      removeItem: (cartItemId) =>
        set(state => ({ items: state.items.filter(i => i.id !== cartItemId) })),

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set(state => ({
          items: state.items.map(i =>
            i.id === cartItemId
              ? { ...i, quantity, total: i.unitPrice * quantity }
              : i
          )
        }));
      },

      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.total, 0),
    }),
    { name: 'zaynahs-cart' }
  )
);
```

---

## STEP 7 — WhatsApp Utility

### 7.1 `lib/utils/whatsapp.ts`
```typescript
import { CartItem, StoreSettings } from '@/lib/types';

export const formatPrice = (amount: number, symbol = 'Rs.'): string =>
  `${symbol} ${amount.toLocaleString('en-PK')}`;

export const generateWhatsAppMessage = (
  items: CartItem[],
  settings: StoreSettings
): string => {
  const lines = items.map(item => {
    const variantParts = [];
    if (item.selectedVariant?.color) variantParts.push(item.selectedVariant.color);
    if (item.selectedVariant?.size) variantParts.push(item.selectedVariant.size);
    if (item.selectedVariant?.material) variantParts.push(item.selectedVariant.material);
    if (item.selectedVariant?.customValue) variantParts.push(item.selectedVariant.customValue);

    const variantStr = variantParts.length ? ` (${variantParts.join(', ')})` : '';
    const modifierStr = item.selectedModifiers.length
      ? ` + ${item.selectedModifiers.map(m => m.name).join(', ')}`
      : '';

    return `• ${item.product.name}${variantStr}${modifierStr} x${item.quantity} = ${formatPrice(item.total, settings.currencySymbol)}`;
  });

  const total = items.reduce((sum, i) => sum + i.total, 0);

  return [
    `*${settings.storeName}*`,
    ``,
    settings.whatsappGreeting,
    ``,
    ...lines,
    ``,
    `*Total: ${formatPrice(total, settings.currencySymbol)}*`,
    ``,
    settings.whatsappFooter
  ].join('\n');
};

export const buildWhatsAppURL = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
```

---

## STEP 8 — Key Pages to Build

### Store Pages (Customer)
1. **`app/(store)/page.tsx`** — Homepage
   - Hero banner (from store_settings.banner_url)
   - Category filter chips (horizontal scroll mobile)
   - Search bar
   - Product grid (2 cols mobile, 3 cols tablet, 4 cols desktop)
   - Sticky bottom cart bar

2. **`app/(store)/product/[slug]/page.tsx`** — Product Detail
   - Image gallery (swipeable on mobile — embla-carousel)
   - Name, price, compare price (strikethrough)
   - Variant selector (Color, Size chips)
   - Modifier checkboxes
   - Quantity selector
   - "Add to Cart" button
   - Description

3. **`app/(store)/cart/page.tsx`** — Cart Review
   - List of cart items with images
   - Quantity +/- controls
   - Remove item
   - Order total
   - **"Order via WhatsApp" button** (opens wa.me link)

### Admin Pages
4. **`app/admin/login/page.tsx`** — Login form
5. **`app/admin/dashboard/page.tsx`** — Stats overview
6. **`app/admin/products/page.tsx`** — Products table with search/filter
7. **`app/admin/products/new/page.tsx`** — Add product form
8. **`app/admin/products/[id]/page.tsx`** — Edit product form
9. **`app/admin/categories/page.tsx`** — Manage categories
10. **`app/admin/orders/page.tsx`** — View WhatsApp orders
11. **`app/admin/settings/page.tsx`** — Store settings

---

## STEP 9 — Admin Auth Middleware

### `middleware.ts`
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Protect all admin routes except login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect logged-in admin away from login page
  if (pathname === '/admin/login' && user) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*']
};
```

---

## STEP 10 — Product Form (Admin) Key Logic

### Image Upload Flow
```typescript
// In ProductForm.tsx admin component
const handleImageUpload = async (files: File[]) => {
  const uploads = await Promise.all(
    files.map(file => uploadProductImage(file, productId))
  );
  // Save URLs to product_images table
  await Promise.all(
    uploads.map((url, i) => supabase.from('product_images').insert({
      product_id: productId,
      url,
      sort_order: existingImages.length + i,
      is_primary: existingImages.length === 0 && i === 0
    }))
  );
};
```

### Variant Builder Logic
```typescript
// Variants saved to product_variants table
// Each row = one combination (e.g. Red + M, Blue + L)
// stock per variant tracked individually
// products.stock = SUM of all variant stocks (auto-calculated)
```

---

## STEP 11 — Mobile UI Components Checklist

### `components/store/CartBar.tsx` (Sticky Bottom)
```
Fixed bottom bar — shows when cart has items
[🛒 3 items] ————————————— [Rs. 2,400 →]
Tapping opens CartSheet or goes to /cart
```

### `components/store/VariantSelector.tsx`
```
Color: [Red] [Blue] [Black]   ← chip selection
Size:  [S]  [M]  [L]  [XL]   ← chip selection
Selected variant shows price + stock
```

### `components/store/ProductCard.tsx`
```
[Image — 1:1 ratio]
Name
Rs. 1,200  ~~Rs. 1,500~~
[Add to Cart]
```

---

## 🗂️ SCHEMA CHANGE LOG

### [2026-06-07] v1.0.0 — Initial Schema
**Tables Created:** `categories`, `products`, `product_images`, `product_variants`, `product_modifiers`, `store_settings`, `orders`
**Storage:** `product-images` bucket with public read + admin write policies
**RLS:** Public read for active products, admin full access for authenticated users
**Triggers:** `updated_at` auto-update on all tables, `order_number` auto-generate sequence

---

## ⚡ NEXT.JS CACHING OPTIONS

### Caching Strategy Selection
For Zaynahs E-Store, use **Next.js built-in cache + revalidateTag** (ISR) as the primary caching strategy.

- **Kyun (Rationale):**
  - Zero extra cost or third-party infrastructure.
  - Vercel automated global CDN edge caching.
  - On-demand revalidation: When products/categories are updated in the admin panel, trigger `revalidateTag` or `revalidatePath` to instantly refresh the storefront.

### Implementation Standard
```typescript
// Fetching data with revalidation tags (Server Component or service)
const getProducts = await fetch('...', { 
  next: { tags: ['products'], revalidate: 3600 } // Cache for 1 hour with tag
})

// On-demand revalidation on update (in admin actions/api)
import { revalidateTag } from 'next/cache';

export async function updateProductAction(id: string, data: any) {
  // 1. Update database
  // 2. Revalidate storefront cache tag
  revalidateTag('products');
}
```

---

## ✅ FINAL CHECKLIST

- [ ] `npm run dev` — store loads at localhost:3000
- [ ] Admin login works at /admin/login
- [ ] Product can be added with images from admin
- [ ] Images appear in Supabase Storage dashboard
- [ ] Customer can browse catalog, select variants, add to cart
- [ ] WhatsApp button generates correct message and opens wa.me
- [ ] Cart persists on page refresh (localStorage)
- [ ] Admin protected — redirect to login if not authenticated
- [ ] Mobile responsive — test at 375px width

---

## 🖼️ IMAGE COMPRESSOR — CURRENT IMPLEMENTATION

### `lib/utils/imageCompressor.ts`

All uploads (product images, logo, favicon, banner) pass through `compressImage()` before being sent to Supabase Storage.

**3-Strategy Fallback Chain:**
```
Strategy 1: createImageBitmap(file)
  → Fastest. Uses OS HEIC decoder on macOS/iOS (Chrome 94+, Safari 15+)
  → Works for JPEG, PNG, WebP, GIF natively

Strategy 2: ObjectURL → <img> → createImageBitmap
  → Uses OS-level image decoder via img.src
  → Handles HEIC on macOS Chrome where Strategy 1 fails
  → Generic fallback for standard formats on older browsers

Strategy 3: heic2any → createImageBitmap (HEIC files only)
  → Pure WASM fallback for HEIC on Windows/Linux Chrome
  → heic2any converts HEIC → JPEG, then bitmap is used

If ALL fail → throws user-visible Error (shown as toast)
  → Never silently uploads a broken/unrenderable file
```

**WebP Compression Loop:**
- Max initial dimension: **1200px** (proportional scale-down)
- Quality steps: `0.88 → 0.75 → 0.62 → 0.50 → 0.38 → 0.26 → 0.15`
- Every 4 passes: resolution shrinks by 75%
- Target: **≤ 50 KB**
- Output: `.webp` file with same base filename

**Usage:**
```typescript
import { compressImage } from '@/lib/utils/imageCompressor';

const compressed = await compressImage(file, 50); // maxKb = 50
// compressed is a .webp File ready for Supabase upload
```

---

## 🌐 NEXT.CONFIG — IMAGE DOMAINS

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ziucrfpebpxijqhwmqre.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
};
```

> ⚠️ Always use `<img>` (not `next/image`) in the admin panel for uploaded image previews to avoid domain restriction errors.

---

## 🌙 DARK MODE RULES (Current Implementation)

- **Library**: `next-themes` with `attribute="class"`
- **HTML class**: `.dark` on `<html>` element
- **Tailwind v4**: `@variant dark (&:where(.dark, .dark *))` in `globals.css`
- **Toggle**: `<ThemeToggle />` component (in both Navbar and admin header)

**Critical pattern for any new page/component:**
```tsx
// Page wrapper MUST have both light and dark backgrounds
<div className="bg-gray-50 dark:bg-[#0f0f1b] text-gray-900 dark:text-gray-100">

// Cards
<div className="bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800">

// Headings
<h1 className="text-gray-900 dark:text-white">

// Muted text
<p className="text-gray-500 dark:text-gray-400">

// Inputs
<input className="bg-gray-50/50 dark:bg-[#0f0f1b]/50 text-gray-900 dark:text-white border-gray-200 dark:border-gray-800">
```

**Color palette:**
| Token | Light | Dark |
|---|---|---|
| Page BG | `bg-gray-50` | `dark:bg-[#0f0f1b]` |
| Card BG | `bg-white` | `dark:bg-[#16162a]` |
| Border | `border-gray-200` | `dark:border-gray-800` |
| Text primary | `text-gray-900` | `dark:text-white` |
| Text muted | `text-gray-500` | `dark:text-gray-400` |
| Accent | `#e94560` | same |
| Navy | `#1a1a2e` | same |

