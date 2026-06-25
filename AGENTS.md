<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:domain-rules -->
# Multi-Domain System Rule

This app runs across ANY domain (localhost, custom domain, production). Never hardcode a domain or brand name.

**Always use:**
- Server-side: `getSiteUrl(settings)` from `@/lib/site-url-server` — uses `settings.storeUrl` first, then detects `host` header
- Client-side: `getClientSiteUrl(settings)` from `@/lib/site-url` — uses `settings.storeUrl` first, then `window.location.origin`
- URL cleanup: `cleanLocalhostUrls(text, siteUrl)` from `@/lib/site-url` — replaces localhost URLs with dynamic site URL
- Brand name: `settings.storeName || process.env.NEXT_PUBLIC_BRAND_NAME || 'Zaynahs E-Store'`
- Logo: `settings.logoUrl` — always from general settings, never fallback to Vercel/Next.js default favicon
- Favicon: `settings.faviconUrl` — always from general settings, served via `/favicon.ico` route that reads from DB
- OG image: `settings.logoUrl` or `settings.bannerUrl` — never use Vercel/Next.js default og-image
- Google index / SEO: all meta tags, JSON-LD schema, canonical URLs, sitemap, robots.txt must use `getSiteUrl()` value
- All image URLs in meta tags must use `cleanLocalhostUrls()` to ensure absolute paths

**CRITICAL — Never use `getSiteUrl()` inside `generateMetadata`:**
- `getSiteUrl()` imports `headers()` from `next/headers` which forces `cache-control: private, no-store`
- Kills ISR (`revalidate`), kills Cloudflare CDN cache
- Always use direct: `settings?.storeUrl?.replace(/\/+$/, '') || process.env.NEXT_PUBLIC_SITE_URL || ''`
- Exception: inside page component (not generateMetadata) — allowed

**Never use:**
- Hardcoded `totvogue.pk`, `zaynahs.pk`, `TotVogue.pk` — all must come from DB settings or request headers
- `process.env.NEXT_PUBLIC_SITE_URL` as final fallback — use `getSiteUrl()` helper inside page components
- `.replace(/http:\/\/localhost:3000/g, '...')` — use `cleanLocalhostUrls()` instead
- Vercel/Next.js default favicon, logo, or og-image — always read from DB settings
- Hardcoded favicon.ico in `/public/` — the app serves favicon dynamically from `settings.faviconUrl`
<!-- END:domain-rules -->

<!-- BEGIN:ssr-rules -->
# SSR / Caching Rules

1. **Never block SSR with non-critical data.** Social proofs, banners, recommendations — anything non-critical must be:
   - Fetched client-side (inside `'use client'` component via `useEffect` + dynamic import)
   - OR wrapped in `Promise.race` with timeout (max 2s), caught with `.catch(() => [])`
   - Pass `[]` as default, let client-side fetch populate

2. **ISR pattern:** `export const revalidate = 86400` on all storefront pages.
   - Webhooks purge cache on admin save (`revalidateTag`, `revalidatePath`, Cloudflare purge)

3. **Server/Client split for site-url:**
   - `lib/site-url-server.ts` = server-only (uses `next/headers`) — DO NOT import in client components
   - `lib/site-url.ts` = client-safe — uses `window.location.origin`, no `next/headers`

4. **Cloudflare cache override:**
   - Always set `cdn-cache-control: public, s-maxage=86400, stale-while-revalidate=60`
   - This makes Cloudflare cache even pages with `cache-control: private`
<!-- END:ssr-rules -->

<!-- BEGIN:db-rules -->
# Database Rules

1. **Always use `supabaseAdmin` (service role key) for admin/storefront queries.**
   - Bypasses RLS — avoids nested join RLS failures
   - Use `@/lib/supabase/admin` import

2. **Settings table name:** `store_settings` (not `settings`)
   - Key columns: `store_url`, `store_name`, `currency_symbol`, `logo_url`, `favicon_url`, `banner_url`

3. **Avoid nested joins that fail on RLS.**
   - Batch fetch product images separately instead of joining in main query
   - Pattern: fetch main data → collect IDs → batch fetch related data → merge in memory

4. **Reviews table:** `reviews`
   - `getGlobalReviews()` returns `{ reviews: [], total: 0 }` on error (graceful degradation)
   - `getTopReviews(3)` for homepage, `getGlobalReviews()` for /reviews page

5. **Cache tags for revalidation:**
   - `products` — all product changes
   - `categories` — category changes
   - `reviews` — review CRUD
   - `social_proof` — social proof CRUD
   - `settings` — settings update
   - Use `unstable_cache` with these tags for DB-backed caching

