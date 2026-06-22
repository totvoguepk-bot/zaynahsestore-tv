# Settings System - Complete Guide
# Store Settings + Pixels + Tracking + Email + AI
# Single Admin Settings Page - Multiple Tabs

---

# OVERVIEW

```
1 Admin Settings Page = Multiple Tabs

Tab 1 → Store Settings
Tab 2 → Tracking & Pixels
Tab 3 → Social & SEO
Tab 4 → Email/SMTP Settings
Tab 5 → AI Settings (Content + Vision SEO)
Tab 6 → Contact Info

Sab DB (Supabase) mein save hota hai
Admin khud change kare - developer ki zaroorat nahi
```

---

# WHY SETTINGS (DB) vs ENV?

```
ENV mein rakho (.env.local + Vercel):
- Technical secrets, kabhi nahi badalte
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- REVALIDATE_SECRET
- CLOUDFLARE_ZONE_ID / API_TOKEN
- INDEXNOW_API_KEY
- GOOGLE_SITE_VERIFICATION
- NEXT_PUBLIC_SITE_URL

Settings (DB) mein rakho:
- Business values, admin change kare
- Brand name, pixels, email, AI keys
- Pixel ID change karna ho → admin khud kare
- Redeploy ki zaroorat NAHI
```

---

# SUPABASE TABLE - app_settings

```sql
create table app_settings (
  id uuid primary key default gen_random_uuid(),

  -- TAB 1: Store Settings
  brand_name text default '',
  store_type text default 'General', -- Kids/Adults/Men/Women/General
  store_description text default '',
  target_market text default 'Pakistan', -- Pakistan/Global/Custom
  currency text default 'PKR',
  default_og_image text default '',

  -- TAB 2: Tracking & Pixels
  meta_pixel_id text default '',
  ga4_measurement_id text default '',
  gtm_container_id text default '',
  tiktok_pixel_id text default '',
  twitter_pixel_id text default '',
  snapchat_pixel_id text default '',
  pinterest_tag_id text default '',

  -- TAB 3: Social & SEO
  twitter_handle text default '',
  meta_title_suffix text default '',
  facebook_url text default '',
  instagram_url text default '',
  whatsapp_number text default '',

  -- TAB 4: Email/SMTP
  smtp_email text default '',
  smtp_app_password text default '',
  smtp_from_name text default '',
  admin_notification_email text default '',
  email_notifications jsonb default '{
    "welcome": true,
    "password_reset": true,
    "password_changed": true,
    "order_placed": true,
    "order_confirmed": true,
    "order_shipped": true,
    "order_delivered": true,
    "order_cancelled": true,
    "order_refunded": true,
    "review_request": true,
    "admin_new_order": true,
    "admin_low_stock": true,
    "admin_new_customer": true,
    "admin_new_review": true,
    "admin_contact_form": true
  }'::jsonb,
  low_stock_threshold int default 5,

  -- TAB 5: AI Settings (Content SEO)
  content_provider text default 'groq',
  content_model text default 'llama-3.3-70b-versatile',
  content_keys text default '',

  -- TAB 5: AI Settings (Vision/Image SEO)
  vision_provider text default 'gemini',
  vision_model text default 'gemini-2.0-flash',
  vision_keys text default '',

  -- TAB 5: AI Content Settings
  ai_tone text default 'Professional', -- Professional/Catchy/Hinglish/Educational
  ai_language text default 'English', -- English/Urdu Roman/Both
  ai_custom_instructions text default '',
  auto_content_seo boolean default true,
  auto_media_ai boolean default true,

  -- TAB 6: Contact Info
  contact_email text default '',
  contact_phone text default '',
  contact_address text default '',

  updated_at timestamptz default now()
);

insert into app_settings (id) values (gen_random_uuid());
```

---

# TAB 1 — STORE SETTINGS

```
┌─────────────────────────────────────────┐
│ Store Settings                          │
├─────────────────────────────────────────┤
│ Brand Name:        [TotVogue          ] │
│ Store Type:        [Kids ▼]             │
│   Options: Kids/Adults/Men/Women/General│
│ Target Market:     [Pakistan ▼]         │
│   Options: Pakistan/Global/Custom       │
│ Currency:          [PKR ▼]              │
│   Options: PKR/USD/AED/GBP/EUR          │
│ Store Description: [textarea]           │
│   "Premium kids clothing in Pakistan"   │
│ Default OG Image:  [Upload]             │
│   (Fallback jab page ka image na ho)    │
└─────────────────────────────────────────┘
```

