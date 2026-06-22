# Meta Catalog Real-time Sync - Complete Guide
# Facebook Shop + Instagram Shop + WhatsApp Catalog
# Auto Sync: Products, Variations, Prices, Images, Stock

---

# OVERVIEW

```
Tera Store → Meta Graph API → Meta Catalog
                                    ↓
                        Facebook Shop + Instagram Shop
                        + WhatsApp Business Catalog

Product save/update/delete →
Auto API call → Catalog updated instantly
```

---

# PART 1 — META SETUP (Tera Manual Kaam)

## Step 1: Business Manager
```
business.facebook.com
→ Business Settings → Create Business Account
(agar already hai to skip)
```

## Step 2: Commerce Manager - Catalog Banao
```
business.facebook.com/commerce
→ Create Catalog
→ Type: E-commerce
→ Name: "Zaynahs Store Catalog"
→ Connect to Business Account
→ CATALOG ID copy karo (yeh number hota hai)
```

## Step 3: System User + Access Token (Permanent)
```
Business Settings → Users → System Users
→ Add → Name: "Zaynahs Sync Bot"
→ Role: Admin

→ Add Assets → Catalogs → 
  apna catalog select karo → Full Control

→ Generate New Token:
  App select karo (ya naya app banao:
  developers.facebook.com → Create App → 
  Type: Business)
  
  Permissions check karo:
  ✅ catalog_management
  ✅ business_management

→ Token Generate → COPY KARO
  (yeh permanent token hai, expire nahi hota
   jab tak revoke na karo)
```

## Step 4: Connect Catalog to Shops
```
Commerce Manager → Catalog →
Connected Assets:
→ Facebook Page connect karo
→ Instagram Account connect karo
→ WhatsApp Business (optional)

= Catalog products automatically
  Facebook Shop + Instagram Shop pe dikhenge
```

---

# PART 2 — ENV VARIABLES

```bash
META_CATALOG_ID=1234567890123456
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
META_GRAPH_API_VERSION=v21.0
```

---

# PART 3 — HOW META CATALOG API WORKS

## Single Product Push:
```
POST https://graph.facebook.com/v21.0/{catalog_id}/products
?access_token={token}

Body:
{
  "retailer_id": "product-uuid-or-sku",
  "name": "Blue Cotton Shirt",
  "description": "Premium cotton shirt for kids...",
  "price": "1200 PKR",
  "currency": "PKR",
  "availability": "in stock",
  "condition": "new",
  "url": "https://teri-site.com/products/blue-cotton-shirt",
  "image_url": "https://supabase.co/.../blue-shirt.webp",
  "additional_image_urls": ["url2", "url3"],
  "brand": "TotVogue",
  "category": "Apparel & Accessories > Clothing",
  "inventory": 25
}
```

## Update Existing Product:
```
POST https://graph.facebook.com/v21.0/{catalog_id}/products
(same endpoint - retailer_id matches = update)
```

## Delete Product:
```
DELETE https://graph.facebook.com/v21.0/{product_fb_id}
```

## Variations (Size/Color) - Product Groups:
```
Parent product + variants use "item_group_id"

Each variation = separate catalog item with:
{
  "retailer_id": "shirt-blue-large",
  "item_group_id": "shirt-blue", // groups variants together
  "name": "Blue Cotton Shirt - Large",
  "color": "Blue",
  "size": "Large",
  ...rest same fields
}
```

## Batch API (Multiple Products at Once - Efficient):
```
POST https://graph.facebook.com/v21.0/{catalog_id}/items_batch

Body:
{
  "requests": [
    { "method": "UPDATE", "data": {...product1} },
    { "method": "UPDATE", "data": {...product2} },
    { "method": "DELETE", "data": { "retailer_id": "xxx" } }
  ]
}
```

---

# PART 4 — REAL-TIME SYNC ARCHITECTURE

```
Admin Product Save/Update/Delete
        ↓
Supabase Webhook (products table)
        ↓
/app/api/meta-sync/route.ts
        ↓
Map product data → Meta format
        ↓
Call Meta Graph API
        ↓
Save fb_catalog_id in product row
(for future updates/deletes)
```

---

# PART 5 — SUPABASE - NEW COLUMNS

```sql
-- products table mein add karo:
alter table products add column if not exists
  meta_sync_status text default 'pending';
  -- pending | synced | error

alter table products add column if not exists
  meta_sync_error text;

alter table products add column if not exists
  meta_last_synced_at timestamptz;

-- Categories mapping table (Meta categories alag hain):
create table meta_category_mapping (
  id uuid primary key default gen_random_uuid(),
  store_category_id uuid references categories(id),
  meta_category text not null,
  -- e.g. "Apparel & Accessories > Clothing > Kids' Clothing"
  created_at timestamptz default now()
);
```

---

# PART 6 — SYNC LOGIC FILES

## /lib/meta/mapProduct.ts
```javascript
export function mapProductToMeta(product, settings, categoryMap) {
  return {
    retailer_id: product.id,
    name: product.name,
    description: product.long_description || product.description,
    price: `${product.price} ${settings.currency}`,
    currency: settings.currency,
    availability: product.stock > 0 ? 'in stock' : 'out of stock',
    condition: 'new',
    url: `${settings.site_url}/products/${product.slug}`,
    image_url: product.image_url,
    additional_image_urls: product.gallery_images || [],
    brand: settings.brand_name,
    category: categoryMap[product.category_id] || 'Apparel & Accessories',
    inventory: product.stock,
    // If product has variations:
    ...(product.variation_group_id && {
      item_group_id: product.variation_group_id,
      color: product.variation_color,
      size: product.variation_size,
    })
  }
}
```