6. **ALWAYS update SUPER_MASTER_SCHEMA.sql for EVERY migration — no exceptions.**
   - Every schema change (columns, tables, indexes, policies, triggers, functions, RLS, storage rules, auth config) must be reflected in `supabase/schema/SUPER_MASTER_SCHEMA.sql`
   - **Update BEFORE writing the migration** — master schema is the source of truth, migration follows it
   - This applies to: `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `CREATE INDEX`, `DROP INDEX`, `CREATE POLICY`, `DROP POLICY`, `CREATE FUNCTION`, `CREATE TRIGGER`, storage bucket config, auth settings — absolutely everything
   - Keep the schema version (top comment) and "Updated" date header current

7. **All Supabase admin actions via Management API only.**
   - Never use Supabase CLI (`supabase db push`, `supabase migration` etc.)
   - Never use direct Postgres connection strings for schema changes
   - All operations must use `SUPABASE_MGMT_TOKEN` and `SUPABASE_PROJECT_REF` from `.env.local`
   - Covers: schema migrations, storage rules, RLS policies, triggers, functions, webhooks, auth config, and any other DDL/DML changes
   - Pattern: use the helper scripts below — never hardcode tokens in any file

8. **NEVER hardcode credentials in any file.**
   - No tokens, API keys, passwords, or project refs in `.ts`, `.tsx`, `.sql`, `.md`, `.json`, or `.js` files
   - Everything goes in `.env.local` only:
     ```
     SUPABASE_PROJECT_REF=your_project_ref
     SUPABASE_MGMT_TOKEN=sbp_your_management_token
     NEXT_PUBLIC_SUPABASE_URL=https://yourref.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```
   - GitHub will block pushes containing secrets — use `rg "sbp_|ghp_" --glob '!.env*' --glob '!.git'` to check

9. **Clone / setup from scratch:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase project details
   - Run `node scripts/init-db.mjs` to apply `SUPER_MASTER_SCHEMA.sql` (creates all tables, indexes, RLS, triggers)
   - Run `node scripts/run-migration.mjs supabase/migrations/<filename>.sql` for individual migrations
   - Then `npm run dev` — everything works
<!-- END:db-rules -->

<!-- BEGIN:social-proof-guidelines -->
# Social Proof Guidelines

1. **Social proof tab excludes all PII** (Name, Phone, Email) — show privacy notice instead
2. Supports **many-to-many product association** via checkboxes (not single dropdown)
3. If tagged product is deleted → show "Not Available" / "Deleted" badge, no broken link
4. Storefront social proofs are fetched **client-side** (not SSR) to avoid blocking page render
5. **Review count must ALWAYS merge store reviews + proof wall items.**  
   Wherever a review count or rating summary is displayed (grid, header, product page, homepage, /reviews), use:
   ```
   totalCount = storeReviews.length + socialProofCount
   avgRating  = (sum(storeReviews.rating) + socialProofCount * 5) / totalCount
   ```
   Each proof wall entry counts as a **5-star rating**. Append `"(Includes Verified + Proof Wall)"` annotation when `socialProofCount > 0`.
   - Fetch `socialProofCount` server-side via `supabaseAdmin.from('social_proof_products').select('product_id', { count: 'exact', head: true }).eq('product_id', product.id)` for product pages, or `supabaseAdmin.from('social_proof').select('id', { count: 'exact', head: true }).eq('active', true).is('deleted_at', null)` for the homepage.
   - On the `/reviews` page, use `socialProofs.length` (already in client).
<!-- END:social-proof-guidelines -->

<!-- BEGIN:legacy-audit-rule -->
# Legacy Project Audit Rule (Old Version → Complete Setup)

Jab bhi koi **purana / existing project clone kare** (already Supabase, Cloudflare, Vercel, GitHub bane hain), to agent **in sab docs ko ek ek karke padhe** aur jo missing/wrong hai wo fix kare:

| Area | Check Against |
|---|---|
| **Database** | `SUPER_MASTER_SCHEMA.sql` — sab tables, columns, indexes, RLS policies, triggers, functions exist karte hain? |
| **Migrations** | `supabase/migrations/` — jo bhi migration file hai, wo `run-migration.mjs` se apply hai? |
| **Storage** | `product-images` bucket exist karta hai? Public policy set hai? |
| **Webhooks** | Supabase DB webhooks (product_changes, order_events etc.) exist karte hain? |
| **Cloudflare DNS** | Domain ke A/CNAME records sahi hain? Proxy enabled (orange cloud)? |
| **Cloudflare Rules** | Page Rules ya Cache Rules: HTML pages 24h cache, dynamic paths no-cache? SSL/TLS full strict? |
| **Cloudflare Cache** | Actual pages HIT/MISS/BYPASS de rahi hain? `cf-cache-status` header check karo |
| **Vercel** | Project import hai? Env vars set hain (Supabase keys)? Domain attached hai? Build successful? |
| **GitHub** | Code pushed hai? Deployment trigger ho raha hai? |

**Agent ka task:**
1. Pehle **sari docs** ek sath batch-read karo: `docs/NEW_PROJECT_SETUP_GUIDE.md`, `docs/MANUAL_SETUP_GUIDE.md`, `docs/CLOUDFLARE_SUPABASE_SETUP.md`, `docs/MASTER_CACHE_GUIDE.md`, `docs/META_SYNC_GUIDE.md` (agar exist karein)
2. Phir **SUPABASE_MGMT_TOKEN** + **CLOUDFLARE_API_TOKEN** + **VERCEL_TOKEN** le kar sab APIs se verify karo
3. Jo cheezein missing hain, wo auto-create/fix karo
4. Last mein summary do: "✅ Sab sahi hai" ya "⚠️ Yeh cheezein fixed ki"

**Rules:**
- Sirf actual missing cheezein fix karo — jo pehle se sahi hai use mat todo
- Koi bhi naya feature add nahi karna — sirf existing setup complete karna hai
- Har action ke baad verify karo ke kaam hua ya nahi
- Kuch bhi delete mat karo jo pehle se kaam kar raha ho
<!-- END:legacy-audit-rule -->
