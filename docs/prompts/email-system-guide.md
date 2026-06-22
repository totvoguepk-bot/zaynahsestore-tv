# Email System - Complete Guide
# Gmail SMTP - All Customer + Admin Notifications

---

# OVERVIEW

```
Provider: Gmail SMTP (via nodemailer)
Credentials: Settings table (app_settings) se
NOT from ENV - admin khud manage kare

Templates: React Email (beautiful, responsive)
Trigger: Order/Auth/Review actions pe automatic
```

---

# WHY GMAIL SMTP FROM SETTINGS?

```
ENV mein hota to:
❌ Email change karne ke liye redeploy
❌ Developer ki zaroorat har baar

Settings (DB) mein:
✅ Admin Settings → Email tab
✅ Apna Gmail + App Password daale
✅ Test email bhejke verify kare
✅ Kabhi bhi change kar sake
```

---

# PACKAGE - NODEMAILER

```bash
npm install nodemailer
npm install @react-email/components @react-email/render
```

---

# EMAIL LIST - COMPLETE

## Customer Emails:

```
1. WELCOME EMAIL
   Trigger: User register kare
   To: Customer
   Content: "Welcome to {Brand}! Your account is ready"

2. PASSWORD RESET
   Trigger: "Forgot password" click
   To: Customer
   Content: Reset link with token (expires 1 hour)

3. PASSWORD CHANGED
   Trigger: Password successfully changed
   To: Customer
   Content: "Your password was changed. Not you? Contact us"

4. ORDER PLACED
   Trigger: Checkout complete
   To: Customer
   Content: Order # + items + total + "We'll confirm soon"

5. ORDER CONFIRMED
   Trigger: Admin marks order "Confirmed"
   To: Customer
   Content: "Your order is confirmed and being prepared"

6. ORDER SHIPPED
   Trigger: Admin marks order "Shipped"
   To: Customer
   Content: Tracking number + courier + estimated delivery

7. ORDER DELIVERED
   Trigger: Admin marks order "Delivered"
   To: Customer
   Content: "Delivered! Enjoy your purchase"

8. ORDER CANCELLED
   Trigger: Order cancelled (admin or customer)
   To: Customer
   Content: "Your order #X was cancelled. Reason: ..."

9. ORDER REFUNDED
   Trigger: Admin marks "Refunded"
   To: Customer
   Content: "Refund of Rs.X processed, 5-7 days"

10. REVIEW REQUEST
    Trigger: 3 days after "Delivered" status
    To: Customer
    Content: "How was your order? Leave a review"
```

## Admin Emails:

```
11. NEW ORDER ALERT
    Trigger: New order placed
    To: Admin (admin_notification_email)
    Content: Order details + customer info + "View in admin"

12. LOW STOCK ALERT
    Trigger: Product stock <= low_stock_threshold
    To: Admin
    Content: "Product X has only Y units left"

13. NEW CUSTOMER
    Trigger: New user registers
    To: Admin
    Content: "New customer: Name, Email"

14. NEW REVIEW
    Trigger: Customer submits review
    To: Admin
    Content: "New review on Product X: ★★★★☆"

15. CONTACT FORM
    Trigger: Contact form submitted
    To: Admin
    Content: Name + Email + Message
```

---

# FILE STRUCTURE

```
/lib/email/
  ├── sendEmail.ts          ← Core sender function
  ├── templates/
  │   ├── Welcome.tsx
  │   ├── PasswordReset.tsx
  │   ├── PasswordChanged.tsx
  │   ├── OrderPlaced.tsx
  │   ├── OrderConfirmed.tsx
  │   ├── OrderShipped.tsx
  │   ├── OrderDelivered.tsx
  │   ├── OrderCancelled.tsx
  │   ├── OrderRefunded.tsx
  │   ├── ReviewRequest.tsx
  │   ├── AdminNewOrder.tsx
  │   ├── AdminLowStock.tsx
  │   ├── AdminNewCustomer.tsx
  │   ├── AdminNewReview.tsx
  │   └── AdminContactForm.tsx
  └── triggers.ts            ← Helper functions per event
```

---

# CORE SENDER FUNCTION

