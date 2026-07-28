# Golden Mycology – Cost Analysis & Scaling Guide

## Overview
This document summarizes the recurring costs, free‑tier limits, and upgrade triggers for the services used in the Golden Mycology stack:
- **Vercel** (Hobby plan – free)
- **Supabase** (Free → Pro → Team/Enterprise)
- **Domain** (Cloudflare‑registered)
- **Stripe** (processing & tax)
- **Optional**: Coinbase Commerce, Zelle (no platform fees)

---

## 1. Recurring Baseline Costs (Monthly Approx.)

| Item | Plan / Fee | Monthly Cost | Notes |
|------|------------|--------------|-------|
| **Vercel** | Hobby (free) | $0 | Sufficient for preview & production builds; bandwidth & serverless limits are generous for a small store. |
| **Supabase** | Pro (when upgraded) | $25.00 | Includes 8 GB DB, 250 GB egress (uncached/cached), 100 GB storage, etc. |
| **Domain** | `goldenmycology.com` (Cloudflare) | ≈ $0.92 | €10.46 / yr ≈ $11.20 / yr → $0.93 / mo. |
| **Stripe Tax** | Automatic tax calculation (US‑CO) | $0.50 | Flat fee for Colorado sales‑tax service. |
| **Stripe Processing** | 2.9 % + $0.30 per successful charge | Variable | Only applies when a sale occurs. |
| **Shipping** | Flat $15 (passed to customer) | $0 (cost to you) | You collect $15 per order; actual carrier cost varies. |

**Approx. fixed monthly baseline (once Supabase is on Pro):**  
$25.00 + $0.92 + $0.50 ≈ **$26.42 / mo**

If you stay on Supabase Free, the baseline drops to ~**$1.42 / mo** (domain + tax) but you risk hitting hard limits (see §2).

---

## 2. Supabase Free‑Tier Limits & Upgrade Triggers

| Resource | Free Quota | What Happens When Exceeded | Safe‑Margin Upgrade Trigger |
|----------|------------|---------------------------|----------------------------|
| **Database size** | 500 MB per project | Write operations fail with “out of disk space”. | ≥ 400 MB used → plan upgrade. |
| **Monthly Active Users (MAU)** | 50 000 (org‑wide) | Auth APIs return 429 Too Many Requests. | ≥ 40 k MAU/month → upgrade. |
| **Egress (bandwidth)** | 5 GB uncached + 5 GB cached (total 10 GB) | Additional GB billed at $0.09/GB (uncached) or $0.03/GB (cached); possible throttling. | ≥ 8 GB/month combined → upgrade. |
| **File Storage** | 1 GB | Uploads fail with “quota exceeded”. | ≥ 800 MB used → upgrade. |
| **Realtime** | 2 M messages / 200 peak connections | Messages dropped or connections rejected. | ≥ 1.5 M messages **or** ≥ 150 peak connections → upgrade. |
| **Edge Functions** | 500 k invocations | Invocations return 429 or are delayed. | ≥ 400k invocations/month → upgrade. |
| **Project pausing** | Free project pauses after 1 week of inactivity | Brief cold‑start on first request after inactivity (noticeable for storefront). | If you require 24/7 uptime → upgrade to avoid pause. |

### Practical Guidance
- Monitor the **Usage** page in Supabase Dashboard (Project → Settings → Usage).
- Set up alerts (via Supabase billing notifications or a simple cron hitting the usage API) when any metric reaches **≈ 70 %** of its free quota.
- Watch for **429 responses** in your logs (auth/API) – early indicator of MAU/egress pressure.
- Regularly run `VACUUM`/`ANALYZE` and check table sizes (`pg_total_relation_size('table_name')`) to anticipate DB growth.
- Optimize assets: serve images via Supabase Storage + Smart CDN to keep egress low; stay within free image‑transform limits if you use them.

### When to Upgrade to **Supabase Pro** ($25/mo)
- Any one of the above metrics crosses its safe‑margin threshold.
- You need guaranteed uptime (no weekly pause).
- You want higher limits for DB (8 GB included), egress (250 GB each), storage (100 GB), and add‑ons like point‑in‑time recovery, branching, etc.

Beyond Pro, **Team** or **Enterprise** plans provide dedicated resources, higher SLAs, and custom limits—consider these only if you exceed Pro’s included amounts (e.g., multi‑GB DB, > 250 GB egress, > 100 GB storage, heavy Realtime/Edge usage).

---

## 3. Vercel Hobby Limits (Free)

