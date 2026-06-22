# Complete Project Setup Guide
## From Clone to Live — Step by Step

---

## PART 1: Prerequisites

- Node.js 18+ installed
- Git installed
- Accounts ready: Supabase, Vercel, Cloudflare, GitHub, Google, Meta Business

---

## PART 2: Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
cp .env.example .env.local
```

---

## PART 3: Supabase Setup

### 3.1 Create Project
1. supabase.com → New Project
2. Name, password, region (ap-northeast-1 for Pakistan)
3. Wait for project to be ready

### 3.2 Get Credentials
Supabase Dashboard → Settings → API:
```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Settings → Database → Connection string:
```env
DATABASE_URL=postgresql://postgres.XXXX:PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.XXXX:PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

### 3.3 Run Master Schema (Recommended & Fastest)
1. In your project, open the [SUPER_MASTER_SCHEMA.sql](file:///Users/shoaib/Desktop/Zaynahs%20e-store/supabase/schema/SUPER_MASTER_SCHEMA.sql) file and copy its entire content.
2. Navigate to your **Supabase Dashboard → SQL Editor → click "New Query"**.
3. Paste the SQL code and click **Run**.
4. This instantly configures:
   - All tables, constraints, indexes, and primary keys.
   - Row Level Security (RLS) on all tables with client/admin access policies.
   - The `product-images` storage bucket and its public read/write policies.
   - Realtime tracking subscriptions on `orders` and `abandoned_carts` tables.
   - Trigger functions (for syncing product reviews and auto-linking orders to abandoned carts).
   - Seeds the default settings singleton row in `store_settings`.
*Note: You do NOT need to run prisma/supabase push commands or manually set up buckets, realtime settings, or policies in the dashboard.*

---

## PART 4: GitHub Setup

1. github.com → New repository
2. Name: your-project-name
3. Private → Create

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

```env
GITHUB_USERNAME=your-username
GITHUB_TOKEN=ghp_xxxx  # Settings → Developer settings → Personal access tokens
GITHUB_REPO=your-repo-name
```

---

## PART 5: Vercel Setup

### 5.1 Deploy
1. vercel.com → New Project
2. Import from GitHub → select repo
3. Framework: Next.js
4. Deploy

### 5.2 Custom Domain
Vercel → Project → Settings → Domains → Add:
- `yourdomain.pk`
- `www.yourdomain.pk`

### 5.3 Environment Variables
Vercel → Project → Settings → Environment Variables → Add all:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=

# Site
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.pk  # ← www wala!
NEXT_PUBLIC_ADMIN_EMAIL=your@email.com
NEXT_PUBLIC_BRAND_NAME=Your Brand
NEXT_PUBLIC_TWITTER_HANDLE=@yourbrand

# GitHub
GITHUB_USERNAME=
GITHUB_TOKEN=
GITHUB_REPO=

# Cache
REVALIDATE_SECRET=your_secret_cache_2026

# Cloudflare
CLOUDFLARE_ZONE_ID=
CLOUDFLARE_API_TOKEN=
CF_ACCOUNT_ID=

# SEO
GOOGLE_SITE_VERIFICATION=
INDEXNOW_API_KEY=

# Cron
CRON_SECRET=your_cron_secret_2026

# Meta
META_CATALOG_ID=
META_ACCESS_TOKEN=
META_GRAPH_API_VERSION=v21.0

# NOTE: SMTP Credentials (Gmail SMTP user, App Password, From Name, Admin Notification Email) 
# are NOT set as Vercel/local environment variables. They are configured dynamically 
# in the Admin Dashboard under the "Email & SMTP" settings tab.
```

---

## PART 6: Cloudflare Setup

### 6.1 Add Domain
1. dash.cloudflare.com → Add site
2. Enter domain → Free plan
3. Copy Cloudflare nameservers
4. Domain registrar mein nameservers update karo
5. Wait 24-48 hours for propagation

### 6.2 Get Zone ID & Account ID
Cloudflare → your domain → Right panel scroll down:
- **Zone ID** → copy → `CLOUDFLARE_ZONE_ID`
- **Account ID** → copy → `CF_ACCOUNT_ID`

### 6.3 Create API Token
Cloudflare → My Profile → API Tokens → Create Token:
1. "Create Custom Token" → Get started
2. Token name: `cache-purge-token`
3. Permissions: **Zone** → **Cache Purge** → **Purge**
4. Zone Resources: Include → All zones
5. Create Token → copy → `CLOUDFLARE_API_TOKEN`

### 6.4 DNS Records
Cloudflare → DNS → Add records:
```
Type: CNAME  Name: @    Content: cname.vercel-dns.com
Type: CNAME  Name: www  Content: cname.vercel-dns.com
```
Proxy status: **Proxied** (🟠 orange cloud) — NOT grey!

