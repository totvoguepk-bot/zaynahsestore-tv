# Zaynahs SEO + AI System - Complete Guide
# Cache + Webhook + SEO + AI + All Platforms
# Version: Final - Kuch Miss Nahi!

---

# OVERVIEW - Poora System

```
SYSTEM 1 — Cache + Webhook (Already Discussed):
Cloudflare + Vercel + Browser + Supabase Webhook
Admin change → Auto cache clear sab jagah

SYSTEM 2 — Content SEO + AI:
Products/Categories/Pages
Text AI models
Auto + Manual mode
All platforms: Google/FB/Twitter/LLM etc

SYSTEM 3 — Image SEO + Media Library:
Images WebP format
Vision AI models
Auto on upload + Manual
Alt, filename, description auto
```

---

# ═══════════════════════════════
# PART 1 — IMAGE SYSTEM
# ═══════════════════════════════

## Image Format Rules

```
Upload ho → WebP convert ho → Save ho

Filename convention:
banner-1718123456.webp ✅
product-shirt-1718123456.webp ✅

Extension hamesha .webp
Timestamp hamesha add karo

Next.js config mein:
formats: ['image/avif', 'image/webp']

Next.js auto decide karta hai:
Browser AVIF support → AVIF serve
Browser WebP only → WebP serve
Tera file WebP rahega ✅
```

## uploadImage() Function Rules

```javascript
// /lib/uploadImage.ts

async function uploadImage(file, bucket) {
  // 1. Validate format
  const allowed = ['image/jpeg','image/jpg','image/png','image/webp','image/avif']
  
  // 2. Convert to WebP (always!)
  const webpBlob = await convertToWebP(file)
  
  // 3. Generate filename with timestamp
  const baseName = file.name.replace(/\.[^.]+$/, '')
  const timestamp = Date.now()
  const seoName = `${baseName}-${timestamp}.webp`
  
  // 4. Check if exists in bucket
  const exists = await checkExists(seoName, bucket)
  const finalName = exists ? `${baseName}-${timestamp}-2.webp` : seoName
  
  // 5. Upload to Supabase storage
  // 6. Return full public URL
}
```

---

# ═══════════════════════════════
# PART 2 — AI PROVIDERS
# ═══════════════════════════════

## TEXT Models (Content SEO)

### FREE:
```
GROQ:
URL: https://api.groq.com/openai/v1/chat/completions
Format: OpenAI compatible
Models:
- llama-3.3-70b-versatile ← best free
- llama-3.1-8b-instant ← fastest
- openai/gpt-oss-120b
- openai/gpt-oss-20b
- qwen/qwen3-32b
Limit: 1000 req/day free

GEMINI:
URL: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
Format: Gemini specific
Models:
- gemini-2.0-flash ← best free
- gemini-1.5-flash
- gemini-1.5-pro
- gemma-3-27b
Limit: 1500 req/day ← most generous!

CEREBRAS:
URL: https://api.cerebras.ai/v1/chat/completions
Format: OpenAI compatible
Models:
- llama-3.3-70b ← 2600 t/s fastest!
- gpt-oss-120b
- qwen-3-32b
Limit: 1M tokens/day free

MISTRAL:
URL: https://api.mistral.ai/v1/chat/completions
Format: OpenAI compatible
Models:
- mistral-small-2506 ← best (text+vision)
- devstral-2512
- ministral-3b-2512 ← fastest
- open-mistral-nemo
Limit: 2.25M TPM free

CLOUDFLARE WORKERS AI:
URL: https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/ai/run/{model}
Format: Cloudflare specific
Models:
- @cf/meta/llama-3.3-70b-instruct
- @cf/openai/gpt-oss-120b
- @cf/moonshotai/kimi-k2.6
- @cf/google/gemma-4-26b-a4b-it
- @cf/nvidia/nemotron-3-super-120b-a12b
Limit: 10,000 neurons/day free
Extra ENV: CF_ACCOUNT_ID

NVIDIA NIM:
URL: https://integrate.api.nvidia.com/v1/chat/completions
Format: OpenAI compatible
Models:
- meta/llama-3.3-70b-instruct
- qwen/qwen3-235b-a22b
- nvidia/nemotron-3-super-49b-v1
- nvidia/llama-3.3-nemotron-super-49b-v1
Limit: Free endpoint available
```

