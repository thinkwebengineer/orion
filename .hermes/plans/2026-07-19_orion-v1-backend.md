# Golden Mycology — Backend Architecture & Delivery Plan

Status: **DRAFT — needs user sign-off before building**
Last updated: 2026-07-19

---

## 1. Architecture Overview

```
Vercel (Next.js API Routes + Frontend)
    │
    ├── Stripe API (primary payments)
    ├── Coinbase Commerce API (crypto payments)
    └── Supabase (PostgreSQL + Auth + Storage + Realtime)
```

**Why this stack:**
- Single codebase (Next.js) serves both frontend and API — no CORS headaches, shared types
- Supabase handles DB, auth, file storage, and row-level security out of the box
- Vercel eliminates sysadmin: zero-downtime deploys, auto-scaling, SSL, CDN
- ~$25–$50/mo all-in (Vercel Pro + Supabase Pro), no ops time beyond the initial build

**What you give up compared to a VPS:**
- No SSH access to the database (Supabase web UI + pg client instead)
- Vendor lock-in (but both are standard PostgreSQL + React — portable)
- Cost scales with usage (but for a small shop this is negligible)

---

## 2. Data Model

### Core Tables (Supabase PostgreSQL)

```
products
  id: uuid PK
  name, subtitle, brand, category, subcategory
  price: decimal
  variants: jsonb [{label, price}]
  description, features: text[]
  images: text[]  (Supabase Storage URLs)
  rating: decimal, review_count: int
  inventory: int  (NULL = made-to-order / infinite)
  for_microscopy_only: boolean
  featured: boolean
  tags: text[]
  created_at, updated_at

orders
  id: uuid PK
  user_id: uuid FK (nullable — anonymous orders)
  email: text
  shipping_name, street, city, state, zip
  items: jsonb [{product_id, variant_label, name, price, quantity, image}]
  subtotal: decimal, shipping: decimal, tax: decimal, total: decimal
  payment_method: text (stripe | zelle | crypto)
  payment_status: text (pending | confirmed | failed | refunded)
  stripe_payment_intent_id: text (nullable)
  crypto_tx_id: text (nullable)
  fulfillment_status: text (pending | processing | shipped | delivered)
  tracking_number: text (nullable)
  notes: text (admin only)
  created_at, updated_at

users
  id: uuid PK (Supabase Auth managed)
  email: text
  full_name: text
  shipping_addresses: jsonb[] (saved addresses)
  is_admin: boolean
  created_at

reviews
  id: uuid PK
  product_id: uuid FK
  user_id: uuid FK
  rating: int (1-5)
  body: text
  created_at

blog_posts
  id: uuid PK
  title, slug, body: text
  published: boolean
  author_id: uuid FK
  created_at, updated_at

sessions (implicitly handled by Supabase Auth)

crypto_payments
  id: uuid PK
  order_id: uuid FK
  coinbase_charge_id: text
  status: text (new | pending | confirmed | failed | expired)
  currency: text
  amount: decimal
  hosted_url: text (Coinbase hosted checkout)
  created_at
```

### Row-Level Security (Supabase RLS)
- Products: public read, admin write
- Orders: user reads own + admin reads all, user creates own
- Users: user reads own profile, admin reads all
- Reviews: public read, authenticated user create, user + admin update/delete
- Blog: public read published, admin CRUD

---

## 3. Payment Architecture

### Stripe (primary, automated)
```
Checkout flow:
  1. Frontend: /api/create-checkout-session
     → Creates Stripe Checkout Session with line items
     → Creates order in DB with payment_status: 'pending'
     → Returns session URL → redirect user
  
  2. Stripe Checkout (hosted page):
     → User enters card details on Stripe's PCI-compliant page
     → Stripe handles all card data — we never touch PAN/CVV
  
  3. Webhook: POST /api/stripe/webhook
     → Stripe sends checkout.session.completed
     → We update order payment_status → 'confirmed'
     → Sends order confirmation email
     → Notifies admin of new order
```

### Crypto (via Coinbase Commerce, semi-automated)
```
  1. Frontend: POST /api/create-crypto-charge
     → Creates charge on Coinbase Commerce API
     → Returns hosted checkout URL → redirect user
  
  2. Coinbase Commerce hosted page:
     → User pays in BTC/ETH/USDC/etc.
     → Coinbase monitors the blockchain and sends webhook
  
  3. Webhook: POST /api/coinbase/webhook
     → Coinbase sends charge:confirmed event
     → We update order payment_status → 'confirmed'
     → Same flow as Stripe from this point
```

### Zelle (manual, pending)
```
  1. Frontend: Show Zelle payment instructions on order confirmation
     → Order placed with payment_status: 'pending_zelle'
     → Show Zelle email/phone number + order reference number
  
  2. Admin dashboard:
     → Admin sees order in "Pending Zelle Confirmation" list
     → Checks bank for incoming payment
     → Clicks "Confirm Payment" → updates payment_status → 'confirmed'
     → System sends confirmation email to customer
  
  3. Future: A "pending" bucket until Zelle gets an API (unlikely)
```

**PCI compliance note:** With Stripe Checkout and Coinbase Commerce, your server **never touches** raw credit card numbers or crypto private keys. Your PCI scope is essentially zero — you're just passing the user to a hosted payment page and listening for webhook results.

---

## 4. API Routes (Next.js App Router)