## Usage in Code:
```javascript
// Root layout + all generateMetadata mein use hota hai
const settings = await getAppSettings()
title: settings.brand_name + ' | ' + tagline
og:image: page.image || settings.default_og_image
```

---

# TAB 2 — TRACKING & PIXELS

```
┌─────────────────────────────────────────┐
│ Tracking & Pixels                       │
├─────────────────────────────────────────┤
│ Meta Pixel ID:                          │
│ [_____________________] (Facebook/Insta)│
│ Get from: business.facebook.com/        │
│   events_manager2                       │
│                                          │
│ Google Analytics (GA4):                 │
│ [G-XXXXXXXXXX___________]               │
│ Get from: analytics.google.com          │
│                                          │
│ Google Tag Manager:                     │
│ [GTM-XXXXXXX____________]               │
│ Get from: tagmanager.google.com         │
│                                          │
│ TikTok Pixel ID:                        │
│ [_____________________]                │
│ Get from: ads.tiktok.com                │
│                                          │
│ Pinterest Tag ID:                       │
│ [_____________________]                │
│ Get from: ads.pinterest.com             │
│                                          │
│ Snapchat Pixel ID:                      │
│ [_____________________]                │
│                                          │
│ Twitter/X Pixel ID:                     │
│ [_____________________]                │
│                                          │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

## How Pixels Load (Code Logic):
```javascript
// /components/Pixels.tsx in root layout

const settings = await getAppSettings()

// Conditionally render - sirf jo set hain!
{settings.meta_pixel_id && <MetaPixel id={settings.meta_pixel_id} />}
{settings.ga4_measurement_id && <GA4 id={settings.ga4_measurement_id} />}
{settings.gtm_container_id && <GTM id={settings.gtm_container_id} />}
{settings.tiktok_pixel_id && <TikTokPixel id={settings.tiktok_pixel_id} />}
{settings.pinterest_tag_id && <PinterestTag id={settings.pinterest_tag_id} />}

// Empty hai = load nahi hoga = zero overhead
```

## Events to Track (Ecommerce Standard):
```javascript
// Meta Pixel + GA4 standard events:
PageView        → har page load pe
ViewContent     → product page visit
AddToCart       → cart mein add
InitiateCheckout → checkout start
Purchase        → order complete
Search          → search use kare
```

---

# TAB 3 — SOCIAL & SEO

```
┌─────────────────────────────────────────┐
│ Social & SEO Settings                   │
├─────────────────────────────────────────┤
│ Twitter Handle:    [@TotVogue         ] │
│ Meta Title Suffix: [| TotVogue Pakistan]│
│   (Auto add hota hai sab titles mein)   │
│ Facebook URL:      [facebook.com/...  ] │
│ Instagram URL:     [instagram.com/... ] │
│ WhatsApp Number:   [+923001234567     ] │
│   (Floating WhatsApp button ke liye)    │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

---

# TAB 4 — EMAIL/SMTP SETTINGS

```
┌─────────────────────────────────────────────┐
│ Email Settings (Gmail SMTP)                 │
├───────────────────────────────────────────── │
│ Gmail Address:                              │
│ [admin@gmail.com_______________]            │
│                                              │
│ Gmail App Password:                         │
│ [****************______________]            │
│ ⚠️ Normal password NAHI - App Password!     │
│                                              │
│ From Name:                                  │
│ [TotVogue______________________]            │
│                                              │
│ Admin Notification Email:                   │
│ [owner@gmail.com_______________]            │
│ (Yahan admin ko notifications jayengi)      │
│                                              │
│ Low Stock Alert Threshold:                  │
│ [5_____] units                              │
│                                              │
│ [📧 Send Test Email]  [Save]                │
├───────────────────────────────────────────── │
│ EMAIL NOTIFICATIONS (Toggle ON/OFF):        │
├───────────────────────────────────────────── │
│ CUSTOMER EMAILS:                            │
│ ☑ Welcome Email (on register)               │
│ ☑ Password Reset                            │
│ ☑ Password Changed Confirmation             │
│ ☑ Order Placed Confirmation                 │
│ ☑ Order Confirmed (admin approved)          │
│ ☑ Order Shipped + Tracking                  │
│ ☑ Order Delivered                           │
│ ☑ Order Cancelled                           │
│ ☑ Order Refunded                            │
│ ☑ Review Request (after delivery)           │
│                                              │
│ ADMIN EMAILS:                               │
│ ☑ New Order Placed                          │
│ ☑ Low Stock Alert                           │
│ ☑ New Customer Registered                   │
│ ☑ New Review Submitted                      │
│ ☑ Contact Form Submission                   │
└───────────────────────────────────────────── ┘
```

