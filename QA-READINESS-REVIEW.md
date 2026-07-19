# QA Readiness & Testability Review — Golden Mycology (v0)

**Date:** 2026-07-19  
**Project:** Orion / Golden Mycology  
**Version:** 0.1.0 (v0 demo, no tests exist)  
**Stack:** Next.js 16.2.10, React 18, TypeScript 5, Tailwind CSS 3.4  
**Reviewer:** Hermes Agent

---

## Executive Summary

**Verdict: CHANGES_REQUIRED — Low severity, high-impact fixes needed before v0.1 test coverage is viable.**

The codebase has strong bones for testability: a clean data layer of pure functions, props-driven presentational components, and well-separated types. The main blockers are zero test infrastructure, a few monolithic stateful components that mix data access with UI, and direct JSON imports that are hard to mock without module-level test tooling.

---

## 1. Test Infrastructure (MISSING — Must Add)

| Item | Status | Action Required |
|------|--------|----------------|
| Unit test runner | ❌ | Install vitest (recommended) or jest |
| React component testing | ❌ | Install @testing-library/react + jsdom |
| E2E testing | ❌ | Install Playwright (recommended for v0.1+) |
| Test config files | ❌ | Create vitest.config.ts |
| Sample test | ❌ | Add at least 1 smoke test per module |
| Test script in package.json | ❌ | Add `"test": "vitest"` |

**Recommendation:** vitest + @testing-library/react + jsdom for unit/component tests. Playwright for E2E (phase 2). DO NOT install Jest — vitest is faster, natively supports ESM, and has better Next.js compatibility.

### Recommended package.json additions:

```json
{
  "devDependencies": {
    "vitest": "^3.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jsdom": "^25.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  },
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:ui": "vitest --ui"
  }
}
```

---

## 2. Testability Assessment — By Component

### 2.1 Immediately Testable (pure logic, no mocking needed)

These modules export pure functions that are trivial to unit test:

| Module | Functions | Test Priority |
|--------|-----------|---------------|
| `src/lib/products.ts` | `getAllProducts`, `getProductById`, `getProductsByCategory`, `getFeaturedProducts`, `getProductsByBrand`, `getAllCategories`, `getCategoryById` | 🔴 HIGH |
| `src/components/product/CategoryFilter.tsx` | `sortProducts()` | 🔴 HIGH |
| `src/context/CartContext.tsx` | `cartReducer()` (pure reducer) | 🔴 HIGH |
| `src/app/checkout/components/ShippingForm.tsx` | `validateShipping()`, `validateShippingField()` | 🔴 HIGH |
| `src/app/checkout/components/PaymentForm.tsx` | `validatePayment()`, `validatePaymentField()`, `formatCardNumber()`, `formatExpiry()`, `maskCardNumber()` | 🔴 HIGH |
| `src/app/checkout/components/CartReview.tsx` | `calculateCartSubtotal()`, `calculateShipping()`, `calculateCartTotal()` | 🟡 MEDIUM |
| `src/types/*.ts` | Type definitions | 🟢 LOW (type-checked by TS) |

**Do these first** — they require zero infrastructure beyond vitest and provide immediate confidence.

### 2.2 Props-Driven Presentational (component tests, no mocking)

These components receive all data via props and have no external dependencies:

| Component | Test Focus | Effort |
|-----------|-----------|--------|
| `ProductCard.tsx` | Renders product data, badges, rating, price formatting | 🟢 Low |
| `ProductGrid.tsx` | Grid layout, empty state, renders ProductCard children | 🟢 Low |
| `CategoryHero.tsx` | Rendering title, subtitle, description | 🟢 Low |
| `CategorySidebar.tsx` | Active subcategory highlighting, callback invocation | 🟢 Low |
| `CategoryFilter.tsx` | Filter pill buttons, sort select, product count | 🟢 Low |
| `HeroBanner.tsx` | Pure presentational rendering | 🟢 Low |
| `BrandShowcase.tsx` | Static content rendering | 🟢 Low |
| `VariantSelector.tsx` | Variant selection state, "Best Value" badge | 🟢 Low |
| `QuantitySelector.tsx` | Increment/decrement, input validation, boundary checks | 🟢 Low |
| `MicroscopyDisclaimer.tsx` | Conditional visibility rendering | 🟢 Low |
| `StepIndicator.tsx` | Step highlighting, click handlers | 🟢 Low |