⚠️ **IMPORTANT:** Agar grey cloud (DNS only) hai to:
- Cloudflare cache, cache rules, purge — KUCH bhi kaam nahi karega
- `curl -I` mein `server: Vercel` dikhega, `server: cloudflare` nahi
- `cf-cache-status` header missing hoga
- Click karke orange (Proxied) karo — DNS record pe cloud icon click karo

### 6.5 Cache Rules (4 Rules)
Cloudflare → Caching → Cache Rules → Create rule:

**Rule 1 — no-cache-dynamic:**
```
Expression:
(http.request.uri.path contains "/cart") or 
(http.request.uri.path contains "/checkout") or 
(http.request.uri.path contains "/account") or 
(http.request.uri.path contains "/api")

Action: Bypass Cache
```

**Rule 2 — static-assets:**
```
Expression:
(http.request.uri.path contains "/_next/static/")

Action: Eligible for cache
Edge TTL: Ignore cache-control → 1 year
```

**Rule 3 — html-pages:**
```
Expression:
(http.request.uri.path wildcard "/*")

Action: Eligible for cache
Edge TTL: Use cache-control header if present, otherwise → 60 seconds
```
⚠️ "Ignore cache-control" MAT karo is rule pe — Next.js ka
`s-maxage=60` header use hone do, taake webhook
revalidate + Cloudflare purge sync rahein.

**Rule 4 — supabase-images:**
```
Expression:
(http.request.full_uri contains "supabase.co")

Action: Eligible for cache
Edge TTL: Ignore cache-control → 30 days
```

---

### 6.6 Browser Cache TTL (Configuration page)
Cloudflare → Caching → Configuration → **Browser Cache TTL**

```
Free plan: minimum = 30 minutes (no "Respect headers" option)
Set to: 30 minutes

⚠️ Yeh setting Next.js ke "max-age" header ko OVERRIDE/ADD
karti hai response mein. Agar next.config.ts mein
max-age set kiya (galti se), 30 min Cloudflare ke saath
combine ho jata hai — customer ko purana data 30 min
tak browser cache se mil sakta hai.

FIX (Next.js side — zaroori):
next.config.ts headers mein Cache-Control sirf yeh ho:
  "public, s-maxage=60, stale-while-revalidate=600"
(max-age MAT likho — Cloudflare ka 30min sirf fallback
hai jab Next.js header missing ho)
```

---

### 6.7 Verify Setup (curl test)
```bash
curl -sI -v https://www.yourdomain.pk 2>&1 | grep -i "cf-\|server\|cache-status"
```

Expected output (sahi setup):
```
server: cloudflare
cf-cache-status: HIT (or MISS on first request)
cf-ray: xxxxxxxx-XXX
```

Agar `server: cloudflare` missing hai → DNS proxy
(Section 6.4) check karo, "Proxied" hona chahiye.

---

## PART 7: Google Search Console

### 7.1 Add Property
1. search.google.com/search-console
2. Add property → Domain type
3. Enter: yourdomain.pk
4. Verification method: DNS record (Cloudflare se auto ho jata hai)

### 7.2 Get Verification Code
Settings → Ownership verification → HTML tag method:
`<meta name="google-site-verification" content="XXXX"/>`
Copy only `XXXX` → `GOOGLE_SITE_VERIFICATION`

**Note:** Agar Cloudflare pe domain hai to DNS verification auto ho jata hai — HTML tag ki zaroorat nahi!

### 7.3 Submit Sitemap (Deploy ke baad)
Search Console → Sitemaps → Add:
`https://www.yourdomain.pk/sitemap.xml`

---

## PART 8: Gmail SMTP Setup

### 8.1 Enable 2-Step Verification
1. myaccount.google.com → Security
2. 2-Step Verification → Turn On
3. Follow steps

### 8.3 Configure in Admin Panel
Go to your **Admin Panel → Settings → Email & SMTP** tab:
1. **Gmail SMTP Address**: Enter your sender Gmail address (e.g. `your@gmail.com`).
2. **Gmail App Password**: Paste your 16-character Google App Password (spaces will be stripped automatically).
3. **From Name**: The sender name displayed on emails (e.g. `Your Brand Store`).
4. **Admin Notification Email**: The email address receiving stock warnings, custom order logs, and review alerts.
5. Click **Save Settings** and then click **Send Test Email** to verify SMTP connectivity.

*Note: NodeMailer reads these dynamically from the database. Never store app passwords in `.env.local`.*

---

## PART 9: Meta Catalog Setup (Facebook/Instagram Shop)

