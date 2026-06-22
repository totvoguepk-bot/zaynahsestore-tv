# Email System - Agent Prompt
# IDX Gemini Ko Yeh Paste Karo
# Run AFTER settings-system-prompt.md (needs app_settings table)

---

## PROMPT ↓

```
Read this file FIRST:
- /docs/email-system-guide.md

I have Next.js 14 App Router + TypeScript ecommerce.
Supabase DB. app_settings table already exists
(from settings system) with smtp_email,
smtp_app_password, smtp_from_name,
admin_notification_email, email_notifications (jsonb),
low_stock_threshold columns.
Do NOT remove existing code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 1 — INSTALL PACKAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run:
npm install nodemailer
npm install @react-email/components @react-email/render
npm install -D @types/nodemailer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 2 — CORE EMAIL SENDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create /lib/email/sendEmail.ts:
- sendEmail({ to, subject, template }) function
- Get smtp_email + smtp_app_password from getAppSettings()
- If either missing, log error and return
  { success: false, error: 'SMTP not configured' }
  (do NOT throw - email failure should never break
  the calling action like checkout)
- Use nodemailer with service: 'gmail'
- Render React Email template to HTML
- from: `"${smtp_from_name || brand_name}" <${smtp_email}>`
- Wrap in try/catch, log errors, return { success, error }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 3 — EMAIL TEMPLATES (15 files)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create /lib/email/templates/ with these React Email
components. Each uses @react-email/components
(Html, Head, Body, Container, Text, Button, Img, Hr).
Style: clean, brand_name + default_og_image as logo
if available, footer with contact_email.

Customer templates:
1. Welcome.tsx
   props: { user, settings }
   "Welcome to {brand_name}! Your account is ready."
   Button: "Start Shopping" → site URL

2. PasswordReset.tsx
   props: { user, resetLink }
   "Reset your password" + Button with resetLink
   Note: link expires in 1 hour

3. PasswordChanged.tsx
   props: { user }
   "Your password was changed. If this wasn't you,
   contact us immediately."

4. OrderPlaced.tsx
   props: { order, customer, settings }
   Order items table, total, "View Order" button
   Use exact structure from guide example

5. OrderConfirmed.tsx
   props: { order, customer, settings }
   "Your order is confirmed and being prepared"

6. OrderShipped.tsx
   props: { order, customer, settings }
   Tracking number, courier name, estimated delivery
   "Track Order" button

7. OrderDelivered.tsx
   props: { order, customer, settings }
   "Delivered! Enjoy your purchase"

8. OrderCancelled.tsx
   props: { order, customer, reason, settings }
   "Order #X cancelled. Reason: {reason}"

9. OrderRefunded.tsx
   props: { order, customer, settings }
   "Refund of {currency}{amount} processed,
   5-7 business days"

10. ReviewRequest.tsx
    props: { order, customer, settings }
    "How was your order? Leave a review"
    Button → product review page

Admin templates:
11. AdminNewOrder.tsx
    props: { order, customer, settings }
    Order details + customer info + "View in Admin" button

12. AdminLowStock.tsx
    props: { product, settings }
    "Product {name} has only {stock} units left"

13. AdminNewCustomer.tsx
    props: { user }
    "New customer registered: {name}, {email}"

14. AdminNewReview.tsx
    props: { review, product }
    "New review on {product.name}: {rating} stars"
    Show review text

15. AdminContactForm.tsx
    props: { data: { name, email, subject, message } }
    Display all fields

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 4 — TRIGGER FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create /lib/email/triggers.ts with these exported
async functions. EACH must first check
settings.email_notifications.{key} === true before
sending (skip silently if false):

- onUserRegister(user)
  → sends Welcome (key: 'welcome')
  → calls notifyAdminNewCustomer(user)

- notifyAdminNewCustomer(user)
  → sends AdminNewCustomer to admin_notification_email
  (key: 'admin_new_customer')

- onPasswordResetRequest(user, resetToken)
  → sends PasswordReset with link:
    `${SITE_URL}/reset-password?token=${resetToken}`
  (key: 'password_reset')

- onPasswordChanged(user)
  → sends PasswordChanged (key: 'password_changed')

- onOrderPlaced(order, customer)
  → sends OrderPlaced to customer (key: 'order_placed')
  → calls notifyAdminNewOrder(order, customer)
  → calls checkLowStock(order.items)

- notifyAdminNewOrder(order, customer)
  → sends AdminNewOrder (key: 'admin_new_order')

- onOrderStatusChange(order, customer, newStatus)
  → maps newStatus to template:
    confirmed→OrderConfirmed (key: 'order_confirmed')
    shipped→OrderShipped (key: 'order_shipped')
    delivered→OrderDelivered (key: 'order_delivered')
    cancelled→OrderCancelled (key: 'order_cancelled')
    refunded→OrderRefunded (key: 'order_refunded')
  → sends matching email
  → if newStatus === 'delivered': insert/update order
    row to mark review_email_pending = true (for cron)

- checkLowStock(items)
  → for each item, fetch product, if
    product.stock <= settings.low_stock_threshold
  → sends AdminLowStock (key: 'admin_low_stock')

- onNewReview(review, product)
  → sends AdminNewReview (key: 'admin_new_review')

- onContactForm(formData)
  → sends AdminContactForm (key: 'admin_contact_form')

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 5 — WIRE TRIGGERS INTO EXISTING ROUTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Find existing routes/actions and add trigger calls
(do not remove existing logic, just add after success):

- User registration route/action
  → call onUserRegister(user)

- Forgot password route/action
  → generate reset token, call onPasswordResetRequest

- Reset password confirm route/action
  → after password updated, call onPasswordChanged(user)

- Checkout/order creation route/action
  → after order created, call onOrderPlaced(order, customer)

- Admin order status update route/action
  → after status updated, call onOrderStatusChange(...)

- Review submission route/action
  → after review saved, call onNewReview(review, product)

- Contact form route/action
  → after form saved, call onContactForm(formData)

If any of these routes/pages don't exist yet,
note them in your final summary instead of creating
new ones (don't build unrelated features).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 6 — REVIEW REQUEST CRON (3 Days After Delivery)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add column to orders table (migration):
alter table orders add column if not exists
  review_email_pending boolean default false;
alter table orders add column if not exists
  delivered_at timestamptz;

Create /app/api/cron/review-requests/route.ts:
- GET handler (Vercel cron calls GET)
- Verify request is from Vercel cron
  (check header or simple secret check)
- Query orders WHERE review_email_pending = true
  AND delivered_at < now() - interval '3 days'
- For each: send ReviewRequest email,
  set review_email_pending = false

Update /vercel.json (create if doesn't exist):
{
  "crons": [{
    "path": "/api/cron/review-requests",
    "schedule": "0 10 * * *"
  }]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 7 — TEST EMAIL FEATURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create /app/api/settings/test-email/route.ts:
POST handler:
- Get settings
- Send simple test email to admin_notification_email
  Subject: "Test Email from {brand_name}"
  Body: "If you received this, your email settings
  are working correctly!"
- Return { success: true/false, error? }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 8 — EMAIL TAB IN ADMIN SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If /app/admin/settings/ already has tab structure
(from settings system prompt), add EmailTab.tsx.
If not, create /app/admin/settings/page.tsx with
at least this Email tab.

/app/admin/settings/EmailTab.tsx:
Fields:
- smtp_email (text input, type email)
- smtp_app_password (password input, masked)
  Helper text: "Use Gmail App Password, not your
  regular password. Generate at
  myaccount.google.com → Security → App Passwords"
- smtp_from_name (text)
- admin_notification_email (text input, type email)
- low_stock_threshold (number input)

"Send Test Email" button → calls
/api/settings/test-email, shows success/error toast

Notification toggles section:
Render checkbox for each key in email_notifications
jsonb, grouped:
Customer Emails: welcome, password_reset,
  password_changed, order_placed, order_confirmed,
  order_shipped, order_delivered, order_cancelled,
  order_refunded, review_request
Admin Emails: admin_new_order, admin_low_stock,
  admin_new_customer, admin_new_review,
  admin_contact_form

Save button → POST /api/settings with updated
email-related fields

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER ALL TASKS DONE - TELL ME:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Files created/modified list
2. Migration created (orders table columns)
3. Which existing routes I need to manually check
   for trigger wiring (if any were skipped)
4. Confirm vercel.json cron added
5. Steps to generate Gmail App Password
```

