# Zaynahs SEO System - Complete Agent Prompt
# IDX Gemini Ko Yeh Paste Karo

---

## PROMPT ↓

```
Read these files FIRST before doing anything:
- /docs/complete-cache-webhook-guide.md
- /docs/zaynahs-seo-complete-guide.md

I have Next.js 14 App Router + TypeScript ecommerce.
Supabase DB + Storage. Cloudflare CDN. Vercel deploy.
All ENV variables set. Do NOT remove existing code.
Images are already converted to WebP on upload.

DO ALL TASKS IN ORDER. DO NOT SKIP ANY.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 1 — SUPABASE MIGRATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create these migrations:

Migration 1 - seo_meta table:
create table seo_meta (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  seo_title text,
  meta_description text,
  focus_keyword text,
  secondary_keywords text,
  lsi_tags text,
  og_title text,
  og_description text,
  twitter_title text,
  twitter_description text,
  image_alt text,
  long_description text,
  faq_schema jsonb,
  pinterest_description text,
  is_optimized boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

Migration 2 - media_library table:
create table media_library (
  id uuid primary key default gen_random_uuid(),
  original_filename text,
  seo_filename text,
  file_url text not null,
  alt_text text,
  title text,
  description text,
  caption text,
  ai_generated boolean default false,
  ai_enabled boolean default true,
  bucket text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

Migration 3 - ai_settings table:
create table ai_settings (
  id uuid primary key default gen_random_uuid(),
  content_provider text default 'groq',
  content_model text default 'llama-3.3-70b-versatile',
  content_keys text default '',
  vision_provider text default 'gemini',
  vision_model text default 'gemini-2.0-flash',
  vision_keys text default '',
  brand_name text default '',
  store_type text default 'General',
  target_market text default 'Pakistan',
  tone text default 'Professional',
  language text default 'English',
  custom_instructions text default '',
  auto_content_seo boolean default true,
  auto_media_ai boolean default true,
  updated_at timestamptz default now()
);
insert into ai_settings (id) values (gen_random_uuid());

Migration 4 - Slug columns (if not exists):
alter table products add column if not exists
  slug text unique generated always as
  (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) stored;
alter table categories add column if not exists
  slug text unique generated always as
  (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) stored;

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 2 — UPLOAD IMAGE UTILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update /lib/uploadImage.ts:
- Accept file and bucket params
- Validate: jpg, jpeg, png, webp, avif only
- Convert to WebP always using sharp or browser API
- Generate filename: originalname-timestamp.webp
  Example: blue-shirt-1718123456789.webp
- Check if filename exists in bucket
- If exists: add -2 suffix
- Upload to Supabase storage
- Save to media_library table
- Return full public URL
- try/catch with error messages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 3 — AI ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create /lib/aiEngine.ts:

Support these providers with correct API formats:

TEXT providers (OpenAI compatible format):
- groq: https://api.groq.com/openai/v1/chat/completions
- cerebras: https://api.cerebras.ai/v1/chat/completions
- mistral: https://api.mistral.ai/v1/chat/completions
- deepseek: https://api.deepseek.com/v1/chat/completions
- openrouter: https://openrouter.ai/api/v1/chat/completions
- together: https://api.together.xyz/v1/chat/completions
- fireworks: https://api.fireworks.ai/inference/v1/chat/completions
- siliconflow: https://api.siliconflow.cn/v1/chat/completions
- nvidia: https://integrate.api.nvidia.com/v1/chat/completions
- openai: https://api.openai.com/v1/chat/completions
- kimi: https://api.moonshot.cn/v1/chat/completions
- qwen: https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions

Gemini (different format):
- gemini: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent

Anthropic (different format):
- anthropic: https://api.anthropic.com/v1/messages

Cloudflare Workers AI (different format):
- cloudflare: https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/ai/run/{model}

Key rotation logic:
1. Get settings from ai_settings table
2. Split keys by newline → array
3. Try key[0] → 429/503/402 error → try key[1] → etc
4. Throw error if all keys fail
5. Export: callAI(prompt, system, isVision?)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 4 — SEO PROMPTS BUILDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create /lib/seoPrompts.ts:

buildSystemPrompt(settings):
Uses: brand_name, store_type, target_market,
tone, language, custom_instructions
Returns complete system prompt string

buildSEOPrompt(type, data):
type = 'product' | 'category' | 'page'

Required JSON response fields:
{
  "seo_title": "max 60 chars keyword first",
  "meta_description": "exactly 150-160 chars + CTA",
  "focus_keyword": "primary keyword",
  "secondary_keywords": "5 keywords comma separated",
  "lsi_tags": "12 LSI tags comma separated",
  "og_title": "Facebook/Instagram OG title",
  "og_description": "150-200 chars",
  "twitter_title": "Twitter/X card title",
  "twitter_description": "Twitter card description",
  "image_alt": "descriptive alt with keyword",
  "long_description": "1000+ words valid HTML h2 ul p",
  "faq_schema": [{"q":"question","a":"answer"}],
  "pinterest_description": "rich pin description"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 5 — API ROUTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/api/seo/optimize/route.ts (POST):
Body: { entity_type, entity_id, title, context }
→ Get ai_settings from DB
→ Build system prompt + seo prompt
→ callAI()
→ Parse JSON response
→ Save to seo_meta table
→ pingIndexNow for that URL
→ Return generated data
→ try/catch

/app/api/seo/bulk/route.ts (POST):
Body: { items: [...], }
→ Process sequentially (not parallel)
→ 500ms delay between each (rate limit safe)
→ Return { success, failed, results }

/app/api/media/upload/route.ts (POST):
→ Receive file
→ Call uploadImage()
→ If auto_media_ai ON → call AI meta
→ Save to media_library
→ Return URL + meta

/app/api/media/ai-meta/route.ts (POST):
Body: { image_url, media_id }
→ Fetch image as base64
→ Call vision AI with image
→ Generate: alt_text, seo_filename, title, description, caption
→ Update media_library table
→ Return generated data

/app/api/indexnow/route.ts (POST):
Body: { urls: string[] }
→ POST to https://api.indexnow.org/IndexNow
→ Notify Bing + Yandex + Naver + Seznam
→ Return result

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 6 — ADMIN SEO PAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/admin/seo/page.tsx (Dashboard):
- Stats: Total/Optimized/Pending per type
- Progress bars
- IndexNow pings counter
- Bulk optimize all pending button

/app/admin/seo/products/page.tsx:
- Table: name, seo_title, focus_kw, status badge
- Search + filter (All/Optimized/Pending)
- Checkbox bulk select
- Bulk Optimize button
- Per row: Optimize + Preview + Edit buttons
- On optimize: call /api/seo/optimize
- Preview modal: Google/FB/Twitter/WhatsApp tabs
- Character count warnings per field
- Pagination 20 per page

/app/admin/seo/categories/page.tsx:
- Same as products page for categories

/app/admin/seo/settings/page.tsx:

CONTENT SEO section:
- Provider dropdown (grouped: FREE/CHEAP/PREMIUM)
  Options: groq, gemini, cerebras, mistral,
  cloudflare, nvidia, deepseek, openrouter,
  together, fireworks, siliconflow, openai,
  anthropic, kimi, minimax, qwen
- Model dropdown (text models for selected provider)
- API Keys textarea (1 per line)

IMAGE SEO section:
- Same provider dropdown
- Model dropdown (vision models ONLY for selected provider)
- API Keys textarea (1 per line)

Vision models per provider:
groq: meta-llama/llama-4-scout-17b-16e-instruct
gemini: gemini-2.0-flash, gemini-1.5-flash, gemini-1.5-pro
mistral: mistral-small-2506, ministral-8b-2512, mistral-medium-2508
cerebras: llama-4-scout-17b-16e-instruct
cloudflare: @cf/meta/llama-3.2-11b-vision-instruct,
            @cf/meta/llama-4-scout-17b-16e-instruct,
            @cf/mistralai/mistral-small-3.1-24b-instruct
nvidia: meta/llama-3.2-11b-vision-instruct,
        meta/llama-3.2-90b-vision-instruct,
        meta/llama-4-maverick-17b-128e-instruct
openai: gpt-4o

STORE SETTINGS section:
- Brand Name input
- Store Type: Kids/Adults/Men/Women/General
- Target Market: Pakistan/Global/Custom
- Tone: Professional/Catchy/Hinglish/Educational
- Language: English/Urdu Roman/Both
- Custom Instructions textarea

AUTO MODES section:
- Auto Content SEO toggle
- Auto Media AI toggle

Save → ai_settings table update

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 7 — MEDIA LIBRARY PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/admin/media/page.tsx:
- Upload button → calls upload API
- Global AI toggle
- Grid view from media_library table
- Per image card:
  - Thumbnail
  - AI status badge (Generated/Pending)
  - Alt text preview
  - Generate AI Meta button
  - AI toggle per image
  - Edit alt text inline
- Bulk select + Bulk Generate AI
- On upload: auto AI if global toggle ON

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 8 — FRONTEND SEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app/layout.tsx root:
- Default OG image: /og-default.jpg
- twitter:card = summary_large_image
- twitter:site = NEXT_PUBLIC_TWITTER_HANDLE
- google-site-verification meta tag from ENV

app/page.tsx (Homepage):
- generateMetadata:
  title: BRAND_NAME + tagline
  description: 160 chars
  og:image: fetch latest banner from banners table
  tags: ['homepage', 'banners']
  revalidate: 600

app/product/[slug]/page.tsx:
- generateMetadata:
  Fetch seo_meta first → use if exists → fallback to product data
  title: seo_title or product.name + BRAND_NAME
  description: meta_description or product.description[:160]
  og:title, og:description, og:image
  twitter title/description/image
  pinterest: product:price, product:availability
  canonical: SITE_URL/products/[slug] (no query params)
  robots: index + follow
  revalidate: 60
  tags: [product-${slug}]

- JSON-LD:
  Product schema with price/availability/brand
  BreadcrumbList: Home > Category > Product
  FAQPage from faq_schema field

app/category/[slug]/page.tsx:
- generateMetadata:
  Fetch seo_meta first → use if exists
  title: seo_title or category.name + BRAND_NAME
  description: meta_description or category.description
  og:image: category.image_url
  canonical: SITE_URL/category/[slug]
  revalidate: 300
  tags: [category-${slug}]

- JSON-LD:
  BreadcrumbList: Home > Category

app/cart + checkout + account pages:
  robots: { index: false, follow: false }
  revalidate: 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 9 — SEO FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/sitemap.ts:
- All products: /products/[slug] priority 0.7 daily
  Include image: { url, title, caption }
- All categories: /category/[slug] priority 0.8 weekly
- Homepage: / priority 1.0 daily
- /about priority 0.5 monthly
- /contact priority 0.5 monthly
Use NEXT_PUBLIC_SITE_URL for all URLs

/app/robots.ts:
Allow: all public pages + ALL AI crawlers:
GPTBot, OAI-SearchBot, PerplexityBot,
Google-Extended, ClaudeBot, Applebot-Extended,
Bingbot, Googlebot
Disallow: /admin /cart /checkout /account /api
Sitemap: SITE_URL/sitemap.xml

/public/llms.txt:
# {BRAND_NAME}
> {store description}
## Products [dynamic top 20 from DB]
## Categories [all categories]

/public/[INDEXNOW_API_KEY].txt:
Content: just the INDEXNOW_API_KEY value

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 10 — BREADCRUMB COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/components/Breadcrumb.tsx:
Props: items: [{label: string, href: string}]
- Visual breadcrumb with clickable links
- BreadcrumbList JSON-LD schema inside component
- Use actual SITE_URL hrefs not placeholders
- Match store design
Use on all product + category pages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 11 — IMAGE ALT TEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Find ALL next/image in store:
- Product images: alt={product.name}
- Category images: alt={category.name}
- Banner images: alt={banner.title}
- Logo: alt={NEXT_PUBLIC_BRAND_NAME}
Never empty alt=""

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 12 — ADMIN PRODUCT/CATEGORY FORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update admin create/edit forms:
- Slug auto-generate from name as user types
- Slug field editable manually
- Slug preview: /products/blue-cotton-shirt
- On save: if auto_content_seo ON → call /api/seo/optimize
- On save: call pingIndexNow for that URL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 13 — NEXT.CONFIG.TS UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update next.config.ts (keep existing config):
images:
  formats: ['image/avif', 'image/webp']
  minimumCacheTTL: 60
  remotePatterns: add *.supabase.co

Add headers:
/_next/static/* → immutable 1 year
/fonts/* → immutable 1 year
/cart → no-store
/checkout → no-store
/account/* → no-store
/* → s-maxage=60, stale-while-revalidate=600

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 14 — INDEXNOW UTILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/lib/indexNow.ts:
export async function pingIndexNow(urls: string[]) {
  POST to https://api.indexnow.org/IndexNow
  Body: { host, key, keyLocation, urlList: urls }
  key = INDEXNOW_API_KEY env
  1 call = Bing + Yandex + Naver + Seznam all!
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER ALL TASKS DONE - TELL ME:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. All files created/modified list
2. All migrations created list
3. Supabase webhook setup steps for new tables
4. ENV variables I need to add
5. Manual steps I need to do:
   - Google Search Console
   - Bing Webmaster
   - IndexNow key setup
```