**These are good candidates for snapshot tests + interaction tests.**

### 2.3 Requires Mocking

| Component | Dependency | Mock Strategy |
|-----------|-----------|---------------|
| `Header.tsx` | `useCart()` context, `usePathname()` | Mock `CartContext` + `next/navigation` |
| `AddToCartButton.tsx` | `useCart()` context | Mock `CartContext` |
| `Footer.tsx` | Newsletter form state (internal) | Test internally — no external deps |
| `Layout.tsx` | CartProvider wrapper | Test child rendering |
| `CategoryGrid.tsx` | Imports `categories.json` directly | vi.mock the JSON module |
| `FeaturedGenetics.tsx` | Imports `getFeaturedProducts()` from `@/lib/products` | vi.mock `@/lib/products` |
| `RelatedProducts.tsx` | Imports `getAllProducts()` from `@/lib/products` | vi.mock `@/lib/products` |
| `ProductDetailClient.tsx` | Composes 6+ subcomponents, state | Integration test with mocked context |
| `ProductImageGallery.tsx` | Internal state (lightbox, selectedIndex) | Test interactively |

### 2.4 Complex / Monolithic Components (⚠️ REFACTOR RECOMMENDED)

| Component | Lines | Issues |
|-----------|-------|--------|
| `CategoryPage.tsx` | 169 | Mixes data fetching, filtering, sorting, UI rendering, sidebar state. Too many concerns in one component. |
| `checkout/page.tsx` | 393 | All checkout state, validation, navigation, and step rendering in one monolith. Hard to test step transitions in isolation. |
| `src/app/checkout/components/PaymentForm.tsx` | 314 | Formatting + validation + masking + presentation in one file. Pure logic (formatCardNumber, validatePaymentField) is exported, which is good, but presentation is coupled. |
| `Footer.tsx` | 299 | Large static footer — actually low risk since mostly static |
| `Header.tsx` | 264 | Navigation, mobile menu, cart badge, payment icons — okay complexity but uses `document.body` DOM manipulation (side effect in useEffect) |

**Refactoring recommendations:**
1. **CategoryPage.tsx** — Extract data-filtering logic into a custom hook (`useCategoryProducts`). Pull memo computations into pure utility functions.
2. **checkout/page.tsx** — Create individual step page components per route segment (app/checkout/cart/, app/checkout/shipping/, etc.) or at minimum extract each step into its own hook.

---

## 3. Data Layer & Separation of Concerns

### Current Architecture
```
src/data/products.json (static JSON)
src/lib/products.ts (pure query functions over the JSON)
         ↕
src/components/product/*.tsx (import lib functions directly)
```

**Strengths:**
- Data layer is a thin pure-function wrapper over JSON — trivially testable
- `lib/products.ts` has zero side effects
- No database, no API calls — ideal for v0 demo

**Weaknesses:**
- Direct JSON imports in components (`CategoryGrid` imports categories.json, `FeaturedGenetics` imports lib functions) make it hard to swap data sources later
- Components import from lib directly instead of receiving data as props from a server component — this couples the UI to the data layer
- The `@/lib/products` module uses `as unknown as Product[]` casts — no runtime validation

### Long-term separation recommendation:
```
src/app/*/page.tsx (server components — data loading)
    ↕
src/lib/products.ts (data access layer)
    ↕
src/data/products.json → eventually → API / database

src/components/*.tsx (client components — receive data as props)
```

The architecture is already close to this. The main offenders that import data directly are:
- `CategoryGrid.tsx` (imports categories.json directly)
- `FeaturedGenetics.tsx` (imports getFeaturedProducts)
- `RelatedProducts.tsx` (imports getAllProducts)

