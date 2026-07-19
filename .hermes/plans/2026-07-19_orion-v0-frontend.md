# Orion — v0 Frontend Demo Implementation Plan

> **For Hermes:** Use subagent-driven-development to implement this plan task-by-task.

**Goal:** Build a production-quality static Next.js + Tailwind e-commerce frontend demo for the Golden Mycology × Stikki Bandit collab, with a working cart and 4-step checkout that outputs JSON on submission.

**Architecture:** Next.js 14 App Router with static export (no backend dependency for v0). Product data from local JSON files. Cart state in React Context + localStorage for persistence. Product images generated via FLUX AI. Responsive design from the start.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, React Context + useReducer for cart, localStorage for persistence, JSON data layer

---

## Data Architecture

### Product Categories
- **Genetics** — strains/isolates (Liquid Cultures, Spore Swabs)
- **Supplies** — growing supplies (Agar Plates, Grain Bags, AIO Bags)
- **Merch** — stickers, clothing, accessories

### Product Data Model (`data/products.json`)
Each product:
```json
{
  "id": "enigma-lc",
  "name": "Enigma Liquid Culture",
  "brand": "golden-mycology",
  "category": "genetics",
  "subcategory": "liquid-cultures",
  "price": 19.99,
  "variants": [],
  "rating": 4.9,
  "reviewCount": 128,
  "description": "...",
  "features": ["Made Fresh", "Sterile Technique", "Lab Tested", "Secure Packaging"],
  "images": ["/images/products/enigma-lc-1.jpg"],
  "specs": { "volume": "10ml", "storage": "Refrigerate at 2-8°C" },
  "forMicroscopyOnly": true,
  "featured": true
}
```

### Product variants (price tiers)
Products like Agar Plates and Grain Bags use variants:
```json
{
  "id": "premium-agar-plates",
  "variants": [
    { "label": "10 Pack", "price": 18.00 },
    { "label": "20 Pack", "price": 32.00, "bestValue": true }
  ]
}
```

---

## Route Structure

| Route | Page | Description |
|---|---|---|
| `/` | Homepage | Hero, category grid, featured genetics, brand info |
| `/shop` | Shop Grid | All products |
| `/genetics` | Category Grid | Products with category=genetics |
| `/supplies` | Category Grid | Products with category=supplies |
| `/merch` | Category Grid | Products with category=merch |
| `/product/[id]` | Product Detail | Full PDP with tabs, add to cart |
| `/cart` | Checkout | 4-step checkout wizard |
| `/about` | Placeholder | Basic brand info page |
| `/contact` | Placeholder | Contact form (visual only) |

---

## Tasks

### Task 1: Scaffold Next.js Project

**Objective:** Initialize the Next.js project with Tailwind, organize directory structure

**Files:**
- Create: `Orion/` (Next.js project at this root)

**Steps:**
1. Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` from /home/el-doctor/Orion
2. Verify dev server starts: `npm run dev`
3. Clean out default boilerplate from `src/app/page.tsx`
4. Create directory structure:
```
src/
  app/
    shop/page.tsx
    genetics/page.tsx
    supplies/page.tsx
    merch/page.tsx
    product/[id]/page.tsx
    cart/page.tsx
    about/page.tsx
    contact/page.tsx
  components/
    layout/
    product/
    cart/
    home/
  context/
  data/
    products.json
    categories.json
    site-content.json
  lib/
  types/
public/
  images/
    products/
    brand/
```
5. Install dependencies: `npm install react-icons`

**Verify:** `npm run dev` serves blank page at localhost:3000 with Tailwind working

---

### Task 2: Create Product Data Layer

**Objective:** Define types, write product JSON, build data utility functions

**Files:**
- Create: `src/types/product.ts`
- Create: `src/data/products.json`
- Create: `src/data/categories.json`
- Create: `src/data/site-content.json`
- Create: `src/lib/products.ts`

**Product Data Requirements:**

Products to include (from mock-ups):

*Genetics:*
1. **Enigma Liquid Culture** — Golden Mycology — $19.99 — featured
2. **Emerald Gates Spore Swabs** — Golden Mycology — $14.99 — featured
3. **Albino Jedi Mind Fuck** (LC or swab variant) — Golden Mycology — featured
4. **Gandalf** — Golden Mycology — featured
5. **Toque x Berg** — Golden Mycology — featured
6. **Leucistic Machine Elf** — Golden Mycology — featured
7. **Stormtrooper** — Golden Mycology — featured

*Supplies:*
8. **Premium Agar Plates** — Stikki Bandit — $18.00 (10pk) / $32.00 (20pk) — featured
9. **Premium Grain Bags** — Stikki Bandit — $22.00 (3lb) / $30.00 (5lb) — featured
10. **AIO Bags & Substrate** — Stikki Bandit — various sizes — featured

*Merch:*
11. **Sticker Pack** — Stikki Bandit — $9.99
12. **Collaboration Tee** — Golden Mycology × Stikki Bandit — $34.99
13. **Mycology Hoodie** — Golden Mycology — $54.99

**Categories:**
```json
[
  { "id": "genetics", "name": "Genetics", "slug": "genetics", "icon": "🧬", "description": "Premium liquid cultures, spore swabs, and genetic isolates" },
  { "id": "supplies", "name": "Supplies", "slug": "supplies", "icon": "🔬", "description": "Agar plates, grain bags, AIO bags, and lab tools" },
  { "id": "merch", "name": "Merch", "slug": "merch", "icon": "👕", "description": "Apparel, stickers, and accessories" }
]
```

**Types:**
```typescript
interface ProductVariant {
  label: string;
  price: number;
  bestValue?: boolean;
}