### CHEAP:
```
DEEPSEEK:
URL: https://api.deepseek.com/v1/chat/completions
Format: OpenAI compatible
Models:
- deepseek-v4-flash ← $0.14/1M cheapest!
- deepseek-v4-pro ← $0.435/1M
Limit: No free tier, very cheap

OPENROUTER:
URL: https://openrouter.ai/api/v1/chat/completions
Format: OpenAI compatible
Free Models (add :free):
- deepseek/deepseek-r1:free
- meta-llama/llama-3.3-70b-instruct:free
- qwen/qwen2.5-72b-instruct:free
- google/gemma-3-27b-it:free
Limit: 20 req/min, 200 req/day free

TOGETHER AI:
URL: https://api.together.xyz/v1/chat/completions
Format: OpenAI compatible
Models: llama, qwen, mixtral
Limit: Cheap pay-as-you-go

FIREWORKS AI:
URL: https://api.fireworks.ai/inference/v1/chat/completions
Format: OpenAI compatible
Models: llama, qwen (fast + cheap)

SILICONFLOW:
URL: https://api.siliconflow.cn/v1/chat/completions
Format: OpenAI compatible
Models: qwen, deepseek, llama (cheap)
```

### PREMIUM PAID:
```
OPENAI:
URL: https://api.openai.com/v1/chat/completions
Models: gpt-4o-mini, gpt-4o, gpt-4-turbo

ANTHROPIC:
URL: https://api.anthropic.com/v1/messages
Format: Anthropic specific (different!)
Models: claude-3-5-haiku, claude-3-5-sonnet

KIMI/MOONSHOT:
URL: https://api.moonshot.cn/v1/chat/completions
Models: kimi-k2.6, moonshot-v1-8k

MINIMAX:
URL: https://api.minimax.chat/v1/text/chatcompletion_v2
Models: minimax-m2.7

QWEN/ALIBABA:
URL: https://dashscope.aliyuncs.com/compatible-mode/v1
Models: qwen3-122b, qwen3-32b
```

---

## VISION Models (Image SEO)

### FREE VISION:
```
GROQ VISION:
- meta-llama/llama-4-scout-17b-16e-instruct ✅

GEMINI VISION:
- gemini-2.0-flash ✅ (same as text!)
- gemini-1.5-flash ✅
- gemini-1.5-pro ✅

MISTRAL VISION:
- mistral-small-2506 ✅ (same as text!)
- ministral-8b-2512 ✅
- mistral-medium-2508 ✅

CEREBRAS VISION:
- llama-4-scout-17b-16e-instruct ✅

CLOUDFLARE VISION:
- @cf/meta/llama-3.2-11b-vision-instruct ✅
- @cf/meta/llama-4-scout-17b-16e-instruct ✅
- @cf/mistralai/mistral-small-3.1-24b-instruct ✅
- @cf/google/gemma-4-26b-a4b-it ✅

NVIDIA NIM VISION:
- meta/llama-3.2-11b-vision-instruct ✅
- meta/llama-3.2-90b-vision-instruct ✅
- meta/llama-4-maverick-17b-128e-instruct ✅
```

### PAID VISION:
```
OPENAI VISION: gpt-4o ✅
OPENROUTER: various vision models
```

---

## Key Rotation Logic

```javascript
// /lib/aiEngine.ts

export async function callAI(prompt, systemPrompt, isVision = false) {
  // DB se settings lo
  const settings = await getAISettings()
  const provider = isVision ? settings.vision_provider : settings.content_provider
  const model = isVision ? settings.vision_model : settings.content_model
  const keysRaw = isVision ? settings.vision_keys : settings.content_keys
  
  // Keys array banao
  const keys = keysRaw.split('\n').map(k => k.trim()).filter(Boolean)
  
  // Har key try karo
  for (let i = 0; i < keys.length; i++) {
    try {
      const result = await callProvider(provider, model, keys[i], prompt, systemPrompt)
      if (result) {
        await saveLastKeyIndex(i) // next time next key se start
        return result
      }
    } catch (err) {
      // Rate limit ya quota → next key
      if (err.status === 429 || err.status === 503 || err.status === 402) {
        continue
      }
      throw err // aur koi error = stop
    }
  }
  throw new Error(`All ${provider} API keys exhausted`)
}
```