## PROMPT END ↑

---

## Tera Manual Kaam (Baad Mein)

```
1. Gmail App Password Generate Karo:
   myaccount.google.com → Security
   → 2-Step Verification ON karo (zaroori!)
   → App Passwords → Select app: Mail
   → Select device: Other → "TotVogue Store"
   → Generate → 16-digit password copy karo

2. Admin Settings → Email Tab:
   - Gmail address daalo
   - App password paste karo (spaces hata ke)
   - From Name set karo (e.g. brand name)
   - Admin notification email set karo
     (jahan order/review/contact alerts aayengi)
   - Low stock threshold set karo (e.g. 5)
   - Notification toggles check karo (sab ON by default)
   - "Send Test Email" click → inbox check karo

3. Vercel Cron Verify:
   Vercel Dashboard → Project → Cron Jobs tab
   /api/cron/review-requests dikhna chahiye
   Schedule: daily 10 AM
   Free plan: max 2 cron jobs, daily frequency
```

---

# ═══════════════════════════════
# ADDITIONAL TASKS - TEMPLATE EDITOR SYSTEM
# (Shopify-style, per-type enable/disable + custom templates)
# ═══════════════════════════════

Read /docs/email-system-guide.md PART 14 for full details
before doing these tasks.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 9 — email_templates TABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create migration for email_templates table exactly
as defined in PART 14 of the guide, including the
INSERT seed statement with all 18 email types
(category 'customer' or 'admin', label, description,
default subject with {{variables}}, enabled=true,
custom_html=NULL).