```
/api
  /products
    GET — list with filters (?category, ?brand, ?featured, ?search)
    GET /[id] — single product
    POST — admin: create product
  
  /orders
    POST — create order (called after payment confirmed)
    GET — user: list own orders, admin: list all
    GET /[id] — user: own, admin: any
    PATCH /[id]/status — admin: update fulfillment
  
  /auth
    POST /register — email + password account creation
    POST /login — Supabase Auth handles this
    POST /logout
    GET /me — current user profile
  
  /checkout
    POST /create-stripe-session — creates Stripe Checkout Session
    POST /create-crypto-charge — creates Coinbase Commerce charge
    POST /confirm-zelle — marks order as pending_zelle
  
  /webhooks
    POST /stripe — Stripe event handler
    POST /coinbase — Coinbase Commerce event handler
  
  /blog
    GET — list published posts
    GET /[slug] — single post
    POST — admin: create post
    PATCH /[id] — admin: update
    DELETE /[id] — admin: delete
  
  /reviews
    GET — list for product (?product_id)
    POST — create review
  
  /admin
    GET /orders — list all with pagination + filters
    GET /products — list all including unpublished
    PATCH /orders/[id] — update fulfillment status, tracking, notes
    PATCH /products/[id] — update product
    POST /products — create product
    POST /blog — create blog post
    GET /dashboard — stats (orders today, revenue, pending count)
```

---

## 5. Frontend Changes from v0

### What stays
- All existing components (HeroBanner, CategoryGrid, etc.)
- Cart context with localStorage
- CategoryPages with sidebar
- 4-step checkout wizard (needs refit)

### What changes

| v0 (static) | v1 (live) |
|---|---|
| Products from JSON file | Products from Supabase via API |
| Cart → 4-step wizard → JSON display | Cart → 4-step wizard → Stripe/Crypto/Zelle checkout |
| No auth | Supabase Auth (login/register) + protected routes |
| No blog | Blog page with posts from DB |
| No reviews | Review section on product pages |
| Edit JSON + git push to update | Admin dashboard for everything |

### Domain + Environment Variables

```
NEXT_PUBLIC_SITE_URL=https://goldenmycology.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
COINBASE_COMMERCE_API_KEY=...
COINBASE_COMMERCE_WEBHOOK_SECRET=...
SMTP_HOST=... (SendGrid / Resend for order emails)
```

---

## 6. Admin Dashboard

Built as a subdirectory: `/admin/*` — protected by Supabase Auth + RLS.

### Pages
- `/admin` — Dashboard: revenue chart, pending orders count, recent orders list, low-stock alerts
- `/admin/orders` — Table: order #, customer, total, payment status, fulfillment status, date. Filterable by status. Click → order detail page
- `/admin/orders/[id]` — Order detail: line items, shipping info, payment info. Actions: mark paid, mark shipped (enter tracking), add notes
- `/admin/products` — Table: name, category, price, inventory, featured. Click → edit
- `/admin/products/new` + `/admin/products/[id]/edit` — Form: all product fields, image upload
- `/admin/blog` — Table: posts, publish status. Click → edit
- `/admin/users` — List users, toggle admin status

### Tech approach
- Simple React components with server actions (Next.js App Router)
- Supabase client for data fetching (admin role bypasses RLS via service role key on server)
- shadcn/ui component library for tables, forms, dialogs (fast to build, looks professional)

---

## 7. Email Flow

### Transactional (via Resend or SendGrid)
```
Order confirmed → customer confirmation email (items, total, shipping ETA)
Payment confirmed → payment receipt
Order shipped → tracking number + link
Account created → welcome email
```

### Admin notifications
```
New order → email/text to admin (you said you'll revisit this — placeholder)
```

---

## 8. Deployment Pipeline

```
Push to main → Vercel auto-deploys
  → Migrations run via Supabase CLI in CI
  → Vercel edge functions handle API routes
  → Stripe/Coinbase webhooks point to production URL
```

---

## 9. Budget Sheet

### Monthly Recurring
| Service | Plan | Cost |
|---|---|---|
| Vercel | Pro (or Hobby if traffic is low) | $0–$20/mo |
| Supabase | Pro (10GB DB, 50GB bandwidth, auth) | $25/mo |
| Domain | goldenmycology.com (Porkbun/Cloudflare) | ~$10/yr ($0.83/mo) |
| Resend | Transactional emails (free tier: 100/day) | $0/mo |
| Stripe | 2.9% + $0.30 per transaction | Variable |
| Coinbase Commerce | 0% fee on crypto payments | Free |
| **Total fixed** | | **~$26–$46/mo** |

### One-Time Setup Costs
| Item | Cost |
|---|---|
| Domain registration | ~$10–$15 |
| Stripe account | Free |
| Coinbase Commerce account | Free |
| Supabase account | Free |
| Vercel account | Free |
| **Total setup** | **~$10–$15** |

### People
| Role | Rate |
|---|---|
| You (tech, building) | TBD — track hours |
| Order manager (admin) | Only uses the dashboard, no build time |

---

## 10. OPEN QUESTIONS (need your answers)

1. **Domain** — What domain do you want? `goldenmycology.com`? Something else?

2. **Stripe onboarding** — Do you have a Stripe account already? Stripe requires business details (EIN/SSN, bank account) to receive payouts.

3. **Product images** — The current v0 uses generated placeholder images. For v1, do you have real product photos, or do we keep the placeholders for launch?

4. **Shipping rates** — Hardcoded ($15 flat) or calculated by weight/location? If calculated, we need a shipping API (Shippo/EasyPost) — adds $0–$5/mo plus per-label costs.

5. **Tax** — Collecting sales tax? If yes, which states do you have nexus in? Stripe Tax can handle this automatically (~$0.50/mo per nexus state).

6. **Blog launch** — Do we need blog content at launch, or just the empty pages ready?

7. **How do you want to handle the codebase?** Separate repo for v1 backend or fork the current v0 repo?