These would be better as server components that receive data as props, ready for when JSON is swapped for an API.

---

## 4. Side Effects & Mockability

| Side Effect | Location | Testability Impact |
|-------------|----------|-------------------|
| `localStorage.getItem` | `CartContext.tsx` (hydration) | Must mock localStorage |
| `localStorage.setItem` | `CartContext.tsx` (persist) | Must mock localStorage |
| `document.body.style.overflow` | `Header.tsx` (mobile menu) | Needs jsdom + cleanup |
| `setTimeout` | `AddToCartButton.tsx` (feedback timer) | Use vi.useFakeTimers |
| `setTimeout` | `checkout/page.tsx` (simulated order) | Use vi.useFakeTimers |
| `Math.random` | `OrderReview.tsx` (order ID gen) | Mock or make deterministic |

**No external API calls, no fetch, no server actions** — this is a strength for v0. All side effects are DOM/browser-local.

---

## 5. Integration Points Needing Tests

| Integration Point | What to Test | Test Type |
|-------------------|-------------|-----------|
| CartContext ↔ localStorage | Hydration on mount, persistence on change | Unit + integration |
| CategoryPage filter/sort pipeline | Subcategory filter → sort → render flow | Integration |
| Checkout wizard step flow | 1→2→3→4 navigation, validation gates, back navigation | Integration |
| Checkout validation → error display | Shipping validation errors show on form, Payment validation errors show | Integration |
| Order placement → completion | Full checkout → order confirmation rendering | E2E / integration |
| Product detail → AddToCart | Variant selection → quantity → add → cart update | Integration |
| Header cart badge | Cart itemCount updates reflected in badge | Unit |
| `generateStaticParams` → product page | Static params generation matches product IDs | Unit / build test |

---

## 6. Recommended Test Strategy for v0.1

### Phase 1: Foundation (Day 1)
```
Priority: Unit tests for pure logic
```

1. Install vitest + @testing-library/react + jsdom
2. Create `vitest.config.ts` with Next.js alias resolution
3. Write unit tests for:
   - `src/lib/products.ts` (7 functions)
   - `src/components/product/CategoryFilter.tsx` — `sortProducts()`
   - `src/context/CartContext.tsx` — `cartReducer()` (all 5 action types)
   - `src/app/checkout/components/ShippingForm.tsx` — all validation functions
   - `src/app/checkout/components/PaymentForm.tsx` — all validation + formatting functions
   - `src/app/checkout/components/CartReview.tsx` — `calculate*` functions
   - `src/app/checkout/components/OrderReview.tsx` — `generateOrderId()`, `maskEmail()`, `maskPhone()`, `getLastFour()`

**Estimated: 80–120 tests, 1–2 hours**

### Phase 2: Component Tests (Day 2)
```
Priority: Presentational components + context consumers
```

4. Component tests for:
   - `ProductCard.tsx` — render states (with/without variants, featured badge, microscopy badge, missing image fallback)
   - `QuantitySelector.tsx` — increment/decrement, boundaries, input validation
   - `VariantSelector.tsx` — selection state, "Best Value" badge
   - `CategoryHero.tsx` — title/subtitle/description rendering
   - `CategorySidebar.tsx` — subcategory click, active state
   - `ProductGrid.tsx` — empty state, product rendering
   - `AddToCartButton.tsx` — add to cart flow, wishlist toggle, feedback timer (with mocked CartContext)
   - `Header.tsx` — mobile menu toggle, cart badge, active nav link
   - `ProductImageGallery.tsx` — image selection, lightbox open/close, navigation

**Estimated: 40–60 tests, 2–3 hours**

### Phase 3: Integration Tests (Day 3)
```
Priority: Critical user flows
```

5. Cart integration:
   - CartProvider → addItem → state update → localStorage write
   - CartProvider → hydrate from storage → state restore
   - Multiple items add/remove/update

