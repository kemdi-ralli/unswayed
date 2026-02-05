# Frontend load optimizations

Summary of changes applied to make the app load faster, plus further options you can add.

## Applied changes

### 1. **Next.js webpack cache**
- **File:** `next.config.mjs`
- Removed `config.cache = false` so Next.js can use its default webpack cache.
- **Effect:** Faster dev and production builds; same runtime bundle, but quicker iterations.

### 2. **Lighter fonts**
- **File:** `src/app/theme.jsx`
- Poppins limited to weights `400`, `500`, `600`, `700` (removed 100, 200, 300, 800, 900 and italic).
- Added `display: 'swap'` so text shows immediately with a fallback font and swaps when Poppins loads.
- **Effect:** Less font data and no blocking; better First Contentful Paint (FCP). If you need extra weights or italic, add them back selectively.

### 3. **Lazy-loaded landing sections**
- **File:** `src/components/landingPage/LandingApp.jsx`
- Hero and dashboard preview load with the main bundle; below-the-fold sections use `next/dynamic`:
  - BentoSection, LargeTestimonial, PricingSection, TestimonialGridSection, FAQSection, CTASection, FooterSection.
- **Effect:** Smaller initial JS; sections load as the user scrolls or when the main content is ready.

### 4. **Dynamic layout chunks**
- **File:** `src/components/rootLayout/CustomLayout.jsx`
- EmployerNavbar, Navbar, and Footer are loaded with `next/dynamic`.
- **Effect:** Nav and footer code split into separate chunks; only the ones needed for the current route load.

### 5. **Root loading UI**
- **File:** `src/app/loading.js`
- Simple loading spinner for route transitions.
- **Effect:** Users see feedback immediately during navigation instead of a blank screen.

---

## Further improvements you can add

- **Use `next/image` everywhere**  
  Replace `<img>` with Next.js `<Image>` for automatic sizing, lazy loading, and modern formats (e.g. WebP) where you have many images.

- **Route-level loading**
  - Add `loading.js` under `src/app/applicant/` and `src/app/employer/` for segment-level loading UIs and better perceived speed.

- **Defer heavy libs**
  - Load Firebase, Stripe, or Maps only on routes that need them (e.g. `dynamic(() => import('@/lib/firebase'), { ssr: false })` or similar in the pages that use them).

- **Reduce PersistGate delay**
  - In `ReduxProvider.js`, you can use `loading={<MinimalShell />}` instead of `loading={null}` so the UI shows something while Redux rehydrates, if you prefer a short loading state over a blank flash.

- **Analyze the bundle**
  - Run `npx @next/bundle-analyzer` (or add it to the Next config) to see which packages dominate the bundle and target them with dynamic imports or lighter alternatives.

- **Prefetch critical routes**
  - Use `<Link prefetch>` (default in Next.js) for important links so their JS is fetched early.

- **Service worker / PWA**
  - You already use `next-pwa`; ensure runtime caching and precaching are tuned so repeat visits and key assets load from cache.

Running `npm run build` and checking the “First Load JS” and “Route (app)” sizes in the build output will show the impact of these optimizations.