---

## Admin Settings UI

```
/admin/seo/settings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT SEO AI SETTINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Provider Dropdown (grouped):
── FREE ─────────────────────
  Groq
  Gemini
  Cerebras
  Mistral
  Cloudflare Workers AI
  NVIDIA NIM
── CHEAP ────────────────────
  DeepSeek
  OpenRouter
  Together AI
  Fireworks AI
  SiliconFlow
── PREMIUM ──────────────────
  OpenAI
  Anthropic
  Kimi/Moonshot
  MiniMax
  Qwen/Alibaba

Model Dropdown:
(Provider select hone pe
 sirf us provider ke TEXT models show hon)

API Keys Textarea:
(1 key per line)
key_1
key_2
key_3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMAGE SEO AI SETTINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Provider Dropdown: (same list)
Model Dropdown:
(Sirf VISION models show hon selected provider ke)

API Keys Textarea: (1 per line)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STORE SETTINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Brand Name:     [TotVogue      ]
Store Type:     [Kids ▼] Kids/Adults/Men/Women/General
Target Market:  [Pakistan ▼] Pakistan/Global/Custom
AI Tone:        [Professional ▼]
  Professional / Catchy & Salesy / Hinglish / Educational
Language:       [English ▼]
  English / Urdu Roman / Both

Custom Instructions:
[textarea]
"We specialize in Eid wear, school uniforms..."
(Yeh har AI call mein system prompt mein add hoga)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUTO MODES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Auto Content SEO: [ON ●]
(Product/Category save pe auto run)

Auto Media AI: [ON ●]
(Image upload pe auto run)

[Save Settings]
```

---

## System Prompt Builder

```javascript
// /lib/seoPrompts.ts

export function buildSystemPrompt(settings) {
  return `
You are an expert SEO copywriter for ${settings.brand_name}.
Store Type: ${settings.store_type} clothing store
Target Market: ${settings.target_market}
Tone: ${settings.tone}
Language: ${settings.language}
${settings.custom_instructions ? 
  `\nSpecial Instructions: ${settings.custom_instructions}` : ''}

STRICT RULES:
- Focus keyword MUST appear in first sentence
- Use focus keyword 3-4 times naturally
- long_description: minimum 1000 words valid HTML
- Use <h2>, <ul>, <li>, <p> tags properly
- Include 2-3 internal links using ${settings.site_url}
- NO placeholder text anywhere
- Return ONLY valid JSON, no markdown backticks
- All content must be ${settings.language}
`
}

export function buildSEOPrompt(type, data) {
  if (type === 'product') {
    return `Generate complete SEO data for this product:
Name: ${data.name}
Description: ${data.description || 'Not provided'}
Price: ${data.price} ${data.currency}
Category: ${data.category}
Stock: ${data.stock > 0 ? 'In Stock' : 'Out of Stock'}

Return ONLY this JSON:
{
  "seo_title": "max 60 chars, keyword first",
  "meta_description": "exactly 150-160 chars, ends with CTA",
  "focus_keyword": "primary keyword phrase",
  "secondary_keywords": "kw1, kw2, kw3, kw4, kw5",
  "lsi_tags": "12 comma separated LSI tags",
  "og_title": "OG title for Facebook/Instagram",
  "og_description": "150-200 chars OG description",
  "twitter_title": "Twitter/X card title",
  "twitter_description": "Twitter card description",
  "image_alt": "descriptive alt text with keyword",
  "long_description": "1000+ word HTML content",
  "faq_schema": [{"q": "question", "a": "answer"}],
  "pinterest_description": "rich pin description"
}`
  }
  // category, page types same pattern...
}
```

---

# ═══════════════════════════════
# PART 3 — WHAT AI GENERATES
# ═══════════════════════════════

## Content SEO Fields:
```
seo_title           → max 60 chars, keyword first
meta_description    → exactly 150-160 chars + CTA
focus_keyword       → primary keyword
secondary_keywords  → 5 keywords
lsi_tags            → 12 LSI tags
og_title            → Facebook/Instagram title
og_description      → OG description 150-200 chars
twitter_title       → Twitter/X card title
twitter_description → Twitter card description
image_alt           → descriptive alt with keyword
long_description    → 1000+ word HTML
faq_schema          → Q&A for LLM visibility
pinterest_description → Rich pin description
```