## Gmail App Password - Tera Manual Kaam:
```
1. myaccount.google.com
2. Security → 2-Step Verification ON karo (zaroori!)
3. Security → App Passwords
4. Select app: Mail
5. Select device: Other → "TotVogue Store"
6. Generate
7. 16-digit password copy karo (spaces ke bina)
8. Admin Settings → Email tab → paste karo
9. "Send Test Email" click karo → verify
```

## Why App Password (Not Normal Password)?
```
Normal Gmail password:
❌ Google SMTP block karta hai security ke liye

App Password:
✅ Specifically third-party apps ke liye
✅ Revoke kar sakte ho anytime
✅ Main password safe rehta hai
```

---

# TAB 5 — AI SETTINGS (SEO System se Connected)

```
┌─────────────────────────────────────────┐
│ AI Settings (SEO System)                │
├─────────────────────────────────────────┤
│ CONTENT SEO AI:                         │
│ Provider: [Groq ▼]                      │
│ Model:    [llama-3.3-70b-versatile ▼]   │
│ API Keys (1 per line):                  │
│ [textarea]                              │
│                                          │
│ IMAGE SEO AI:                           │
│ Provider: [Gemini ▼]                    │
│ Model:    [gemini-2.0-flash ▼]          │
│ API Keys (1 per line):                  │
│ [textarea]                              │
│                                          │
│ AI Tone:     [Professional ▼]           │
│ AI Language: [English ▼]                │
│ Custom Instructions: [textarea]         │
│                                          │
│ Auto Content SEO: [ON ●]                │
│ Auto Media AI:    [ON ●]                │
│ [Save]                                  │
└─────────────────────────────────────────┘

(Full details in zaynahs-seo-complete-guide.md)
```

---

# TAB 6 — CONTACT INFO

```
┌─────────────────────────────────────────┐
│ Contact Information                     │
├─────────────────────────────────────────┤
│ Contact Email:   [info@totvogue.com   ] │
│ Contact Phone:   [+923001234567       ] │
│ Contact Address: [textarea]             │
│   (About/Contact page pe dikhega)       │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

---

# IMPLEMENTATION FILES

```
/lib/getSettings.ts
  → getAppSettings() function
  → Fetch from app_settings table
  → Cache with revalidate tag 'settings'

/app/admin/settings/page.tsx
  → Tab navigation component
  → 6 tabs as above

/app/admin/settings/StoreTab.tsx
/app/admin/settings/PixelsTab.tsx
/app/admin/settings/SocialTab.tsx
/app/admin/settings/EmailTab.tsx
/app/admin/settings/AITab.tsx
/app/admin/settings/ContactTab.tsx

/app/api/settings/route.ts
  → GET: fetch settings
  → POST: update settings
  → revalidateTag('settings') on save

/components/Pixels.tsx
  → All tracking pixels component
  → Used in root layout

/components/TrackEvent.tsx
  → Helper to fire pixel events
  → trackEvent('AddToCart', {...})
```

---

# WEBHOOK RULE FOR app_settings

```
✅ app_settings table → Webhook LAGAO
   (Pixels/brand change → homepage cache clear)

revalidateTag('settings') on update
Cache tags ['settings'] on all pages using settings
```

---

# GOLDEN RULES

```
1. ENV = technical secrets, never change
2. Settings (DB) = business values, admin controls
3. Pixels load conditionally - empty = no script
4. Gmail = App Password, NOT normal password
5. Email toggles = granular control per notification
6. Settings cached with tag 'settings'
7. app_settings webhook = clears settings cache
8. Single source of truth for brand/pixel/email
```