## /lib/meta/syncProduct.ts
```javascript
export async function syncProductToMeta(product, action = 'UPDATE') {
  const url = `https://graph.facebook.com/${META_API_VERSION}/${META_CATALOG_ID}/items_batch`
  
  const requests = action === 'DELETE' 
    ? [{ method: 'DELETE', data: { retailer_id: product.id } }]
    : [{ method: 'UPDATE', data: mapProductToMeta(product, settings, categoryMap) }]

  const res = await fetch(`${url}?access_token=${META_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests })
  })

  const data = await res.json()
  
  if (data.error) {
    // Save error to product row
    await updateProduct(product.id, { 
      meta_sync_status: 'error', 
      meta_sync_error: data.error.message 
    })
    return { success: false, error: data.error }
  }

  await updateProduct(product.id, { 
    meta_sync_status: 'synced', 
    meta_last_synced_at: new Date().toISOString() 
  })
  return { success: true, data }
}
```

---

# PART 7 — API ROUTE

```javascript
// /app/api/meta-sync/route.ts
import { syncProductToMeta } from '@/lib/meta/syncProduct'

export async function POST(req) {
  // Verify secret (same pattern as revalidate webhook)
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { table, type, record, old_record } = await req.json()

  if (table === 'products') {
    if (type === 'DELETE') {
      await syncProductToMeta(old_record, 'DELETE')
    } else {
      await syncProductToMeta(record, 'UPDATE')
    }
  }

  return Response.json({ success: true })
}
```

---

# PART 8 — WEBHOOK SETUP (Same Pattern)

```
Supabase Webhook (NEW - separate from revalidate):
Name: meta-catalog-sync
Table: products
Events: INSERT, UPDATE, DELETE
URL: https://teri-site.vercel.app/api/meta-sync
Header: x-revalidate-secret: [same secret]

OR combine into existing /api/revalidate route:
Add meta sync call there too (1 webhook does both)
```

---

# PART 9 — ADMIN UI - SYNC STATUS

```
/admin/products page mein column add karo:

┌────────────────────────────────────┐
│ Product          | Meta Sync Status │
├────────────────────────────────────┤
│ Blue Cotton Shirt| 🟢 Synced        │
│ Red Silk Dress   | 🔴 Error [View]  │
│ Kids Cap         | 🟡 Pending       │
└────────────────────────────────────┘

[Sync All Products] button → bulk push
[Retry Failed] button → retry error ones
```

## Bulk Initial Sync (First Time):
```javascript
// /app/api/meta-sync/bulk/route.ts
// Sends ALL products in batches of 50 (Meta limit)
// items_batch supports max 50 per request
```

---

# PART 10 — CATEGORY MAPPING (Admin Setup)

```
Meta has FIXED category taxonomy (Google Product Categories)
Tera store categories ≠ Meta categories

/admin/settings/meta-sync page:
┌──────────────────────────────────────┐
│ Map Your Categories to Meta:          │
│                                        │
│ Boys Clothing → [Select Meta Cat ▼]   │
│   "Apparel > Clothing > Kids > Boys" │
│                                        │
│ Girls Clothing → [Select Meta Cat ▼]  │
│   "Apparel > Clothing > Kids > Girls"│
└──────────────────────────────────────┘

Common Meta categories for clothing:
- Apparel & Accessories > Clothing
- Apparel & Accessories > Clothing > Kids' Clothing
- Apparel & Accessories > Clothing > Activewear
```

---

# PART 11 — TESTING

```
1. Catalog Diagnostics:
   Commerce Manager → Catalog → Diagnostics
   Shows errors per product

2. Test single product:
   /admin/products/[id] → "Test Meta Sync" button
   → calls API → shows response

3. Common Errors:
   "Invalid image URL" → image must be publicly
     accessible (Supabase public bucket ✅)
   "Category required" → map category first
   "Price format invalid" → must be "1200 PKR"
     (number + space + currency code)
```

---

# COMPLETE CHECKLIST

## Agent Ka Kaam:
```
□ products table - meta_sync columns migration
□ meta_category_mapping table migration
□ /lib/meta/mapProduct.ts
□ /lib/meta/syncProduct.ts
□ /app/api/meta-sync/route.ts
□ /app/api/meta-sync/bulk/route.ts (initial sync)
□ /admin/products - sync status column + badges
□ /admin/products - "Sync All" + "Retry Failed" buttons
□ /admin/settings/meta-sync - category mapping UI
□ Single product "Test Sync" button
```

## Tera Manual Kaam:
```
□ business.facebook.com - Create Catalog
□ Catalog ID copy karo
□ System User banao + Permanent Access Token generate
□ developers.facebook.com - App banao (Business type)
  Permissions: catalog_management, business_management
□ Catalog connect karo Facebook Page + Instagram
□ ENV variables add karo:
  META_CATALOG_ID, META_ACCESS_TOKEN, META_GRAPH_API_VERSION
□ Supabase webhook add karo (ya existing revalidate
  route mein meta sync call add karo)
□ Category mapping admin panel mein set karo
□ "Sync All" click karo first time (initial bulk push)
```

---

# GOLDEN RULES

```
1. retailer_id = product.id (unique, consistent)
2. Images = public Supabase URLs (Meta fetch kar sake)
3. Price format = "1200 PKR" (number + space + currency)
4. items_batch = max 50 products per call
5. Variations = item_group_id se group hote hain
6. Token = permanent (System User se), expire nahi hota
7. Category mapping = ek baar setup, sab products use karein
8. Sync errors = product row mein save, admin dekh sake
9. Same webhook = revalidate cache + meta sync dono (efficient)
```