6. Checkout integration:
   - Step 1 (cart review) → item removal → subtotal update
   - Step 2 (shipping form) → validation → step 3 advance
   - Step 3 (payment form) → validation → step 4 advance
   - Step 4 (order review) → place order → confirmation

7. CategoryPage integration:
   - Filter by subcategory → grid updates
   - Sort by price/rating/name → correct ordering
   - Category slug → product filtering

**Estimated: 30–50 tests, 3–4 hours**

### Phase 4: E2E (Day 4, Optional for v0.1)
```
Priority: Full user journeys
```

8. Install Playwright
9. Write smoke tests:
   - Home page loads → all sections visible
   - Navigate to all category pages → products render
   - Product detail → variant selection → add to cart
   - Complete checkout flow (demo mode)
   - Mobile responsive menu

**Estimated: 10–15 tests, 2–3 hours**

---

## 7. Recommended Refactors Before v0.1

### 🔴 Required (blockers for testability)

1. **Install test infrastructure** (see Section 1)
2. **Create `vitest.config.ts`** with path aliases matching tsconfig `@/*`

### 🟡 Recommended (improves testability)

3. **Extract `cartReducer` from CartContext** into a standalone file
   - `src/lib/cart-reducer.ts` — pure function, no React deps
   - Makes unit testing the reducer trivial (no jsdom needed)

4. **Create a data-access layer adapter**
   - `src/lib/products.ts` is fine as-is, but consider creating `src/lib/__mocks__/products.ts` for easy vi.mock
   - Or wrap in a context/provider for injectable data

5. **Refactor CategoryPage.tsx** — extract filtering/sorting into `useProductFilter()` hook
6. **Refactor checkout/page.tsx** — extract step logic into custom hooks per step

### 🟢 Nice-to-have

7. Add runtime validation to lib/products (zod or simple type guards)
8. Remove unnecessary `"use client"` directives from presentational-only components (CategoryHero, CategorySidebar, BrandShowcase, CategoryGrid, HeroBanner)

---

## 8. Code Quality Metrics

| Metric | Count | Notes |
|--------|-------|-------|
| Source files (non-node_modules) | ~50 | 22+ components, 4 pages, 3 data files, 3 type files, 1 lib module |
| Total lines of component code | ~2,300 | Estimated |
| Largest single file | 393 lines | `checkout/page.tsx` |
| 2nd largest | 314 lines | `checkout/components/PaymentForm.tsx` |
| 3rd largest | 299 lines | `Footer.tsx` |
| API routes | 0 | None yet — no integration points to mock |
| Server actions | 0 | None — all data is static |
| Components using `"use client"` | 14 | Some unnecessarily |
| Exported pure utility functions | ~20+ | Immediately unit-testable |
| React Context providers | 1 | CartContext |
| Direct JSON file imports in components | 2 | CategoryGrid imports categories.json |

---

## 9. Risk Summary

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Zero test infrastructure | 🔴 High | Install vitest + testing-library before writing any test |
| Monolithic checkout page (393 lines) | 🟡 Medium | Extract step hooks before testing checkout flow |
| Monolithic CategoryPage (169 lines) | 🟡 Medium | Extract useProductFilter hook |
| Direct JSON imports in components | 🟢 Low | Accept for v0, address when data source changes |
| No runtime validation on product data | 🟢 Low | Accept for v0, add zod in v0.2 |
| Components importing data at module level | 🟡 Medium | Mock at module level with vi.mock, or refactor to props |

---

## Final Score

**Testability Score: 7/10** — Good pure-logic separation, but need test infra + 2–3 refactors to reach full coverage readiness.

**Recommended first commit message for test infrastructure:**
```
chore: add vitest + testing-library for v0.1 test coverage

- Install vitest, @testing-library/react, @testing-library/jest-dom, jsdom
- Create vitest.config.ts with @/ path alias
- Add test scripts to package.json
- Write first unit tests for lib/products and cartReducer
```
