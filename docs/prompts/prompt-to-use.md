# Final Prompt - IDX Gemini Ko Dena Hai
# MDs /docs folder mein rakhne ke baad yeh paste karo

---

## PROMPT ↓

```
Read these files first before doing anything:
- /docs/complete-cache-webhook-guide.md
- /docs/final-agent-prompt.md

I have a Next.js 14 App Router + TypeScript ecommerce project.
Supabase for DB and storage. Cloudflare CDN on top.
All ENV variables already set in .env.local and Vercel.
Do NOT remove any existing code - only update and add.

---

TASK 1 — next.config.ts UPDATE:
- Add image formats: AVIF and WebP
- Set minimumCacheTTL: 60
- Add *.supabase.co to remotePatterns
- Add Cache-Control headers:
  /_next/static/* → public, max-age=31536000, immutable
  /fonts/*        → public, max-age=31536000, immutable
  /cart           → no-store, no-cache
  /checkout       → no-store, no-cache
  /account/*      → no-store, no-cache
  /*              → public, s-maxage=60, stale-while-revalidate=600

---

TASK 2 — Page Revalidate + Cache Tags:
- app/page.tsx                 → export const revalidate = 600
- app/category/[slug]/page.tsx → export const revalidate = 300
- app/product/[slug]/page.tsx  → export const revalidate = 60
- app/cart/page.tsx            → export const revalidate = 0
- app/checkout/page.tsx        → export const revalidate = 0
- app/account/page.tsx         → export const revalidate = 0

Add fetch cache tags:
- Homepage  → tags: ['homepage', 'banners']
- Product   → tags: [`product-${slug}`]
- Category  → tags: [`category-${slug}`]

---

TASK 3 — /lib/uploadImage.ts CREATE:
- Function: uploadImage(file: File, bucket: string)
- Validate: jpg, jpeg, png, webp, avif only
- Check filename exists in bucket
- If exists: add timestamp → banner-1718123456.jpg
- Upload to Supabase storage
- Return full public URL
- try/catch with error messages
- Named export

---

TASK 4 — /lib/revalidate.ts CREATE:
Functions:
- revalidateProduct(slug: string)
- revalidateBanner()
- revalidateCategory(slug: string)
- revalidateHomepage()

Each function must do BOTH:
1. revalidateTag with correct tag
2. Cloudflare Cache Purge API call
   Use: CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN
   Use: NEXT_PUBLIC_SITE_URL for full URLs
try/catch + named exports

---

TASK 5 — /app/api/revalidate/route.ts CREATE:
POST endpoint:
1. Check header x-revalidate-secret = REVALIDATE_SECRET
   Return 401 if wrong
2. Parse Supabase webhook body:
   { type, table, schema, record, old_record }
3. Route by table:
   products   → revalidateProduct(record.slug)
   banners    → revalidateBanner()
   categories → revalidateCategory(record.slug)
4. Return 200 { revalidated: true } on success
5. Return 500 with error on failure
Full try/catch.

---

TASK 6 — Admin Upload Replace:
Find ALL image upload code in /app/admin/
Replace everything with uploadImage() from /lib/uploadImage.ts
Products + banners + categories = same function

---

AFTER ALL TASKS DONE - Tell me:
1. List of all files created and modified
2. Exact Supabase webhook steps for my tables
3. Reminder for Vercel ENV variables
```

## PROMPT END ↑
