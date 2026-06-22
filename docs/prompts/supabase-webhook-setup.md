# Supabase Webhook Setup Guide
# Manually Karna Hai - Agent Nahi Kar Sakta

---

## Kab Karna Hai
```
Agent ne /app/api/revalidate/route.ts bana diya
Site Vercel pe deploy ho gayi
Tab yeh karo
```

---

## Step 1 - Supabase Dashboard Kholo
```
supabase.com → apna project select karo
Left sidebar → Database → Webhooks
→ "Create a new hook" button
```

---

## Step 2 - Products Table Webhook

```
Name:         revalidate-products
Table:        products
Events:       ✅ INSERT  ✅ UPDATE  ✅ DELETE

Type:         HTTP Request
URL:          https://TERI-SITE.vercel.app/api/revalidate

HTTP Headers:
  Key:    x-revalidate-secret
  Value:  [tera REVALIDATE_SECRET value]

→ Save karo ✅
```

---

## Step 3 - Banners Table Webhook

```
Name:         revalidate-banners
Table:        banners
Events:       ✅ INSERT  ✅ UPDATE  ✅ DELETE

Type:         HTTP Request
URL:          https://TERI-SITE.vercel.app/api/revalidate

HTTP Headers:
  Key:    x-revalidate-secret
  Value:  [tera REVALIDATE_SECRET value]

→ Save karo ✅
```

---

## Step 4 - Categories Table Webhook

```
Name:         revalidate-categories
Table:        categories
Events:       ✅ INSERT  ✅ UPDATE  ✅ DELETE

Type:         HTTP Request
URL:          https://TERI-SITE.vercel.app/api/revalidate

HTTP Headers:
  Key:    x-revalidate-secret
  Value:  [tera REVALIDATE_SECRET value]

→ Save karo ✅
```

---

## Nai Table Bani? Naya Webhook Banao!

```
Jab bhi agent nai table banaye:
Supabase → Database → Webhooks → Create

Same settings:
- Nai table ka naam
- Same URL
- Same secret header
- INSERT + UPDATE + DELETE

Yeh rule hamesha follow karo!
```

---

## Webhook Test Kaise Karo

```
Supabase → Database → Webhooks →
tera webhook → "Send test request"

Ya manually:
Admin panel mein koi product update karo
→ Supabase logs mein dekho webhook gaya?
→ Vercel logs mein dekho request aayi?
```

---

## Webhook Logs Kahan Dekhein

```
Supabase → Database → Webhooks →
tera webhook → Logs tab

Yahan dikhega:
✅ Success - 200 response
❌ Failed - error message
```

---

## Vercel Logs Kahan Dekhein

```
Vercel Dashboard → Project →
Functions → /api/revalidate →
Logs

Yahan dikhega:
- Request aayi
- Secret check hua
- Cache clear hua
```

---

## Common Errors

```
401 Error:
→ Secret key match nahi kiya
→ Vercel ENV mein REVALIDATE_SECRET check karo
→ Supabase webhook header check karo

404 Error:
→ URL galat hai
→ /api/revalidate route exist nahi
→ Agent se pehle yeh file banwao

500 Error:
→ Code mein koi bug hai
→ Vercel logs mein details dekhو
```

---

## ENV Variables Checklist

```
.env.local mein:
✅ REVALIDATE_SECRET=koi_bhi_random_string

Vercel Dashboard mein bhi same:
✅ REVALIDATE_SECRET=same_value

Dono jagah same hona chahiye!
```

---

## Quick Reference

```
Webhook URL:
https://[teri-site].vercel.app/api/revalidate

Header Key:   x-revalidate-secret
Header Value: [REVALIDATE_SECRET ki value]

Events:       INSERT + UPDATE + DELETE
Type:         HTTP Request
Method:       POST
```
