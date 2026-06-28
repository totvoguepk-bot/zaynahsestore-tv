# Google Indexing API — Issues & Learnings

> ✅ **Final Status:** Working | `GET /api/seo/test` → `googleIndexingTest: ok`

## Issue 1 — Bug: Double Base64 Encoding

**Symptom:** `"invalid_grant"` / `"Invalid JWT Signature"` from Google OAuth

**Root Cause:** `lib/googleIndexing.ts` mein `base64UrlEncode()` function JWT signature ko **do baar base64 encode** kar raha tha:

```
rs256Sign() → returns base64 string
        ↓
base64UrlEncode() → Buffer.from(base64String).toString('base64') → DOUBLE ENCODE
```

Google ko signature raw binary chahiye tha, jo sirf ek baar base64url ho.

**Fix:**
- `rs256Sign()` ab raw `Buffer` return karta hai (not base64 string)
- `base64UrlEncode()` accept karta hai `string | Buffer`
- Signature ab exactly ek baar encode hota hai

```diff
- function rs256Sign(data, key): string {
-   return sign.sign(key, 'base64'); // already base64
- }
+ function rs256Sign(data, key): Buffer {
+   return sign.sign(key); // raw binary
+ }
```

---

## Issue 2 — Private Key Format (.env vs Vercel)

**Problem:** Environment variable format mismatch between `dotenv` (actual newlines) and Vercel (escaped `\n`).

**Root Cause:** 
- `.env.local` mein key multi-line hoti hai with actual `\n` characters
- Vercel env vars JSON API ke through set karne par `\n` literal chars store ho sakte hain
- Node.js `crypto.createSign()` ko actual newlines chahiye, `\n` nahi

**Fix:** `getAccessToken()` mein normalization add ki:
```javascript
const normalizedKey = privateKey.replace(/\\n/g, '\n');
```

Ye dono formats handle karta hai.

---

## Issue 3 — Vercel Env Var Upload Corruption

**Problem:** Pehli baar Vercel env upload karte waqt sirf private key ki **dusri line** gayi (poore key ke bajaye).

**Root Cause:** Bash one-liner:
```bash
SA_KEY=$(grep -A999 'GOOGLE_INDEXING_SA_KEY' .env.local | head -2 | tail -1 | sed 's/^GOOGLE_INDEXING_SA_KEY=//; s/^"//; s/"$//')
```
Isne sirf `MIIEvgIBADAN...` line capture ki, `-----BEGIN PRIVATE KEY-----` aur baqi lines miss ho gayin.

**Fix:** Python script se poora key extract karo:
```python
match = re.search(r'GOOGLE_INDEXING_SA_KEY="([\s\S]+?)"(?:\s|$|$)', content)
key = match.group(1)
```

---

## Issue 4 — Vercel API Race Condition

**Problem:** `DELETE` + `POST` sequential calls ke bawajood "ENV_CONFLICT" error.

**Root Cause:** Vercel API eventual consistency — delete ke immediately baad POST karo to conflict aata hai kyunke delete fully propagate nahi hua hota.

**Fix:** 
- PATCH ka use karo existing env var update karne ke liye instead of DELETE + POST
- Ya DELETE ke baad 2-3 second wait karo

```bash
# Better approach:
curl -s -X PATCH "https://api.vercel.com/v10/projects/.../env/ENV_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -d @payload.json
```

---

## Issue 5 — Cloudflare Cache Stale Responses

**Problem:** `/api/seo/test` ek hi response return kar raha tha despite successful Vercel deploy.

**Root Cause:** Cloudflare 4 hours tak cache kar raha tha API response ko.

**Fix:** Deploy ke baad Cloudflare cache purge karo:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -d '{"files": ["https://domain.com/api/seo/test"]}'
```

---

## Issue 6 — IndexNow Key File 404

**Problem:** IndexNow test `failed` tha despite env var set.

**Root Cause:** `https://www.totvogue.pk/5a83b276cd8d4850af5c81de4c34a2e8.txt` return 404 — key file route exist nahi karta.

**Fix:** IndexNow key file serve karne ke liye route banana pare ga (future task — abhi IndexNow skip hai).

---

## Issue 7 — Search Console Setup Required

**Important:** Google Indexing API kaam karne ke liye do mandatory steps hain:
1. Google Cloud Console mein "Web Search Indexing API" enable karo
2. Service account email ko Search Console mein **Owner** banao

