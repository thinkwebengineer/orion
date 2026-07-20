# Payment Gateway Options — Golden Mycology

## Recommended Stack

| Gateway | For | Fee | Setup | Notes |
|---|---|---|---|---|
| **Stripe** | Credit/debit cards, Apple Pay, Google Pay | 2.9% + $0.30/txn | Free, 3–5 day approval | Primary processor — handles 80%+ of orders |
| **Coinbase Commerce** | Crypto (BTC, ETH, USDC, 10+ chains) | 0% per txn | Free, instant | No processing fees. User pays network gas. |
| **Zelle** | Bank transfer (manual fallback) | $0 | Free | No API. Requires manual reconciliation. Good for repeat customers. |

## Stripe — Full Breakdown

| Item | Cost |
|---|---|
| Per transaction (card present) | 2.7% + $0.05 |
| Per transaction (online) | 2.9% + $0.30 |
| International card | +1.5% |
| Currency conversion | +1% |
| Chargeback fee | $15 (refundable if you win) |
| Monthly fee | $0 (no minimum) |
| Stripe Tax | $0.50/mo per registered state |
| Stripe Radar (fraud protection) | $0.02/txn (optional, first 10k free) |

**Payouts:** 2 business day rolling. First payout takes 7 days.

**What you need to sign up:** EIN or SSN, bank account, business details. Approval is typically instant for straightforward businesses. Mycology supplies are generally fine — Stripe's restricted business list prohibits live cultures of Schedule I substances, but spore swabs and microscopy supplies are standard commodity items. **Worth noting**: your product descriptions need to stay in "for microscopy / taxonomy / research use only" territory for genetics products to stay compliant with Stripe's ToS.

## Coinbase Commerce — Full Breakdown

| Item | Cost |
|---|---|
| Per transaction | 0% |
| Monthly fee | $0 |
| Settlement | Immediately in crypto (convert to USD via Coinbase exchange if desired) |

**Pros:** Zero processing fees. No chargeback risk (crypto is final). Supports 10+ chains.

**Cons:** Price volatility (USDC stablecoin mitigates this). Customer needs crypto wallet. Lower conversion rate than card payments (~5–10% of customers will use it).

**Flow:** Customer chooses crypto → redirected to Coinbase hosted checkout → Coinbase monitors blockchain → webhook notifies your server → order confirmed.

## Zelle — Full Breakdown

| Item | Cost |
|---|---|
| Per transaction | $0 |
| Monthly fee | $0 |

**Pros:** Universal with US bank accounts. No fees. Instant settlement.

**Cons:** No API — fully manual. Customer must remember to include order reference. No buyer protection (chargeback risk is yours). Not scalable past ~20 orders/month without dedicated staff.

**Recommended for:** Repeat customers, local pickup, or as a "pay by bank" option with manual confirmation.

## Alternatives Evaluated (not recommended for v1)

| Gateway | Why not |
|---|---|
| **PayPal** | High fees (3.49% + $0.49), holds funds for new accounts, PayPal disputes favor buyers heavily. Only add if customers specifically request it. |
| **Square** | Better for physical retail. Online API is weaker than Stripe. Same rates. |
| **Shopify Payments** | Locks you into Shopify. Not applicable here. |
| **BTC-only (BTCPay Server)** | Self-hosted, free. Zero fees. But requires managing your own wallet + server. Good for v2 to eliminate Coinbase dependency. |
| **NowPayments / CoinPayments** | Crypto gateways with 0.5% fees. Lower trust than Coinbase. Consider as Coinbase backup. |

## Recommended v1 Setup

```
Total effective cost estimate for first 100 orders ($20 avg):
  Stripe (80 orders): 80 × ($20 × 2.9% + $0.30) = $70.40
  Coinbase (10 orders): $0 (crypto)
  Zelle (10 orders): $0 (manual)
  Stripe Tax (1 state): $0.50/mo

Total: ~$70.40 + $0.50/mo = ~$76/mo in processing fees
  Realistically ~30% lower once Stripe's volume discounts kick in
```