## Image SEO Fields:
```
alt_text         → descriptive SEO alt
seo_filename     → blue-cotton-shirt-kids-1718123456.webp
title            → image title tag
description      → 150 word image description
caption          → short caption
```

---

# ═══════════════════════════════
# PART 4 — ALL PLATFORMS SEO
# ═══════════════════════════════

## Google Search:
```javascript
// generateMetadata every page:
title: seoData.seo_title || product.name + ' | ' + BRAND_NAME
description: seoData.meta_description
keywords: seoData.lsi_tags
canonical: SITE_URL + '/products/' + slug (no query params!)
robots: index + follow (public pages)
robots: noindex + nofollow (cart/checkout/admin/account)
```

## Facebook + Instagram + WhatsApp:
```javascript
// Same OG tags sab read karte hain:
og:title → seoData.og_title
og:description → seoData.og_description
og:image → product.image_url (1200x630 ideal)
og:type → product
og:site_name → BRAND_NAME
og:url → canonical URL
```

## Twitter/X Cards:
```javascript
twitter:card → summary_large_image
twitter:title → seoData.twitter_title
twitter:description → seoData.twitter_description
twitter:image → product.image_url
twitter:site → @TWITTER_HANDLE
```

## Pinterest Rich Pins:
```javascript
og:type → product
product:price:amount → product.price
product:price:currency → PKR
product:availability → in stock / out of stock
product:retailer_item_id → product.id
```

## LinkedIn:
```
Same OG tags automatically use karta hai ✅
Alag kuch nahi karna
```

## LLM Platforms (ChatGPT/Gemini/Perplexity/Claude):
```
robots.txt mein ALLOW karo:
GPTBot          → ChatGPT training
OAI-SearchBot   → ChatGPT search (Bing via)
PerplexityBot   → Perplexity
Google-Extended → Gemini AI Overviews
ClaudeBot       → Claude
Applebot-Extended → Apple AI

/llms.txt banao:
# Brand Name
> Store description
## Products [list]
## Categories [list]

FAQ Schema → LLM citations ke liye best!
```

## Google Shopping:
```javascript
// Product JSON-LD:
{
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image_url,
  "brand": { "@type": "Brand", "name": BRAND_NAME },
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "PKR",
    "availability": "InStock or OutOfStock",
    "url": SITE_URL + '/products/' + slug
  }
}
```

---

# ═══════════════════════════════
# PART 5 — SEARCH ENGINE SUBMISSION
# ═══════════════════════════════

## Coverage Map:
```
Tu submit kare:          Automatically cover hoga:
─────────────────────    ──────────────────────────
Google Search Console → Google + Google AI Overviews
Bing Webmaster Tools  → Bing + Yahoo + DuckDuckGo
IndexNow API          → Bing + Yandex + Naver + Seznam
                        = ChatGPT search bhi! (Bing via)

Optional:
Yandex Webmaster      → Yandex (Russia)
Baidu Webmaster       → Baidu (China)
```

## Tera Manual Kaam - Ek Baar:

### Google Search Console:
```
1. search.google.com/search-console
2. Add Property → teri-site.com
3. Verify: HTML tag method
   Next.js layout.tsx mein add karo:
   ENV: GOOGLE_SITE_VERIFICATION=xxx
   <meta name="google-site-verification" content={env} />
4. Indexing → Sitemaps →
   Submit: https://teri-site.com/sitemap.xml
5. Done! ✅
```

### Bing Webmaster Tools:
```
1. bing.com/webmasters
2. Sign in Microsoft account
3. "Import from Google Search Console" ← SHORTCUT!
   (Sab auto import hota hai!)
4. Ya manually: Add site → HTML tag verify
5. Sitemaps → Submit URL
6. Done! Yahoo + DuckDuckGo + ChatGPT search bhi ✅
```

### IndexNow Setup:
```
1. bing.com/indexnow/getstarted
2. Generate API Key
3. Key file download karo
4. /public/[key-value].txt mein rakho
   File content: sirf key value
5. ENV mein add karo:
   INDEXNOW_API_KEY=generated_key_value
6. Agent /lib/indexNow.ts banayega
   New product/category → Auto ping
   = Bing + Yandex + Naver instant notify! ✅
```

