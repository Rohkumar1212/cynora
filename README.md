# Cynora — Elevate Your Clean

Fully responsive Next.js (App Router) landing page for the Cynora cleaning-products brand.

## Setup
```
npm install
npm run dev
```
Open http://localhost:3000

## Build for production
```
npm run build
npm start
```

## What's included
- Sticky header with mobile hamburger menu
- Animated hero with floating product pouches + shimmering gold headline
- Scrolling marquee strip
- Feature cards, category grid, best-seller product grid (all with hover lift + gold glow shadow + cursor-tracked shine on product cards)
- "Why Choose Cynora" split section with animated SVG mark
- Testimonials, distributor CTA band, newsletter signup
- Footer with socials
- Scroll-reveal animations (respects prefers-reduced-motion)
- Fully responsive: desktop, tablet, and mobile breakpoints

## Structure
```
app/
  layout.js
  page.js
  globals.css
  components/
    Header.js
    Logo.js
    ProductCard.js
    NewsletterForm.js
    Reveal.js
```

Colors, copy, and product data live directly in `app/page.js` — edit the `PRODUCTS`, `CATEGORIES`, `FEATURES`, `WHY`, and `TESTIMONIALS` arrays to update content.

---

## API Integration Notes (this pass)

This build is now wired against the endpoints in `FRONTEND_APIS.md` (relative `/api/...`, same Next.js deployment, cookie-based auth):

- **Auth** — `AuthContext` calls `/api/user/register`, `/login`, `/profile`, `/logout` with `credentials: "include"`.
- **Products/Categories** — `app/data/products.ts` fetches from `/api/products`, `/api/products/[id]`, `/api/products/featured`, `/api/products/bestsellers`, `/api/categories`, with a small in-memory cache. `app/lib/types.ts` maps API product objects into the UI's existing `Product` shape (gradient/badge/etc. are derived client-side since the API doesn't return them).
- **Cart** — `CartContext` uses `/api/cart` (GET/POST/DELETE) when logged in; falls back to a localStorage cart for guests, merging to the server cart shape.
- **Orders** — `OrdersContext` uses `/api/orders` (GET/POST).
- **Banners/Settings** — `app/lib/settings.ts` fetches `/api/settings` for live shipping fee & free-shipping threshold (cart/checkout no longer hardcode ₹79/₹999, they just default to those values if the settings call fails).
- **Wishlist** — kept as a local, per-browser feature. There's no wishlist endpoint in the API doc, so this isn't synced server-side yet.
- **Addresses** — the API only accepts one inline address per order (no address-book CRUD endpoints), so a lightweight address book is kept in `localStorage`, namespaced per logged-in user id, purely as a checkout convenience.
- **Profile editing** — no update-profile endpoint exists yet, so `/dashboard/profile` is now read-only display of the account on file.

### Visual pass
- Shifted the core palette from brown/cream to navy + gold (`--ink`, `--navy`, `--navy-light` now navy tones) to match the "Elevate Your Clean" premium branding.
- Product cards: added a soft navy/gold glass border-glow on hover, deeper shadow, and a shimmering skeleton loader while product data streams in from the API.

## Logo, Dark Theme & Razorpay (this pass)

**Logo**
- Cropped the supplied gold logo artwork into two transparent PNGs: `public/images/cynora-icon.png` (swirl mark only, used in the header/nav next to the "CYNORA" wordmark) and `public/images/cynora-logo.png` (full icon + wordmark lockup, used on the login/signup screens).
- `app/components/Logo.tsx` now renders the real artwork via `next/image` instead of an approximated inline SVG.
- Added the icon as a proper favicon (`public/images/favicon.png`) via `metadata.icons` in `app/layout.tsx`.
- Footer logo now shows the icon next to the wordmark instead of text only.

**Dark theme text-contrast fix**
- Root cause: ~15 components (cards, checkout/summary panels, filter box, dashboard panels, inputs, sort/select, cart rows, FAQ items, auth card, etc.) had `background: #fff` hardcoded instead of a theme variable. Text correctly switched to a light color in dark mode, but the card stayed white — light text on a white card, unreadable.
- Fix: every hardcoded `background: #fff` was swapped for `var(--ivory)`, which already has a proper dark value (`#101d31`). No visual change in light mode; dark mode cards now render dark with light, readable text.
- Added targeted dark-mode overrides for input placeholders, `.form-error`, `.status-pill` variants, the skeleton loader, and the topbar/marquee/CTA band/footer bands, plus a themed text-selection color.

**Razorpay ("Pay Online" at checkout)**
- `app/api/razorpay/create-order/route.ts` — server-side route that creates a Razorpay order via the REST API using `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` (Basic Auth, no extra npm dependency). The secret never reaches the browser.
- `app/api/razorpay/verify/route.ts` — verifies the HMAC-SHA256 payment signature Razorpay returns after checkout, using Node's built-in `crypto`.
- `app/lib/razorpay.ts` — client helper that lazy-loads the Razorpay Checkout script, opens the widget, and resolves once the server has verified the signature.
- Checkout page now has a real payment method selector — **Pay Online** (default) or **Cash on Delivery** — with the submit button label/behavior changing accordingly.
- `OrdersContext.placeOrder(address, paymentMethod, paymentRef)` and `apiPlaceOrder(...)` were extended to carry `paymentMethod: "RAZORPAY"` plus `razorpayOrderId` / `razorpayPaymentId` / `razorpaySignature` through to `POST /api/orders` on the external backend.
- **Action needed on your end:** the external backend (`admin.sanctumchem.com`) needs to accept those extra fields on order creation for Razorpay orders to be recorded correctly — confirm the exact field names/enum value your backend expects for `paymentMethod`, since `FRONTEND_APIS.md` only documents `"COD"`. If the field names differ, they're isolated to `apiPlaceOrder` in `app/lib/api.ts` and easy to adjust.
- Setup: copy your Razorpay test/live keys from the [Razorpay dashboard](https://dashboard.razorpay.com/app/keys) into `.env` as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. No `NEXT_PUBLIC_` key is needed — the public key id is returned safely to the client by `create-order`.