```typescript
// /lib/email/sendEmail.ts

import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { getAppSettings } from '@/lib/getSettings'

export async function sendEmail({
  to,
  subject,
  template, // React component
}: {
  to: string
  subject: string
  template: React.ReactElement
}) {
  const settings = await getAppSettings()

  if (!settings.smtp_email || !settings.smtp_app_password) {
    console.error('SMTP not configured')
    return { success: false, error: 'SMTP not configured' }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: settings.smtp_email,
      pass: settings.smtp_app_password,
    },
  })

  const html = render(template)

  try {
    await transporter.sendMail({
      from: `"${settings.smtp_from_name || settings.brand_name}" <${settings.smtp_email}>`,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error: any) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}
```

---

# NOTIFICATION TOGGLE CHECK

```typescript
// Before sending, check toggle:

const settings = await getAppSettings()

if (!settings.email_notifications.order_placed) {
  return // Skip - admin disabled this notification
}

await sendEmail({
  to: customer.email,
  subject: `Order Confirmed - #${order.id}`,
  template: <OrderPlaced order={order} settings={settings} />
})
```

---

# TRIGGER POINTS - WHERE TO CALL

```typescript
// /lib/email/triggers.ts

// 1. On user registration:
export async function onUserRegister(user) {
  await sendEmail({
    to: user.email,
    subject: `Welcome to ${settings.brand_name}!`,
    template: <Welcome user={user} settings={settings} />
  })
  await notifyAdminNewCustomer(user)
}

// 2. On forgot password:
export async function onPasswordResetRequest(user, resetToken) {
  await sendEmail({
    to: user.email,
    subject: 'Reset Your Password',
    template: <PasswordReset user={user} token={resetToken} />
  })
}

// 3. On password changed:
export async function onPasswordChanged(user) {
  await sendEmail({
    to: user.email,
    subject: 'Your Password Was Changed',
    template: <PasswordChanged user={user} />
  })
}

// 4. On order placed (checkout success):
export async function onOrderPlaced(order, customer) {
  await sendEmail({
    to: customer.email,
    subject: `Order Confirmation #${order.id}`,
    template: <OrderPlaced order={order} customer={customer} />
  })
  await notifyAdminNewOrder(order, customer)
  await checkLowStock(order.items) // check + alert if needed
}

// 5. On order status change (admin panel):
export async function onOrderStatusChange(order, customer, newStatus) {
  const templates = {
    confirmed: OrderConfirmed,
    shipped: OrderShipped,
    delivered: OrderDelivered,
    cancelled: OrderCancelled,
    refunded: OrderRefunded,
  }
  const Template = templates[newStatus]
  if (!Template) return

  await sendEmail({
    to: customer.email,
    subject: `Order #${order.id} - ${newStatus}`,
    template: <Template order={order} customer={customer} />
  })

  // If delivered, schedule review request (3 days later)
  if (newStatus === 'delivered') {
    await scheduleReviewRequest(order, customer)
  }
}

// 6. Low stock check:
export async function checkLowStock(items) {
  const settings = await getAppSettings()
  for (const item of items) {
    const product = await getProduct(item.product_id)
    if (product.stock <= settings.low_stock_threshold) {
      await sendEmail({
        to: settings.admin_notification_email,
        subject: `Low Stock Alert: ${product.name}`,
        template: <AdminLowStock product={product} />
      })
    }
  }
}

// 7. On new review:
export async function onNewReview(review, product) {
  await sendEmail({
    to: settings.admin_notification_email,
    subject: `New Review on ${product.name}`,
    template: <AdminNewReview review={review} product={product} />
  })
}

// 8. On contact form:
export async function onContactForm(formData) {
  await sendEmail({
    to: settings.admin_notification_email,
    subject: `Contact Form: ${formData.subject}`,
    template: <AdminContactForm data={formData} />
  })
}
```

---

# REVIEW REQUEST SCHEDULING (3 Days Delay)

```
Option A - Supabase Cron (pg_cron):
SQL function jo daily check kare:
"orders WHERE status='delivered' AND delivered_at < now() - 3 days
 AND review_email_sent = false"
→ Send email → mark review_email_sent = true

Option B - Vercel Cron:
/app/api/cron/review-requests/route.ts
vercel.json mein cron schedule: daily
Same logic as above

