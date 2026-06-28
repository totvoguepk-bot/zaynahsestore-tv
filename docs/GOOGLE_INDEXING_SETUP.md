# Google Indexing API Setup Guide

> Ye setup Google ko automatically notify karta hai jab bhi koi product/page add ya update ho — faster indexing milti hai Google Search mein.

---

## Step 1 — Web Search Indexing API Enable Karo

1. Jao: https://console.cloud.google.com/apis/library
2. Search karo: `Web Search Indexing API`
3. Click karo → **Enable** dabao

---

## Step 2 — Service Account Banao

1. Jao: https://console.cloud.google.com/iam-admin/serviceaccounts
2. **+ CREATE SERVICE ACCOUNT** click karo
3. Name: koi bhi (e.g. `my-store-indexing`)
4. **Create and continue** dabao
5. Role search karo: `Owner` → select karo
6. **Continue** → **Done**

---

## Step 3 — JSON Key Download Karo

1. Same page pe apna service account click karo
2. **Keys** tab click karo
3. **Add Key** → **Create new key**
4. **JSON** select karo → **Create**
5. File download ho jaye gi: `gen-lang-client-XXXX.json`

---

## Step 4 — Search Console mein Owner Banao

1. Jao: https://search.google.com/search-console
2. Apni site select karo (jo bhi domain ho) → **Settings** → **Users and permissions**
3. **ADD USER** click karo
4. Email paste karo (JSON file se):
   `YOUR_SA_NAME@YOUR_PROJECT.iam.gserviceaccount.com`
5. Permission: **Owner** → **Add**

---

## Step 5 — ENV Variables Add Karo

`.env.local` mein ye daalo (JSON file se copy karo):

```env
GOOGLE_INDEXING_SA_EMAIL=your-sa@your-project.iam.gserviceaccount.com
GOOGLE_INDEXING_SA_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

---

## Step 6 — Verify Setup (Test)

Setup complete hone ke baad, browser mein ye kholo:

```
https://YOUR_DOMAIN/api/seo/test
```

`googleIndexing` ka status `ok` aana chahiye.

Ya manually test karo:

```bash
curl -X POST https://YOUR_DOMAIN/api/indexing \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR_DOMAIN/", "type": "URL_UPDATED"}'
```

Response:
```json
{ "success": true, "url": "https://YOUR_DOMAIN/", "type": "URL_UPDATED" }
```

Batch test:
```bash
curl -X POST https://YOUR_DOMAIN/api/indexing/batch \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://YOUR_DOMAIN/", "https://YOUR_DOMAIN/shop"]}'
```

---

## Flow Summary

```
Product Save/Update
       |
       v
/api/indexing POST
       |
       v
JWT → OAuth Token
       |
       v
Google Indexing API
       |
       v
Google crawls URL
within minutes/hours
```

---

## Available API Endpoints

| Endpoint | Method | Body | Use |
|----------|--------|------|-----|
| `/api/indexing` | POST | `{ url, type }` | Single URL notify |
| `/api/indexing/batch` | POST | `{ urls[], type? }` | Max 200 URLs |
| `/api/seo/test` | GET | - | SEO health check |

---

## indexing_log Table (Supabase)

Har Google Indexing API call automatically log hoti hai:

| Column | Example |
|--------|---------|
| `url` | `https://YOUR_DOMAIN/product/kids-tshirt` |
| `type` | `URL_UPDATED` |
| `status` | `submitted` / `failed` |
| `created_at` | `2026-06-28T12:00:00Z` |

Logs dekhne: Supabase Dashboard → Table Editor → `indexing_log`

---

## Result

| Bina Setup | Iske Baad |
|-----------|-----------|
| 2 days — 2 weeks indexing | Minutes — hours indexing |
| Google apne time pe crawle | Google turant notify hota |
| New products late dikhte | New products jaldi search mein |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `googleIndexing` status `not configured` | `.env.local` mein `GOOGLE_INDEXING_SA_EMAIL` aur `GOOGLE_INDEXING_SA_KEY` check karo |
| `403 Forbidden` | Search Console mein service account email ko **Owner** permission nahi di |
| `429 Rate Limit` | Google Indexing API free limit 200 URLs/day, kal tak wait karo |
| JWT error | Private key format sahi hai? Double quotes + literal `\n` hona chahiye |