This REPLACES the old email_notifications jsonb
approach - email_templates.enabled is now the
single source of truth for enable/disable per type.

Add to orders table (if not already done):
- status column should support: placed, confirmed,
  processing, shipped, out_for_delivery, delivered,
  cancelled, refunded
- tracking_number text
- courier_name text
- tracking_url text
- cancel_reason text
- refund_amount numeric

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 10 — VARIABLE ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create /lib/email/variables.ts:

- buildVariables(emailType, data): Record<string, any>
  Returns common variables (brand_name, site_url,
  customer_name, customer_email, contact_email,
  currency, current_year from settings + data)
  PLUS type-specific variables as listed in guide
  PART 14 "Available Variables" section.

- renderOrderItemsTable(items): string
  Returns HTML table rows string (image, name,
  variation, qty, price, total) - this becomes
  {{order_items_html}}

- replaceVariables(text, variables): string
  Replaces {{key}} and {{key.nested}} patterns
  with values from variables object. Leave
  unmatched {{...}} as-is (don't break on missing).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 11 — DEFAULT TEMPLATES (Shopify Style)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each of the 18 email types, create a default
React Email template in /lib/email/defaults/
following Shopify visual style as described in
guide PART 14 "Default Templates":
- 600px centered container, white background
- Logo/brand name header
- Order items table with images (for order-related types)
- Subtotal/shipping/total breakdown
- Shipping address block (for order types)
- Status-colored badge
- CTA button matching the action
- Footer with brand_name + contact_email

These are the fallback templates used when
email_templates.custom_html is NULL for that type.

Create /lib/email/defaults/getDefaultTemplate.ts:
- getDefaultTemplate(emailType, variables): returns
  rendered HTML string for the matching default
  template with variables already injected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 12 — UPDATED SEND FUNCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create /lib/email/sendTemplatedEmail.ts:
- sendTemplatedEmail(emailType, to, data)
- Fetch template row from email_templates by email_type
- If !template.enabled → return { success:false, skipped:true }
- Build variables via buildVariables()
- If data.order?.items exists → add order_items_html
- subject = replaceVariables(template.subject, variables)
- html = template.custom_html
    ? replaceVariables(template.custom_html, variables)
    : getDefaultTemplate(emailType, variables)
- Call existing sendEmail({to, subject, html})
- Wrap in try/catch, never throw

Update /lib/email/triggers.ts (from earlier tasks):
Replace old email_notifications jsonb checks with
calls to sendTemplatedEmail(emailType, to, data).
Update onOrderStatusChange to handle ALL statuses:
placed, confirmed, processing, shipped,
out_for_delivery, delivered, cancelled, refunded
- each maps to its email_type
- shipped/out_for_delivery include tracking data
- cancelled includes cancel_reason
- refunded includes refund_amount
- delivered also triggers review_request scheduling
- placed/cancelled also trigger matching admin emails
  (admin_new_order / admin_order_cancelled)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 13 — TEMPLATE EDITOR API ROUTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/api/email-templates/route.ts:
- GET: return all rows from email_templates,
  grouped by category

/app/api/email-templates/[type]/route.ts:
- GET: return single template row
- PATCH: update subject/custom_html/enabled for
  this email_type
- POST with action='reset': set custom_html = NULL

/app/api/email-templates/[type]/preview/route.ts:
- POST: 
  - Generate SAMPLE DATA matching guide PART 14
    "Preview System" sample_order + sample_address
  - Render template (custom or default) with sample data
  - Return { subject, html }

/app/api/email-templates/[type]/send-test/route.ts:
- POST: same as preview but actually sends via
  sendEmail() to admin_notification_email
  Return { success, error? }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 14 — ADMIN TEMPLATES LIST PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/admin/settings/email/templates/page.tsx:
- Two sections: "Customer Emails" and "Admin Emails"
  (filter by category from email_templates)
- Each row shows: enabled toggle (instant save via
  PATCH), label, description, [Edit] button,
  [Preview 👁] button (opens preview in modal/new tab)
- Toggle click → immediately PATCH enabled field

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 15 — TEMPLATE EDITOR PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app/admin/settings/email/templates/[type]/page.tsx:

- Enabled toggle at top
- Subject input (text, supports {{variables}})
- Mode radio: "Default Template" / "Custom Template"
  - If custom_html is null → default to "Default" mode
  - If custom_html has value → default to "Custom" mode
- If Custom mode:
  - Variable picker: clickable list of available
    variables for THIS email type (from guide list)
    clicking inserts {{variable}} at cursor in editor
  - HTML textarea/code editor for custom_html
- "Preview with Sample Data" button → calls preview
  API, shows result in iframe or new tab
- "Send Test Email" button → calls send-test API
- "Reset to Default" button → calls reset action,
  shows confirmation dialog first
- "Save" button → PATCH with subject/custom_html/enabled

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 16 — UPDATE ADMIN ORDER STATUS UI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Find admin order detail/edit page. Update status
dropdown to include all 8 statuses:
placed, confirmed, processing, shipped,
out_for_delivery, delivered, cancelled, refunded

When status changes:
- shipped/out_for_delivery: show fields for
  tracking_number, courier_name, tracking_url
- cancelled: show field for cancel_reason
- refunded: show field for refund_amount
- On save: call onOrderStatusChange(order, customer, newStatus)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER ALL TASKS DONE - TELL ME (UPDATED):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Files created/modified list
2. Migrations created (email_templates + orders columns)
3. Confirm all 18 email types seeded correctly
4. Link to admin templates page
5. Any existing routes that need manual wiring
6. Confirm vercel.json cron added
7. Steps to generate Gmail App Password
