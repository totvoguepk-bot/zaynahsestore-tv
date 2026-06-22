# Settings System - Agent Prompt
# IDX Gemini Ko Yeh Paste Karo

---

## PROMPT ↓

```
Read this file FIRST:
- /docs/settings-system-guide.md

I have Next.js 14 App Router + TypeScript ecommerce.
Supabase DB. Do NOT remove existing code.
This system creates centralized admin settings used by
SEO system, email system, and pixels.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 1 — SUPABASE MIGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create app_settings table exactly as defined in
/docs/settings-system-guide.md (single row table,
all columns with defaults as specified, including
jsonb email_notifications with all 15 keys default true).

Insert one default row.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 2 — SETTINGS HELPER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create /lib/getSettings.ts:
- getAppSettings(): fetch single row from app_settings
- Use fetch with cache tag 'settings'
- Cache revalidate: 3600 (1 hour, settings rarely change)
- Return typed object with all fields

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 3 — SETTINGS API ROUTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/api/settings/route.ts:
- GET: return current settings row
- POST: update settings row (partial update allowed)
  After update: call revalidateTag('settings')
  Also call revalidateTag('homepage') since pixels
  affect every page
- try/catch with proper errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 4 — ADMIN SETTINGS PAGE WITH TABS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/admin/settings/page.tsx:
Tab navigation (use existing admin UI style):
- Store
- Pixels & Tracking
- Social & SEO
- Email
- AI (SEO)
- Contact

Each tab = separate component, loads/saves via
/api/settings route.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 5 — TAB 1: STORE SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/admin/settings/StoreTab.tsx:
Fields:
- brand_name (text input)
- store_type (select: Kids/Adults/Men/Women/General)
- target_market (select: Pakistan/Global/Custom)
- currency (select: PKR/USD/AED/GBP/EUR)
- store_description (textarea)
- default_og_image (image upload, use existing uploadImage())

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 6 — TAB 2: PIXELS & TRACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/admin/settings/PixelsTab.tsx:
Fields (all text inputs with helper text showing
where to get the ID):
- meta_pixel_id (helper: business.facebook.com/events_manager2)
- ga4_measurement_id (helper: analytics.google.com, format G-XXXXXXXXXX)
- gtm_container_id (helper: tagmanager.google.com, format GTM-XXXXXXX)
- tiktok_pixel_id (helper: ads.tiktok.com)
- pinterest_tag_id (helper: ads.pinterest.com)
- snapchat_pixel_id
- twitter_pixel_id

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 7 — PIXELS COMPONENT (Conditional Loading)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create /components/Pixels.tsx:
- Server component, fetches getAppSettings()
- Conditionally renders each pixel script ONLY if
  its ID is non-empty:
  - Meta Pixel (fbq init + PageView)
  - GA4 (gtag.js)
  - GTM (Google Tag Manager script)
  - TikTok Pixel
  - Pinterest Tag
  - Snapchat Pixel
  - Twitter Pixel
- Add this component to /app/layout.tsx (root layout)

Create /lib/trackEvent.ts:
- trackEvent(eventName, params) helper
- Fires equivalent event on Meta Pixel (fbq) AND
  GA4 (gtag) if both are configured
- Standard events: PageView, ViewContent, AddToCart,
  InitiateCheckout, Purchase, Search

Wire up trackEvent calls:
- Product page view → ViewContent
- Add to cart button → AddToCart
- Checkout page → InitiateCheckout
- Order success page → Purchase (with value + currency)
- Search component → Search

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 8 — TAB 3: SOCIAL & SEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/admin/settings/SocialTab.tsx:
Fields:
- twitter_handle (text, format @username)
- meta_title_suffix (text, e.g. "| TotVogue Pakistan")
- facebook_url (text)
- instagram_url (text)
- whatsapp_number (text, format +923001234567)

Use meta_title_suffix:
Update generateMetadata in existing pages
(homepage, product, category) to append
settings.meta_title_suffix to titles if set.

Use whatsapp_number:
Create /components/WhatsAppButton.tsx
- Floating button bottom-right
- Links to https://wa.me/{whatsapp_number}
- Only renders if whatsapp_number is set
- Add to root layout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 9 — TAB 6: CONTACT INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/admin/settings/ContactTab.tsx:
Fields:
- contact_email
- contact_phone
- contact_address (textarea)

If /app/contact/ or /app/about/ pages exist,
update them to display these values from settings.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 10 — WEBHOOK FOR app_settings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update /app/api/revalidate/route.ts:
Add case for table === 'app_settings':
  revalidateTag('settings')
  revalidateTag('homepage')
  (Cloudflare purge homepage too if that logic exists)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOTE: Tabs 4 (Email) and 5 (AI) are covered by
separate prompts (email-system-prompt.md and
zaynahs-seo-prompt.md). If those tabs already
exist from those prompts, just ensure consistent
tab navigation includes them. If not yet built,
leave placeholder tabs.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER ALL TASKS DONE - TELL ME:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Files created/modified list
2. Migration created
3. Supabase webhook step needed for app_settings table
4. Where to get each Pixel ID (summary)
```

## PROMPT END ↑

---

## Tera Manual Kaam (Baad Mein)

```
1. Supabase Webhook add karo:
   Table: app_settings
   URL: same /api/revalidate URL
   Header: same secret
   Events: UPDATE

2. Admin Settings page mein jaake fill karo:
   - Brand name, store type, currency
   - Pixel IDs (jo available hain)
   - Social links, WhatsApp number
   - Contact info

3. Pixel IDs kahan se milenge:
   - Meta Pixel: business.facebook.com → Events Manager
   - GA4: analytics.google.com → Admin → Data Streams
   - GTM: tagmanager.google.com → Container ID
   - TikTok: ads.tiktok.com → Assets → Events
   - Pinterest: ads.pinterest.com → Conversions
```