interface Product {
  id: string;
  name: string;
  subtitle?: string;
  brand: "golden-mycology" | "stikki-bandit" | "collab";
  category: "genetics" | "supplies" | "merch";
  subcategory: string;
  price: number;
  variants?: ProductVariant[];
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  images: string[];
  specs?: Record<string, string>;
  forMicroscopyOnly?: boolean;
  featured?: boolean;
  tags: string[];
}
```

**Utility Functions (`src/lib/products.ts`):**
- `getAllProducts(): Product[]`
- `getProductById(id: string): Product | undefined`
- `getProductsByCategory(category: string): Product[]`
- `getFeaturedProducts(): Product[]`
- `getProductsByBrand(brand: string): Product[]`

**Verify:** Import and call functions — `console.log(getAllProducts().length)` returns 13

---

### Task 3: Generate Product Images (FLUX AI)

**Objective:** Generate clean, consistent product images for all 13 products using FLUX

**Approach:** Use the `image_generate` tool with FLUX. For each product, generate a square product shot with dark/cyberpunk aesthetic matching the brand. 2-3 products per batch.

**Image specs:**
- Aspect ratio: square
- Style: Dark background, neon purple/yellow accents, clean product isolation
- Naming: `enigma-lc.png`, `emerald-gates-swabs.png`, etc.

**Images needed:**
1. enigma-lc — syringe on dark background with neon glow
2. emerald-gates-swabs — spore swab packaging
3. albino-jedi-mind-fuck — LC syringe
4. gandalf — LC syringe
5. toque-x-berg — LC syringe
6. leucistic-machine-elf — LC syringe
7. stormtrooper — LC syringe
8. premium-agar-plates — stack of agar plates
9. premium-grain-bags — grain bag
10. aio-bags — all-in-one bag
11. sticker-pack — sticker sheet
12. collab-tee — t-shirt
13. mycology-hoodie — hoodie

Also generate:
14. logo-gm.png — Golden Mycology logo/mascot (mushroom emblem)
15. logo-sb.png — Stikki Bandit logo (SB with bandit mask)
16. hero-bg.jpg — Cyberpunk marketplace background for hero

**Verify:** All 16 images exist in `public/images/products/` and `public/images/brand/`

---

### Task 4: Build Cart Context

**Objective:** Create React Context + useReducer for cart state with localStorage persistence

**Files:**
- Create: `src/context/CartContext.tsx`
- Create: `src/types/cart.ts`

**Cart Types:**
```typescript
interface CartItem {
  productId: string;
  variantLabel?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { productId: string; variantLabel?: string; name: string; price: number; image: string; quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variantLabel?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; variantLabel?: string; quantity: number } }
  | { type: "CLEAR_CART" };
```

**Context API:**
- `CartProvider` — wraps app, hydrates from localStorage on mount
- `useCart()` — hook returning:
  - `items: CartItem[]`
  - `itemCount: number`
  - `subtotal: number`
  - `addItem(productId, variantLabel?, name, price, image, quantity?)`
  - `removeItem(productId, variantLabel?)`
  - `updateQuantity(productId, variantLabel?, quantity)`
  - `clearCart()`

**Edge cases:**
- localStorage write fails silently (private browsing)
- Hydration mismatch — use `useEffect` + `useState` pattern
- Adding duplicate item increases quantity
- Quantity 0 = remove item

**Verify:** Wrap `src/app/layout.tsx` with `CartProvider`, render `itemCount` in header, see it persist on refresh

---

### Task 5: Build Shared Layout Components

**Objective:** Create Header (nav + cart icon), Footer, and layout wrapper

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/app/layout.tsx` (update)