| Resource | Free Quota | When You Might Need Vercel Pro |
|----------|------------|--------------------------------|
| **Bandwidth** | 100 GB/mo (soft; overages billed) | Consistently > 80 GB/mo (e.g., large media served directly from Vercel). |
| **Serverless execution** | 100 GB‑hours/mo | Heavy compute‑intensive API routes consuming > 80 GB‑hr/mo. |
| **Concurrent builds** | 1 (only one build at a time) | Many parallel preview builds (large team, many feature branches). |
| **Edge Middleware** | 1 M requests/mo | Heavy middleware logic exceeding ~800k requests/mo. |

For a typical e‑commerce store with mostly static pages + a few API routes (Supabase handles DB/Auth/storage), **Hobby remains sufficient** for the foreseeable future. Monitor your Vercel usage dashboard if you notice steadily rising bandwidth or execution time.

---

## 4. Projected Cost Timeline

| Phase | Approx. Usage | Supabase Tier | Monthly Cost* |
|-------|---------------|---------------|--------------|
| **Launch / Early traction** | < 200 MB DB, < 10 k MAU, < 2 GB egress, < 200 MB storage | **Free** | $0 (Supabase) + $0.92 (domain) + $0.50 (Stripe Tax) ≈ **$1.42 / mo** |
| **Growth** | 400‑600 MB DB, 30‑45 k MAU, 5‑12 GB egress, 500‑800 MB storage | **Free → Upgrade to Pro** (when any metric hits safe‑margin) | $25.00 (Pro) + $0.92 + $0.50 ≈ **$26.42 / mo** (plus any minor egress/storage overages if you exceed Pro’s included amounts) |
| **Scale** | 2‑5 GB DB, 80‑150 k MAU, 30‑80 GB egress, 2‑5 GB storage | **Pro** (still within included limits) | $25.00 + domain + tax ≈ **$26.42 / mo** (overages only if you exceed Pro’s hard caps) |
| **High‑scale / Enterprise** | > 5 GB DB, > 150 k MAU, > 100 GB egress, > 10 GB storage, heavy Realtime/Edge usage | Consider **Team** or **Enterprise** (custom pricing) | Variable (contact sales) + domain + tax |

\*Only the recurring Supabase fee shown; domain (~$0.92/mo) and Stripe Tax ($0.50/mo) are fixed. Stripe processing fees are transaction‑based (2.9 % + $0.30 per successful charge) and not included in the monthly baseline.

---

## 5. Monitoring & Alerting Checklist

- [ ] **Supabase Usage**: Review DB size, MAU, egress, storage, Realtime, Edge Functions weekly.
- [ ] **Set Alerts**: Use Supabase → Settings → Billing → Notifications or create a cron that calls the Supabase Usage API and emails/Telegrams you when any metric > 70 % of free quota.
- [ ] **Log 429 Responses**: Capture auth/API 429 errors in your logging stack (e.g., Sentry, Logtail) to detect quota hits early.
- [ ] **Database Size**: Run `SELECT pg_total_relation_size('tablename');` for core tables; ensure total < 400 MB before upgrading.
- [ ] **Asset Optimization**: Enable Supabase Smart CDN for Storage; compress/images serve via CDN to lower egress.
- [ ] **Vercel Usage**: Check your Vercel dashboard → Usage → Bandwidth, Serverless Execution, Builds.
- [ ] **DNS**: Ensure `goldenmycology.com` CNAME → `cname.vercel-dns.com` (Cloudflare, DNS‑only) so Vercel can verify and serve the site.
- [ ] **Supabase SMTP/Site URL**: Verify in Supabase → Authentication → Settings:
    - Site URL = `https://orion-blue-psi.vercel.app` (your QA URL)
    - Redirect URLs include `https://orion-blue-psi.vercel.app/reset-password`
    - Custom SMTP: Host `smtp.resend.com`, Port `465`, User `resend`, Password = your Resend API Key, From `noreply@goldenmycology.com`.

---

## 6. Quick Action Items (Now)

1. **Check current Supabase usage** → Project → Settings → Usage.  
   - If any metric is approaching its free quota, note the trend and plan an upgrade to Pro before hitting the hard limit.
2. **Confirm DNS CNAME** for `goldenmycology.com` points to `cname.vercel-dns.com` with proxy **off** (DNS‑only) in Cloudflare.  
3. **Set Production Branch** in Vercel Dashboard (Settings → Git → Production Branch) to `production` (so pushes to `production` deploy to `goldenmycology.com`).  
4. **Test Password‑Reset Flow** on the QA URL (`https://orion-blue-psi.vercel.app/forgot-password`) to confirm Supabase SMTP + Site URL are correct.  
5. **Add this file** to your repo (already done) for team reference.

---

### Closing Note
Your fixed monthly spend will stay around **$26–$27** once Supabase is on Pro, with only transaction‑based Stripe fees and optional usage overages as variables. Monitoring the usage metrics outlined above will let you upgrade smoothly before any service degradation occurs.

*Happy scaling!*