Bina in dono ke "Invalid JWT Signature" aata hai chahe code sahi ho.

---

## Issue 8 — GitHub Push Protection (Secrets)

**Problem:** `google json gen-lang-client-0610294147-f50b43a157b8.json` (service account private key) commit ho gaya → GitHub ne push block kar diya.

**Fix:** 
- `git reset` karo secret commit ko hatao
- JSON file ko `/tmp/` move karo, then `git add -A`
- `.gitignore` mein `*service-account*.json` ya specific file daalo
- `git push --force` for already-pushed branches

---

## Final Architecture

```
Product Save/Update
       ↓
  Webhook → /api/revalidate (Supabase DB webhook)
       ↓
  revalidateProduct()
       ↓
  notifyGoogleIndexing(url)
       ↓
  JWT (RS256) → OAuth Token
       ↓
  Google Indexing API → URL queued
       ↓
  Logged to indexing_log table
```

**Key Files:**
| File | Purpose |
|------|---------|
| `lib/googleIndexing.ts` | JWT + OAuth + Google API call |
| `lib/revalidate.ts` | Webhook handler, calls googleIndexing |
| `app/api/revalidate/route.ts` | Supabase webhook endpoint |
| `app/api/indexing/route.ts` | Manual single URL submit |
| `app/api/indexing/batch/route.ts` | Batch submit (max 200) |
| `app/api/seo/test/route.ts` | SEO health check |
| `supabase/migrations/20260628030000_add_indexing_log_table.sql` | Logging table |

---

## Terminal Tests

### 1. SEO Health Check
```bash
curl -s https://YOUR_DOMAIN/api/seo/test | python3 -m json.tool
```
Check: `googleIndexingTest.status` should be `ok`

### 2. Manual Single URL Submit
```bash
curl -X POST https://YOUR_DOMAIN/api/indexing \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR_DOMAIN/", "type": "URL_UPDATED"}'
```
Response: `{ "success": true, "url": "...", "type": "URL_UPDATED" }`

### 3. Batch Submit (max 200)
```bash
curl -X POST https://YOUR_DOMAIN/api/indexing/batch \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://YOUR_DOMAIN/", "https://YOUR_DOMAIN/shop"]}'
```

### 4. Check indexing_log Table (Supabase)
```sql
SELECT * FROM indexing_log ORDER BY created_at DESC LIMIT 10;
```

### 5. Vercel Deploy Trigger
```bash
git commit --allow-empty -m "chore: redeploy" && git push
```

### 6. Cloudflare Cache Purge
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"files": ["https://YOUR_DOMAIN/api/seo/test"]}'
```

---

## Console Links

| Service | Link | Purpose |
|---------|------|---------|
| Google Indexing API Enable | https://console.cloud.google.com/apis/library/indexing.googleapis.com | API on/off |
| Google Service Accounts | https://console.cloud.google.com/iam-admin/serviceaccounts | Keys management |
| Google Search Console | https://search.google.com/search-console | Site verify + Owner add |
| Vercel Env Vars | https://vercel.com/PROJECT/settings/environment-variables | Manage secrets |
| Cloudflare Dashboard | https://dash.cloudflare.com/ | DNS + Cache |
| Supabase Table Editor | https://supabase.com/dashboard/project/PROJECT_REF/editor | indexing_log table |
| IndexNow Key Check | https://YOUR_DOMAIN/YOUR_KEY.txt | Key file reachable? |

---

## All Credentials Check

| Key | In Vercel? | Source |
|-----|------------|--------|
| `GOOGLE_INDEXING_SA_EMAIL` | ✅ | Google JSON key → `client_email` |
| `GOOGLE_INDEXING_SA_KEY` | ✅ | Google JSON key → `private_key` |
| `GOOGLE_SITE_VERIFICATION` | ✅ | Search Console meta tag value |
| `INDEXNOW_API_KEY` | ✅ | https://www.indexnow.org/ |
| `CLOUDFLARE_API_TOKEN` | ✅ | Cloudflare dashboard |
| `CLOUDFLARE_ZONE_ID` | ✅ | Cloudflare → domain → right sidebar |
| `REVALIDATE_SECRET` | ✅ | Custom random string |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://YOUR_DOMAIN` |
| `NEXT_PUBLIC_BRAND_NAME` | ✅ | Store name |