**Header:**
Logo/brand on left, nav links center, search + account + cart icons on right
- Nav: HOME, SHOP, GENETICS, SUPPLIES, MERCH, ABOUT US, CONTACT
- Cart icon shows item count badge
- Responsive: hamburger menu on mobile (simple toggle)
- Sticky top on scroll

**Footer:**
- "Join the Culture" newsletter signup (visual only for v0)
- Brand descriptions (Golden Mycology + Stikki Bandit)
- Social links: Instagram, TikTok, YouTube, Discord (icon links only)
- Legal: Terms, Privacy, Refund, Contact links (placeholder pages)
- Support: Shipping Info, Returns, FAQ links

**Styles:**
- Dark background (#0a0a0a or similar)
- Neon yellow accent (#facc15 / #eab308)
- Purple accent (#a855f7 / #7c3aed)
- White text
- Font: system sans-serif or Inter

**Layout update:**
```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans">
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
```

**Verify:** Header and footer visible on all routes, cart badge shows 0

---

### Task 6: Build Homepage

**Objective:** Recreate the homepage mock-up

**Files:**
- Create: `src/components/home/HeroBanner.tsx`
- Create: `src/components/home/CategoryGrid.tsx`
- Create: `src/components/home/FeaturedGenetics.tsx`
- Create: `src/components/home/BrandShowcase.tsx`
- Modify: `src/app/page.tsx`

**Sections:**
1. **Hero Banner** — "OR" in giant text, "One Marketplace. Two Legends." tagline, side-by-side characters (Golden Mycology samurai + Stikki Bandit cyberpunk) — use generated images
2. **Category Grid** — 3 category cards (Genetics, Supplies, Merch) linking to /genetics, /supplies, /merch — each with icon, title, description
3. **Featured Genetics** — Horizontal scrollable grid of 6 featured strain cards with product image, name, rating, price, Add to Cart button
4. **Brand Showcase** — Two columns: Golden Mycology (precision/craftsmanship) and Stikki Bandit (creativity/cyberpunk) — each with logo, description, and vibe

**Responsive:** Stack to single column on mobile, grid adjusts from 3-col → 2-col → 1-col

**Verify:** Homepage matches mock-up layout (hero → cats → featured → brands → footer)

---

### Task 7: Build Product Grid Pages (Shop, Genetics, Supplies, Merch)

**Objective:** Category filter pages showing product cards in a responsive grid

**Files:**
- Create: `src/components/product/ProductCard.tsx`
- Create: `src/components/product/ProductGrid.tsx`
- Create: `src/app/shop/page.tsx`
- Create: `src/app/genetics/page.tsx`
- Create: `src/app/supplies/page.tsx`
- Create: `src/app/merch/page.tsx`

**ProductCard:**
- Product image (clickable → `/product/[id]`)
- Brand badge ("Golden Mycology" or "Stikki Bandit")
- Product name
- Price (show variant range if applicable, e.g. "$18.00 - $32.00")
- Rating stars + count
- "Add to Cart" button
- Responsive: 4-col → 3-col → 2-col → 1-col

**Category Pages:**
- `/shop` — all products
- `/genetics` — filter `category === "genetics"`
- `/supplies` — filter `category === "supplies"`
- `/merch` — filter `category === "merch"`
- Page title + product count
- Sort/filter: optional for v0 (skip if scope risk)

**Verify:** Click through each category — correct products shown, cards link to detail pages

---

### Task 8: Build Product Detail Page

**Objective:** Full PDP with image viewer, variant selector, tabs, Add to Cart

**Files:**
- Create: `src/app/product/[id]/page.tsx`
- Create: `src/components/product/ProductImages.tsx`
- Create: `src/components/product/ProductInfo.tsx`
- Create: `src/components/product/ProductTabs.tsx`
- Create: `src/components/product/RelatedProducts.tsx`

**Layout (from mock-up):**
- Left: main product image + thumbnail strip (thumbnails can be same image for v0)
- Right: product name, subtitle, rating, price, variant selector (if variants), quantity selector, feature icons row, "Add to Cart" + "Add to Wishlist" (wishlist visual only) buttons
- Below: Tabbed section — DESCRIPTION, SPECIFICATIONS, SHIPPING, FAQ
- Below: "For Microscopy Use Only" disclaimer (where applicable)
- Below 4 guarantee icons row
- Below: Related Products grid

**ProductTabs:**
- DESCRIPTION: Full product description
- SPECIFICATIONS: Key-value table from `product.specs`
- SHIPPING: Standard shipping text (static for v0)
- FAQ: Static FAQ content per product or generic

**Add to Cart flow:**
1. User selects variant (if applicable)
2. Sets quantity
3. Clicks "Add to Cart"
4. Cart badge updates, brief toast/feedback
5. Cart persists in localStorage

**Microscopy disclaimer:** Purple-tinted warning banner for genetics/supplies products

**Verify:** Navigate to `/product/enigma-lc`, see full PDP, add to cart, verify cart badge updates

---

### Task 9: Build Checkout Page (Cart → Shipping → Payment → Review → JSON)

**Objective:** 4-step wizard checkout that outputs order JSON on completion

**Files:**
- Create: `src/app/cart/page.tsx`
- Create: `src/components/cart/CheckoutWizard.tsx`
- Create: `src/components/cart/CartReview.tsx`
- Create: `src/components/cart/ShippingForm.tsx`
- Create: `src/components/cart/PaymentForm.tsx`
- Create: `src/components/cart/OrderReview.tsx`
- Create: `src/components/cart/OrderConfirmation.tsx`

**Step 1 — Cart Review:**
- List cart items with image, name, variant, qty, line total
- Quantity +/- controls, remove button
- Subtotal, shipping info, discount code field (visual only)
- "Proceed to Secure Checkout" button

**Step 2 — Shipping (form):**
- Contact: email, first name, last name
- Address: street, apt, city, state, ZIP
- Shipping method selection (radio buttons)
- "Continue to Payment" button
- "Back to Cart" link

**Step 3 — Payment (form):**
- Payment method: Credit/Debit Card, Apple Pay, Google Pay (Apple/Google visual only)
- Card form: number, name, expiry, CVV (visual only for v0 — no validation)
- "Continue to Review" button
- "Back to Shipping" link

**Step 4 — Review:**
- Order summary (items, quantities, prices)
- Shipping address display
- Payment method display
- "Complete Order" button

**On "Complete Order" click:**
- Collect all form data into a JSON object
- Replace form UI with a styled JSON display showing the order
- Offer a "Start New Order" button that clears cart and returns to shop

**Responsive:** On mobile, wizard collapses to single column, steps shown as vertical progress indicators

**Edge cases:**
- Empty cart → show "Your cart is empty" with link to shop
- No items in cart → disable "Proceed to Checkout"
- Quantity change → subtotal recalculates immediately

**Verify:** Full checkout flow: add item → go to /cart → fill forms → complete → JSON output shown

---

### Task 10: Build Placeholder Pages (About, Contact)

**Objective:** Simple static content pages

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/app/contact/page.tsx`

**About page:**
- Brand story for Golden Mycology × Stikki Bandit collaboration
- Two-column layout: brand descriptions + imagery
- Mission/values section
- Static content from mock-up footer descriptions

**Contact page:**
- Contact form (visual only for v0 — no backend)
- Email, phone, social links
- Simple layout matching the site's dark theme

**Verify:** Navigate to /about and /contact from header — pages render with styling

---

### Task 11: Polish, Responsive Testing, Edge Cases

**Objective:** Final pass on responsiveness, empty states, error states, loading states

**Checklist:**
- [ ] All pages responsive (375px → 1920px)
- [ ] Mobile hamburger menu works
- [ ] Empty cart state renders correctly
- [ ] Adding product already in cart increments quantity
- [ ] Quantity set to 0 removes item
- [ ] Cart persists across page refreshes (localStorage)
- [ ] Product detail page for invalid ID shows 404 / not found
- [ ] Category page with no products shows empty state
- [ ] No console errors
- [ ] All links work and route correctly
- [ ] Images load with proper alt text
- [ ] Loading state for images (blur placeholder or skeleton)
- [ ] Checkout back/forward navigation works correctly

**Verify:** Lighthouse audit or manual walkthrough of all flows

---

## Risks & Tradeoffs

| Risk | Impact | Mitigation |
|---|---|---|
| FLUX images inconsistent with mock-up art style | Visual mismatch | Generate 2-3 variants per product, pick best |
| Cart hydration mismatch on SSR | Flash of wrong state | Use useEffect + mounting guard pattern |
| Checkout forms without validation feel incomplete | User confusion | Add visual-only field highlighting on "continue" (no actual validation for v0 — noted in code) |
| No real images for all 13 products | Some look bare | Use FLUX with detailed prompts referencing the mock-up aesthetic |
| Static export means no API routes | Can't expand to real backend easily | Design data layer with clean interface — swap JSON for API calls in v0.1 |

--- 

## Execution Order

1. Scaffold project (Task 1)
2. Data layer (Task 2)
3. Product images (Task 3)
4. Cart context (Task 4)
5. Layout + navigation (Task 5)
6. Homepage (Task 6)
7. Product grids (Task 7)
8. Product detail (Task 8)
9. Checkout wizard (Task 9)
10. Placeholder pages (Task 10)
11. Polish + testing (Task 11)