### Yandex (Optional):
```
webmaster.yandex.com
→ Add Site → Verify → Sitemap submit
```

---

## IndexNow Auto System (Agent Banayega):
```javascript
// /lib/indexNow.ts
export async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_API_KEY
  await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: process.env.NEXT_PUBLIC_SITE_URL,
      key: key,
      keyLocation: `${SITE_URL}/${key}.txt`,
      urlList: urls
    })
  })
  // 1 call = Bing + Yandex + Naver + Seznam sab!
}

// Product/Category save pe auto call:
await pingIndexNow([`${SITE_URL}/products/${slug}`])
```

---

# ═══════════════════════════════
# PART 6 — SITEMAP SYSTEM
# ═══════════════════════════════

```javascript
// /app/sitemap.ts
export default async function sitemap() {
  const products = await getAllProducts()
  const categories = await getAllCategories()
  
  return [
    // Static pages
    {
      url: SITE_URL,
      priority: 1.0,
      changeFrequency: 'daily',
      lastModified: new Date()
    },
    {
      url: `${SITE_URL}/about`,
      priority: 0.5,
      changeFrequency: 'monthly'
    },
    {
      url: `${SITE_URL}/contact`,
      priority: 0.5,
      changeFrequency: 'monthly'
    },
    
    // All products with image info
    ...products.map(p => ({
      url: `${SITE_URL}/products/${p.slug}`,
      priority: 0.7,
      changeFrequency: 'daily',
      lastModified: p.updated_at,
      images: [{
        url: p.image_url,
        title: p.name,
        caption: p.seo_meta?.image_alt || p.name
      }]
    })),
    
    // All categories
    ...categories.map(c => ({
      url: `${SITE_URL}/category/${c.slug}`,
      priority: 0.8,
      changeFrequency: 'weekly',
      lastModified: c.updated_at
    }))
  ]
}
```

---

# ═══════════════════════════════
# PART 7 — ROBOTS.TXT
# ═══════════════════════════════

```javascript
// /app/robots.ts
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin', '/admin/',
          '/cart', '/checkout',
          '/account', '/account/',
          '/api', '/api/'
        ]
      },
      // AI Crawlers - sab allow karo!
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`
  }
}
```

---

# ═══════════════════════════════
# PART 8 — PREVIEW SYSTEM
# ═══════════════════════════════

## Admin Preview UI:
```
/admin/seo/products/[id] pe:

Tab buttons:
[Google] [Facebook] [Twitter] [WhatsApp]
[Instagram] [Pinterest] [LinkedIn]

GOOGLE TAB:
┌──────────────────────────────────────────┐
│ site.com › products › blue-cotton-shirt  │
│ Blue Cotton Shirt for Kids | TotVogue    │
│ Premium quality blue cotton shirt for    │
│ kids. Perfect for school and casual...   │
└──────────────────────────────────────────┘
Title:       45/60 chars 🟢 Perfect
Description: 155/160 chars 🟢 Perfect

FACEBOOK/INSTAGRAM TAB:
┌──────────────────────────────────────────┐
│ [Product Image 1200x630]                 │
│ Blue Cotton Shirt for Kids               │
│ Premium quality blue cotton...           │
│ site.com                                 │
└──────────────────────────────────────────┘

TWITTER TAB:
┌──────────────────────────────────────────┐
│ [Large Image Card]                       │
│ Blue Cotton Shirt for Kids               │
│ Premium quality blue cotton...           │
│ @TotVogue                                │
└──────────────────────────────────────────┘

Character warnings:
🟢 Perfect (right range)
🟡 Too short (needs more)
🔴 Too long (will be cut off)

[✨ Regenerate AI] [💾 Save]
```

---

# ═══════════════════════════════
# PART 9 — ADMIN PAGES STRUCTURE
# ═══════════════════════════════

```
/admin/seo                      → Dashboard
/admin/seo/products             → Products SEO list
/admin/seo/categories           → Categories SEO list
/admin/seo/pages                → Static pages SEO
/admin/seo/settings             → AI + Store settings
/admin/media                    → Media Library + Image AI
```

## SEO Dashboard:
```
Stats Cards:
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Products  │ │Categories│ │  Pages   │ │  Total   │
│ 40/45    │ │  8/8     │ │  3/4     │ │  89%     │
│ 🟢 89%  │ │ 🟢 100%  │ │ 🟡 75%   │ │ ●●●●○    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