## PROMPT END ↑

---

## Tera Manual Kaam (Prompt ke baad):

```
SEARCH ENGINES (Ek baar sirf):

Step 1 - Google Search Console:
search.google.com/search-console
→ Add Property
→ HTML tag verify (layout.tsx mein paste)
→ Sitemap submit: site.com/sitemap.xml

Step 2 - Bing Webmaster:
bing.com/webmasters
→ Sign in Microsoft account
→ "Import from Google Console" ← Shortcut!
→ Done! Yahoo + DuckDuckGo + ChatGPT bhi ✅

Step 3 - IndexNow Key:
bing.com/indexnow/getstarted
→ Generate key
→ Download key file
→ /public/[key].txt mein rakho
→ INDEXNOW_API_KEY ENV mein add karo

ENV Variables (Vercel + .env.local):
NEXT_PUBLIC_BRAND_NAME=TotVogue
NEXT_PUBLIC_SITE_URL=https://teri-site.vercel.app
NEXT_PUBLIC_CURRENCY=PKR
NEXT_PUBLIC_TWITTER_HANDLE=@TotVogue
GOOGLE_SITE_VERIFICATION=xxx
INDEXNOW_API_KEY=xxx
CF_ACCOUNT_ID=xxx (sirf Cloudflare AI use karo to)

SUPABASE WEBHOOKS (New tables ke liye):
seo_meta → revalidate URL add karo
(Same URL + secret as existing webhooks)

AI KEYS (Admin → SEO Settings mein):
Free:
- Groq: console.groq.com
- Gemini: aistudio.google.com
- Cerebras: inference.cerebras.ai
```