### 9.1 Create Facebook App
1. developers.facebook.com → My Apps → Create App
2. Use case: Other → Business
3. App name: `your-store E Store`
4. Save App ID

### 9.2 Add Catalog Permission
App Dashboard → Add Product → Marketing API → Set Up
Permissions → `catalog_management` → enable

### 9.3 Create Product Catalog
1. business.facebook.com/commerce
2. Add Catalog → E-commerce
3. Name: `Your Store Catalog`
4. Catalog ID from URL: `/catalogs/CATALOG_ID/`

### 9.4 Add App to Business
Business Settings → Accounts → Apps → Add → Connect app ID → paste App ID

### 9.5 Create System User
Business Settings → Users → System Users → Add:
- Name: `sync bot` (lowercase, spaces ok — NO capital letters!)
  ⚠️ Error "Profile names can't have too many capital
  letters" aaye to naam SAB lowercase karo
- Role: Admin

⚠️ Agar "no asset to add" / "app must be part of business
portfolio" error aaye System User pe assets assign karte
waqt: pehle Business Settings → Accounts → Apps → Add →
"Connect an app ID" se apna app connect karo (Step 9.4),
phir System User pe wapas aao → "Assign assets" button.

Assign assets:
- Apps → your app → Full Control
- Catalogs → your catalog → Full Control

### 9.6 Generate Token
System User → Generate token:
- App: your app
- Permissions: ✅ catalog_management
- Generate → Copy immediately!

```env
META_CATALOG_ID=your_catalog_id
META_ACCESS_TOKEN=EAAja7...
META_GRAPH_API_VERSION=v21.0
```

---

## PART 9.5: Cache Invalidation - Important Notes

⚠️ **Next.js 16 Compatibility:** Agar `revalidateTag()`
build error de (TS2554: Expected 2 arguments), yeh code-level
fix hai — agent/developer ko bolo `(revalidateTag as any)(tag)`
use karein. Yeh teri taraf se manual kaam nahi hai.

⚠️ **Route Verification (Tujhe Confirm Karna Hai):**
Apni site ke actual URLs batao developer/agent ko:
```
Product page URL format: /product/xxx ya /products/xxx?
Shop/listing page: /shop hai ya kuch aur?
Category page: /category/xxx → kahan redirect hota hai?
```
Yeh batana zaroori hai taake Cloudflare purge sahi
URLs pe ho.

---



## PART 10: Supabase Database Webhooks Setup

Database webhooks are now **fully automated** and included in the database master schema (`SUPER_MASTER_SCHEMA.sql`). Running the SQL script automatically sets up the trigger function `public.handle_db_webhook_revalidate()` and hooks it to the 5 target tables.

> [!NOTE]
> Under the hood, these triggers leverage the `pg_net` PostgreSQL extension to send asynchronous HTTP POST requests to `https://www.zaynahs.pk/api/revalidate` with the security token `zaynahs_secret_cache_revalidate_2026` configured in `x-revalidate-secret` header.

**Automatic Webhook Triggers Configured:**

| Trigger Name | Target Table | Target Events |
|------|-------|--------|
| revalidate-products | products | INSERT, UPDATE, DELETE |
| revalidate-categories | categories | INSERT, UPDATE, DELETE |
| revalidate-reviews | reviews | INSERT, UPDATE, DELETE |
| revalidate-homepage | homepage_sections | INSERT, UPDATE, DELETE |
| revalidate-settings | store_settings | INSERT, UPDATE, DELETE |

---

## PART 11: Test Everything

### 1. Cloudflare Proxy Test (First!)
```bash
curl -sI -v https://www.yourdomain.pk 2>&1 | grep -i "cf-\|server\|cache-status"
```
Expected:
```
server: cloudflare
cf-cache-status: HIT (2nd request)
cf-ray: present
```
Agar missing → DNS proxy "Proxied" (orange) check karo.

### 2. Cache Headers Test
```bash
curl -I https://www.yourdomain.pk
```
Look for:
```
cache-control: public, s-maxage=60, stale-while-revalidate=600
x-vercel-cache: HIT or REVALIDATED
cf-cache-status: HIT
```
⚠️ `max-age` cache-control mein NAHI hona chahiye
(agar hai to next.config.ts check karo).

### 3. Webhook Manual Test (cURL)
```bash
curl -X POST https://www.yourdomain.pk/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: your_secret_cache_2026" \
  -d '{"type":"UPDATE","table":"products","record":{"slug":"test-product-slug"}}'
```
Expected: `{"revalidated":true,"table":"products","type":"UPDATE"}`

### 4. Real End-to-End Test (Best/Recommended)
```
1. Admin panel → kisi product ka price ya image change karo
2. Save karo
3. Frontend product page open karo (normal tab, refresh)
4. Naya data turant (60 sec ke andar) dikhna chahiye

= Webhook + revalidate + Cloudflare purge sab kaam
  kar rahe hain agar yeh instant dikh jaye ✅
```