Recommended: Vercel Cron (simpler with Next.js)
```

```javascript
// vercel.json
{
  "crons": [{
    "path": "/api/cron/review-requests",
    "schedule": "0 10 * * *"  // Daily 10 AM
  }]
}
```

---

# EMAIL TEMPLATE EXAMPLE

```tsx
// /lib/email/templates/OrderPlaced.tsx
import {
  Html, Head, Body, Container, Text, Button, Img, Hr
} from '@react-email/components'

export default function OrderPlaced({ order, customer, settings }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f4' }}>
        <Container style={{ background: '#fff', padding: '24px' }}>
          {settings.logo_url && <Img src={settings.logo_url} width="120" />}
          <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Thank you for your order, {customer.name}!
          </Text>
          <Text>Order #{order.id} has been received.</Text>
          
          <Hr />
          {order.items.map(item => (
            <Text key={item.id}>
              {item.name} x{item.quantity} — {settings.currency} {item.price}
            </Text>
          ))}
          <Hr />
          
          <Text style={{ fontWeight: 'bold' }}>
            Total: {settings.currency} {order.total}
          </Text>
          
          <Button
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${order.id}`}
            style={{ background: '#000', color: '#fff', padding: '12px 24px' }}
          >
            View Order
          </Button>
          
          <Text style={{ fontSize: '12px', color: '#888', marginTop: '24px' }}>
            {settings.brand_name} | {settings.contact_email}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

---

# TEST EMAIL FEATURE

```
Admin Settings → Email tab → "Send Test Email" button

/app/api/settings/test-email/route.ts:
POST → sends simple test email to admin_notification_email
Returns success/failure
Shows: "✅ Email sent!" or "❌ Error: invalid credentials"
```

---

# COMPLETE CHECKLIST

## Agent Ka Kaam:
```
□ npm install nodemailer @react-email/components @react-email/render
□ /lib/email/sendEmail.ts - core sender
□ /lib/email/triggers.ts - all trigger functions
□ /lib/email/templates/*.tsx - 15 templates
□ Integrate triggers in:
  - Auth register/login routes
  - Forgot password route
  - Checkout/order placement route
  - Admin order status update route
  - Review submission route
  - Contact form route
□ /app/api/cron/review-requests/route.ts
□ vercel.json cron config
□ /app/api/settings/test-email/route.ts
□ app_settings table columns (email related)
□ Email notification toggles check before each send
```

## Tera Manual Kaam:
```
1. Gmail App Password generate karo:
   myaccount.google.com → Security →
   2-Step Verification ON →
   App Passwords → Generate

2. Admin Settings → Email Tab:
   - Gmail address daalo
   - App password paste karo
   - From Name set karo
   - Admin notification email set karo
   - Low stock threshold set karo
   - Notification toggles check karo
   - "Send Test Email" → verify

3. Vercel Cron (review requests):
   Vercel automatically vercel.json read karta hai
   Free plan: 2 cron jobs allowed, 1x/day
```

---

# GOLDEN RULES

```
1. Gmail credentials = Settings table, NOT env
2. App Password ZAROORI hai, normal password kaam nahi karega
3. Har email type ka toggle ON/OFF check karo before sending
4. Templates = React Email (responsive + professional)
5. Review request = 3 din baad, cron job se
6. Test email button = verify before going live
7. Low stock check = order place hone par automatic
8. Admin emails = admin_notification_email pe (alag from smtp_email ho sakta hai)
9. Email errors = log karo but order process block na ho
   (email fail = order phir bhi successful rahe)
```

---

# ═══════════════════════════════
# PART 14 — EMAIL TEMPLATE EDITOR (Shopify Style)
# ═══════════════════════════════

## Overview
```
Har email type ke liye:
✅ Enable/Disable toggle (alag alag)
✅ Built-in default template (Shopify style design)
✅ Custom template editor (admin apna design bana sake)
✅ Variables/placeholders (order items, images, address etc)
✅ Live Preview (sample data ke saath)
✅ Reset to Default button

Single source of truth: email_templates table
(Purana email_notifications jsonb is table mein merge ho jata hai)
```

---

## Supabase Table - email_templates

```sql
create table email_templates (
  id uuid primary key default gen_random_uuid(),
  email_type text unique not null,
  -- e.g. 'welcome', 'order_placed', 'admin_new_order' etc

  category text not null, -- 'customer' | 'admin'
  label text not null,     -- "Order Placed", "New Order Alert"
  description text,        -- "Sent when customer completes checkout"

  enabled boolean default true,

  subject text not null,   -- supports {{variables}}
  custom_html text,        -- NULL = use built-in default template
                            -- non-null = admin's custom HTML

  updated_at timestamptz default now()
);

-- Seed all email types:
insert into email_templates (email_type, category, label, description, subject) values
('welcome', 'customer', 'Welcome Email', 'Sent when customer registers', 'Welcome to {{brand_name}}!'),
('password_reset', 'customer', 'Password Reset', 'Sent on forgot password', 'Reset your {{brand_name}} password'),
('password_changed', 'customer', 'Password Changed', 'Sent after password change', 'Your password was changed'),
('order_placed', 'customer', 'Order Placed', 'Sent when order is placed', 'Order Confirmation #{{order_id}}'),
('order_confirmed', 'customer', 'Order Confirmed', 'Sent when admin confirms order', 'Your order #{{order_id}} is confirmed'),
('order_processing', 'customer', 'Order Processing', 'Sent when order is being prepared', 'Your order #{{order_id}} is being prepared'),
('order_shipped', 'customer', 'Order Shipped', 'Sent when order ships', 'Your order #{{order_id}} has shipped!'),
('order_out_for_delivery', 'customer', 'Out For Delivery', 'Sent when courier picks up for delivery', 'Your order #{{order_id}} is out for delivery'),
('order_delivered', 'customer', 'Order Delivered', 'Sent when order delivered', 'Your order #{{order_id}} has been delivered'),
('order_cancelled', 'customer', 'Order Cancelled', 'Sent when order cancelled', 'Your order #{{order_id}} was cancelled'),
('order_refunded', 'customer', 'Order Refunded', 'Sent when refund processed', 'Refund processed for order #{{order_id}}'),
('review_request', 'customer', 'Review Request', 'Sent 3 days after delivery', 'How was your order from {{brand_name}}?'),
('admin_new_order', 'admin', 'New Order Alert', 'Sent to admin on new order', 'New Order #{{order_id}} - {{order_total}}'),
('admin_order_cancelled', 'admin', 'Order Cancelled Alert', 'Sent to admin when order cancelled', 'Order #{{order_id}} was cancelled'),
('admin_low_stock', 'admin', 'Low Stock Alert', 'Sent when stock is low', 'Low Stock: {{product_name}}'),
('admin_new_customer', 'admin', 'New Customer Alert', 'Sent on new registration', 'New customer: {{customer_name}}'),
('admin_new_review', 'admin', 'New Review Alert', 'Sent on new review', 'New review on {{product_name}}'),
('admin_contact_form', 'admin', 'Contact Form Alert', 'Sent on contact form submit', 'Contact Form: {{contact_subject}}');
```

---

## Available Variables (Per Email Type)

```
COMMON (all emails):
{{brand_name}}      → Store name
{{site_url}}        → Website URL
{{customer_name}}   → Customer's name
{{customer_email}}  → Customer's email
{{contact_email}}   → Store contact email
{{currency}}        → PKR/USD etc
{{current_year}}    → For copyright footer

ORDER EMAILS (order_placed, confirmed, shipped, delivered etc):
{{order_id}}           → Order number
{{order_date}}         → Order date
{{order_total}}        → Total amount
{{order_subtotal}}     → Subtotal
{{order_shipping_fee}} → Shipping cost
{{order_status}}       → Current status
{{order_items}}        → LOOP - renders table of items:
   For each item:
   {{item.image}}      → Product image URL
   {{item.name}}       → Product name
   {{item.variation}}  → Size/Color e.g. "Red, Large"
   {{item.quantity}}   → Qty
   {{item.price}}      → Unit price
   {{item.total}}      → Line total

ADDRESS:
{{shipping_address.name}}
{{shipping_address.phone}}
{{shipping_address.street}}
{{shipping_address.city}}
{{shipping_address.full}}  → Formatted full address block

SHIPPING:
{{tracking_number}}
{{courier_name}}
{{tracking_url}}
{{estimated_delivery}}

CANCELLATION/REFUND:
{{cancel_reason}}
{{refund_amount}}

AUTH:
{{reset_link}}     → Password reset URL (1hr expiry)

ADMIN EMAILS:
{{admin_panel_url}}    → Link to view in admin
{{product_name}}
{{product_stock}}
{{review_rating}}
{{review_text}}
{{review_author}}
{{contact_name}}
{{contact_subject}}
{{contact_message}}
```

---

## Order Items Loop Syntax (Shopify Style)

```html
<!-- Template HTML mein yeh likha hota hai: -->
{{#each order_items}}
  <tr>
    <td><img src="{{this.image}}" width="60" /></td>
    <td>
      {{this.name}}<br/>
      <small>{{this.variation}}</small><br/>
      Qty: {{this.quantity}}
    </td>
    <td>{{currency}} {{this.total}}</td>
  </tr>
{{/each}}
```

```
Agent isko handle karega using a simple template
engine (handlebars-style {{#each}} loops, or
simpler: render order_items as pre-built HTML
string and inject via {{order_items_html}})

RECOMMENDED (simpler, more reliable):
Use {{order_items_html}} as single variable that
contains pre-rendered HTML table rows.
Admin's custom template just places
{{order_items_html}} where they want the table.
```

---

## Admin UI - Email Templates Page

```
/admin/settings/email/templates

┌──────────────────────────────────────────────┐
│ Email Templates                              │
├──────────────────────────────────────────────┤
│ CUSTOMER EMAILS                              │
│ ┌────────────────────────────────────────┐  │
│ │ ✅ Welcome Email          [Edit] [👁]   │  │
│ │ ✅ Password Reset         [Edit] [👁]   │  │
│ │ ✅ Password Changed       [Edit] [👁]   │  │
│ │ ✅ Order Placed           [Edit] [👁]   │  │
│ │ ✅ Order Confirmed        [Edit] [👁]   │  │
│ │ ✅ Order Processing       [Edit] [👁]   │  │
│ │ ✅ Order Shipped          [Edit] [👁]   │  │
│ │ ✅ Out For Delivery       [Edit] [👁]   │  │
│ │ ✅ Order Delivered        [Edit] [👁]   │  │
│ │ ☐  Order Cancelled        [Edit] [👁]   │  │
│ │ ✅ Order Refunded         [Edit] [👁]   │  │
│ │ ✅ Review Request         [Edit] [👁]   │  │
│ └────────────────────────────────────────┘  │
│                                               │
│ ADMIN EMAILS                                 │
│ ┌────────────────────────────────────────┐  │
│ │ ✅ New Order Alert        [Edit] [👁]   │  │
│ │ ✅ Order Cancelled Alert  [Edit] [👁]   │  │
│ │ ✅ Low Stock Alert        [Edit] [👁]   │  │
│ │ ✅ New Customer Alert     [Edit] [👁]   │  │
│ │ ✅ New Review Alert       [Edit] [👁]   │  │
│ │ ✅ Contact Form Alert     [Edit] [👁]   │  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘

✅/☐ = Enable/Disable toggle (clickable, instant save)
[Edit] = Opens template editor
[👁] = Quick preview with sample data
```

---

## Template Editor Modal/Page

```
/admin/settings/email/templates/[type]

┌─────────────────────────────────────────────────┐
│ Edit: Order Placed                    [✕ Close] │
├─────────────────────────────────────────────────┤
│ Status: [✅ Enabled]                             │
│                                                   │
│ Subject Line:                                    │
│ [Order Confirmation #{{order_id}}_____________] │
│                                                   │
│ Template Mode:                                   │
│ ⦿ Use Default Template (Shopify-style, built-in)│
│ ○ Custom Template (edit HTML below)              │
│                                                   │
│ ─── If Custom selected ───                       │
│ Available Variables: [Click to insert ▼]         │
│   {{customer_name}} {{order_id}} {{order_total}} │
│   {{order_items_html}} {{shipping_address.full}} │
│   {{site_url}} {{brand_name}} ... [show all]     │
│                                                   │
│ HTML Editor:                                     │
│ ┌───────────────────────────────────────────┐   │
│ │ <html>                                    │   │
│ │ <body style="font-family:sans-serif">    │   │
│ │   <h1>Thanks {{customer_name}}!</h1>     │   │
│ │   <p>Order #{{order_id}} received</p>   │   │
│ │   {{order_items_html}}                   │   │
│ │   <p>Total: {{order_total}}</p>          │   │
│ │ </body></html>                           │   │
│ └───────────────────────────────────────────┘   │
│                                                   │
│ [👁 Preview with Sample Data]                    │
│ [↺ Reset to Default]  [💾 Save]                  │
└─────────────────────────────────────────────────┘
```

---

## Preview System

```
"Preview" button click pe:

1. Generate SAMPLE DATA for that email type:
   sample_order = {
     id: '1234',
     items: [
       { image: '/sample-product.jpg', name: 'Blue Cotton Shirt',
         variation: 'Red, Large', quantity: 2, price: 1200, total: 2400 },
       { image: '/sample-product-2.jpg', name: 'Kids Cap',
         variation: 'One Size', quantity: 1, price: 500, total: 500 }
     ],
     subtotal: 2900, shipping_fee: 200, total: 3100,
     status: 'placed', date: 'Today'
   }
   sample_address = {
     name: 'Ali Khan', phone: '+923001234567',
     street: 'House 123, Block A', city: 'Lahore',
     full: 'Ali Khan, House 123, Block A, Lahore'
   }

2. Render template (default OR custom) with sample data
3. Show in iframe/modal - exact email preview
4. "Send Test to My Email" button also available
```

---

## Reset to Default

```
"Reset to Default" button:
- Sets custom_html = NULL for that email_type
- subject stays as admin edited (or also resets - confirm with admin)
- Confirmation dialog: "This will discard your custom
  template. Built-in design will be used. Continue?"
- After reset: template_mode switches back to "Default"
```

---

## Updated Sender Logic

```typescript
// /lib/email/sendEmail.ts - updated

export async function sendTemplatedEmail(
  emailType: string,
  to: string,
  data: Record<string, any>
) {
  const template = await getEmailTemplate(emailType) // from DB

  if (!template.enabled) {
    return { success: false, skipped: true }
  }

  // Build variable map (common + type-specific)
  const variables = buildVariables(emailType, data)

  // Render order_items_html if order data present
  if (data.order?.items) {
    variables.order_items_html = renderOrderItemsTable(data.order.items)
  }

  const subject = replaceVariables(template.subject, variables)

  let html: string
  if (template.custom_html) {
    // Use admin's custom template
    html = replaceVariables(template.custom_html, variables)
  } else {
    // Use built-in default React Email template
    html = render(getDefaultTemplate(emailType, variables))
  }

  return sendEmail({ to, subject, html })
}

function replaceVariables(text: string, vars: Record<string, any>) {
  return text.replace(/\{\{(\w+(?:\.\w+)?)\}\}/g, (match, key) => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], vars)
    return value ?? match
  })
}
```

---

## Default Templates (Shopify Style - Built-in)

```
Agent banayega for each email_type, a default
React Email component matching Shopify's visual
style:

- Clean white background, centered container (600px)
- Brand logo at top (default_og_image or brand_name text)
- Order items shown as table:
  [thumbnail image] [name + variation] [qty] [price]
- Subtotal/Shipping/Total breakdown
- Shipping address block
- Status badge/icon (colored based on status)
- CTA button (View Order / Track Order / Leave Review)
- Footer: brand_name, contact_email, social links,
  unsubscribe note for marketing (not transactional)

These are the FALLBACK when custom_html is NULL.
Used as the "Reset to Default" target.
```

---

## Order Fulfillment Status Flow (Complete)

```
Order Lifecycle → Email Triggered:

1. placed         → order_placed (customer) +
                     admin_new_order (admin)
2. confirmed      → order_confirmed (customer)
3. processing     → order_processing (customer)
4. shipped        → order_shipped (customer)
                     with tracking info
5. out_for_delivery → order_out_for_delivery (customer)
6. delivered      → order_delivered (customer)
                     → schedules review_request (+3 days)
7. cancelled      → order_cancelled (customer) +
                     admin_order_cancelled (admin)
8. refunded       → order_refunded (customer)

Admin order status dropdown should have all these
statuses. Each status change → matching email
(if enabled).
```