IndexNow pings today: 12
Sitemap last updated: 2 min ago
[Bulk Optimize All Pending →]
```

## Products/Categories List Page:
```
Search: [___________] Filter: [All ▼] [Pending ▼]

☐ [Select All]  [Bulk Optimize Selected]

─────────────────────────────────────────────────
☐ Blue Cotton Shirt | Title: 45ch ✅ | 🟢 Done
   Focus KW: kids cotton shirt pakistan
   [View Preview] [Edit] [Re-optimize]

☐ Red Silk Dress   | No SEO data    | 🔴 Pending
   [Optimize Now ✨]

─────────────────────────────────────────────────
Page: [1] [2] [3]  20 per page
```

## Media Library Page:
```
Global AI: [ON ●]    [Upload Images]   [Bulk AI Meta]

Grid View:
┌────────┐ ┌────────┐ ┌────────┐
│[Image] │ │[Image] │ │[Image] │
│🟢 AI  │ │🔴 None │ │🟢 AI  │
│Alt: .. │ │[Gen AI]│ │Alt: .. │
│AI: ON  │ │AI: OFF │ │AI: ON  │
└────────┘ └────────┘ └────────┘
```

---

# ═══════════════════════════════
# PART 10 — SUPABASE TABLES
# ═══════════════════════════════

```sql
-- seo_meta table:
create table seo_meta (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null, -- 'product'|'category'|'page'
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

-- media_library table:
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

-- ai_settings table:
create table ai_settings (
  id uuid primary key default gen_random_uuid(),
  -- Content SEO AI
  content_provider text default 'groq',
  content_model text default 'llama-3.3-70b-versatile',
  content_keys text default '',
  -- Image SEO AI
  vision_provider text default 'gemini',
  vision_model text default 'gemini-2.0-flash',
  vision_keys text default '',
  -- Store Settings
  brand_name text default '',
  store_type text default 'General',
  target_market text default 'Pakistan',
  tone text default 'Professional',
  language text default 'English',
  custom_instructions text default '',
  -- Auto modes
  auto_content_seo boolean default true,
  auto_media_ai boolean default true,
  updated_at timestamptz default now()
);
insert into ai_settings (id) values (gen_random_uuid());
```

---

# ═══════════════════════════════
# PART 11 — WEBHOOK RULES
# ═══════════════════════════════

## Webhook Tables:
```
✅ products table    → Webhook LAGAO (public cache)
✅ banners table     → Webhook LAGAO (public cache)
✅ categories table  → Webhook LAGAO (public cache)
✅ seo_meta table    → Webhook LAGAO (SEO data changes)
✅ ai_settings table → Webhook LAGAO (settings update)

❌ orders table      → NO webhook (private data)
❌ users/profiles    → NO webhook (private)
❌ payments          → NO webhook (sensitive)
❌ cart              → NO webhook (real-time)
❌ media_library     → NO webhook (no page cache)
```

## Rule:
```
Kya yeh table ka data public page pe cache hota hai?
YES → Webhook lagao
NO  → Webhook mat lagao
```

---

# ═══════════════════════════════
# PART 12 — ENV VARIABLES
# ═══════════════════════════════

```bash
# .env.local + Vercel dono mein:

# Already have:
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Cache System:
REVALIDATE_SECRET=random_string
CLOUDFLARE_ZONE_ID=xxx
CLOUDFLARE_API_TOKEN=xxx

# SEO System:
NEXT_PUBLIC_BRAND_NAME=TotVogue
NEXT_PUBLIC_SITE_URL=https://teri-site.vercel.app
NEXT_PUBLIC_CURRENCY=PKR
NEXT_PUBLIC_TWITTER_HANDLE=@TotVogue
GOOGLE_SITE_VERIFICATION=xxx
INDEXNOW_API_KEY=xxx

# Cloudflare Workers AI (if used):
CF_ACCOUNT_ID=xxx
```

---

# ═══════════════════════════════
# PART 13 — COMPLETE CHECKLIST
# ═══════════════════════════════

## Agent Ka Kaam:
```
AI ENGINE:
□ /lib/aiEngine.ts         → Key rotation all providers
□ /lib/visionEngine.ts     → Image AI all vision providers
□ /lib/seoPrompts.ts       → Prompt builder from settings
□ /lib/uploadImage.ts      → WebP convert + timestamp + upload
□ /lib/indexNow.ts         → IndexNow ping utility
□ /lib/revalidate.ts       → Vercel + Cloudflare cache clear

SUPABASE MIGRATIONS:
□ seo_meta table
□ media_library table
□ ai_settings table
□ slug column products + categories

API ROUTES:
□ /app/api/seo/optimize/route.ts    → Single AI optimize
□ /app/api/seo/bulk/route.ts        → Bulk optimize
□ /app/api/media/upload/route.ts    → Upload + WebP + AI
□ /app/api/media/ai-meta/route.ts   → Image AI meta
□ /app/api/revalidate/route.ts      → Cache clear webhook
□ /app/api/indexnow/route.ts        → IndexNow ping

ADMIN PAGES:
□ /app/admin/seo/page.tsx            → Dashboard
□ /app/admin/seo/products/page.tsx   → Products SEO list
□ /app/admin/seo/categories/page.tsx → Categories SEO
□ /app/admin/seo/settings/page.tsx   → AI + Store settings
□ /app/admin/media/page.tsx          → Media Library

FRONTEND SEO:
□ generateMetadata → all pages
□ JSON-LD Product schema → product pages
□ JSON-LD BreadcrumbList → all pages
□ JSON-LD FAQPage → product pages
□ OG tags → all pages
□ Twitter cards → all pages
□ Pinterest meta → product pages
□ Canonical URLs → all pages (no query params)
□ noindex → cart/checkout/admin/account
□ Image alt text → all images everywhere

SEO FILES:
□ /app/sitemap.ts      → With images
□ /app/robots.ts       → AI crawlers allowed
□ /public/llms.txt     → LLM platforms
□ /public/[key].txt    → IndexNow verification

COMPONENTS:
□ /components/Breadcrumb.tsx → With JSON-LD inside

ADMIN PRODUCT/CATEGORY FORM:
□ Slug auto-generate from name
□ Slug manual edit option
□ Slug preview: /products/blue-cotton-shirt
□ Auto SEO trigger on save (if auto mode ON)
□ IndexNow ping on save/update
```

## Tera Manual Kaam:
```
ONE TIME SETUP:
□ Google Search Console → verify + sitemap submit
□ Bing Webmaster → import from Google Console
□ IndexNow key generate → bing.com/indexnow/getstarted
□ ENV variables → .env.local + Vercel

AI KEYS (Admin Settings mein):
□ Groq: console.groq.com → Free API Key
□ Gemini: aistudio.google.com → Free API Key
□ Cerebras: inference.cerebras.ai → Free API Key
□ Mistral: console.mistral.ai → API Key
□ Others as needed

SUPABASE WEBHOOKS:
□ products → revalidate URL
□ banners → revalidate URL
□ categories → revalidate URL
□ seo_meta → revalidate URL
(Same URL + secret + INSERT UPDATE DELETE)
```

---

# GOLDEN RULES - Hamesha Yaad Rakho

```
IMAGE RULES:
1. Hamesha WebP convert karo upload pe
2. Filename hamesha timestamp add karo
3. Extension hamesha .webp
4. next.config.ts mein avif+webp dono rakho

AI RULES:
5. Content SEO = text models sirf
6. Image SEO = vision models sirf
7. Same provider same model key rotate
8. Custom instructions system prompt mein add hon

SEO RULES:
9. Canonical = no query params kabhi nahi
10. Cart/Checkout/Admin = noindex hamesha
11. AI crawlers = kabhi block nahi karna
12. FAQ schema = LLM visibility ke liye zaroori
13. IndexNow = new/updated pe auto ping

SEARCH ENGINE RULES:
14. Google Console = Google + AI Overviews
15. Bing submit = Yahoo + DuckDuckGo + ChatGPT
16. IndexNow = Bing + Yandex + Naver ek call mein

WEBHOOK RULES:
17. Nai public table = naya webhook
18. Private tables = webhook nahi
19. seo_meta table ka bhi webhook lagao

PLATFORM RULES:
20. OG tags = Facebook + Instagram + WhatsApp + LinkedIn
21. Twitter cards = Twitter/X
22. Pinterest meta = product pages pe
23. llms.txt = ChatGPT + Perplexity + Claude
```