### 5. Settings/Customizer Test
```
1. Admin → Settings/Customizer → logo/color change
2. Save
3. Site refresh (no hard refresh)
4. Change har page pe dikhe (purge_everything triggered)
```

### Webhook Logs (Supabase)
Supabase → Integrations → Database Webhooks → Webhooks
tab → webhook ka 3-dot menu → edit page mein config
verify karo (dedicated delivery logs UI mein easily
nahi milte — cURL test (#3) ya end-to-end test (#4)
zyada reliable hain)

### Email Test
Admin Panel → Settings → Email → Send test email button

### Meta Sync Test
Admin Panel → Settings → Meta Sync → Sync All to Meta

---

## PART 12: Complete .env.local Template

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Site & Brand
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=your@email.com
NEXT_PUBLIC_BRAND_NAME=Your Brand
NEXT_PUBLIC_TWITTER_HANDLE=@yourbrand

# GitHub
GITHUB_USERNAME=your-username
GITHUB_TOKEN=ghp_xxxx
GITHUB_REPO=your-repo

# Cache & Cloudflare
REVALIDATE_SECRET=your_secret_cache_2026
CLOUDFLARE_ZONE_ID=
CLOUDFLARE_API_TOKEN=
CF_ACCOUNT_ID=

# SEO
GOOGLE_SITE_VERIFICATION=
INDEXNOW_API_KEY=

# Cron
CRON_SECRET=your_cron_secret_2026

# Meta Catalog
META_CATALOG_ID=
META_ACCESS_TOKEN=
META_GRAPH_API_VERSION=v21.0
```

---

## PART 13: Order Summary

```
1. Clone + npm install
2. Run `SUPER_MASTER_SCHEMA.sql` in Supabase SQL Editor (automatically sets tables, bucket, policies, and realtime)
3. GitHub repo banao → push karo
4. Vercel deploy karo → ENV add karo
5. Cloudflare domain add karo → DNS set karo (orange cloud Proxied check confirm karo)
6. Cloudflare Zone ID + API Token copy karo → Vercel ENV mein add karo
7. Cloudflare 4 Cache Rules banao + Browser Cache TTL = 30min
8. curl test karo - server: cloudflare confirm karo
9. Gmail App Password banao → Admin Panel Settings → Email tab mein configure aur test karo
10. Google Search Console mein domain verify karo
11. Meta Business Manager System User token aur Catalog ID generate karo → Vercel ENV add karo
12. Supabase Webhooks triggers auto-configured dynamically via `SUPER_MASTER_SCHEMA.sql` setup.
13. cURL se `/api/revalidate` cache refresh verify karo
14. Admin Panel → Products/Meta Sync → Sync All to Meta
15. End-to-end test: Kisi product ka details update karke storefront page check karo.
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `cache-control: private` | next.config.ts mein headers add karo (code) |
| `server: Vercel` not `cloudflare`, `cf-cache-status` missing | DNS record cloud icon **grey → orange (Proxied)** karo |
| Customer ko purana price/image 30min+ tak dikhe | Cloudflare Browser Cache TTL = 30 min hai (free plan min); ensure next.config Cache-Control mein `max-age` NA ho, sirf `s-maxage` |
| Cache Rule "Edge TTL" set karte waqt | "Ignore cache-control header" mat select karo html-pages rule pe — "Use cache-control header if present, otherwise X" select karo |
| Gmail SMTP fail | App Password use karo (myaccount.google.com/apppasswords), normal password nahi |
| Webhook 401 error | REVALIDATE_SECRET Vercel ENV + Supabase webhook header — dono jagah EXACT same value check karo |
| Meta: "too many capital letters" error | System User naam sab lowercase rakho (e.g. `sync bot`) |
| Meta: "app must be part of business portfolio" | Pehle Business Settings → Apps → "Connect an app ID" se app add karo, phir System User assets assign karo |
| Vercel timeout | Supabase queries pe indexes lagao |
| Webhook fire ho raha lekin frontend update nahi | cURL test karo `/api/revalidate` pe — agar `{"revalidated":true}` aata hai to issue Cloudflare Browser Cache TTL ya next.config headers mein hai, webhook mein nahi |


must do after  all

3. cURL Test (Terminal mein)
bashcurl -X POST https://www.zaynahs.pk/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: zaynahs_secret_cache_revalidate_2026" \
  -d '{"type":"UPDATE","table":"products","record":{"slug":"kids-sonic-game-on-graphic-cotton-t-shirt"}}'
{"revalidated":true} aaye = ✅ kaam kar raha