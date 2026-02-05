# Frontend load optimizations

Summary of changes applied across the app. All items from the original “applied” and “further improvements” lists have been implemented.

## Applied changes

### 1. **Next.js webpack cache**
- **File:** `next.config.mjs`
- Removed `config.cache = false` so Next.js uses its default webpack cache.
- **Effect:** Faster dev and production builds.

### 2. **Lighter fonts**
- **File:** `src/app/theme.jsx`
- Poppins limited to weights `400`, `500`, `600`, `700`; added `display: 'swap'`.
- **Effect:** Less font data, better FCP.

### 3. **Lazy-loaded landing sections**
- **File:** `src/components/landingPage/LandingApp.jsx`
- Below-the-fold sections (Bento, Testimonial, Pricing, FAQ, CTA, Footer) use `next/dynamic`.
- **Effect:** Smaller initial JS.

### 4. **Dynamic layout chunks**
- **File:** `src/components/rootLayout/CustomLayout.jsx`
- EmployerNavbar, Navbar, and Footer loaded with `next/dynamic`.
- **Effect:** Nav/footer in separate chunks.

### 5. **Root loading UI**
- **File:** `src/app/loading.js`
- Spinner for route transitions.
- **Effect:** Immediate feedback during navigation.

### 6. **next/image everywhere**
- **File:** `src/components/applicant/dashboardProfile/MyPosting.jsx`
- Single remaining `<img>` replaced with `next/image` (fill + sizes); container has `position: "relative"` and `minHeight` for fill.
- **Effect:** Optimized images and lazy loading for post media.

### 7. **Route-level loading**
- **Files:** `src/app/applicant/loading.js`, `src/app/employer/loading.js`
- Segment-level loading spinners for applicant and employer routes.
- **Effect:** Better perceived speed on those segments.

### 8. **Deferred heavy libs**
- **Firebase:** `src/app/applicant/login/page.jsx`, `src/app/employer/login/page.jsx`  
  Firebase and `firebase/auth` are no longer top-level imports; they are dynamically imported inside `handleGoogleLogin` and `handleAppleLogin`. Firebase loads only when the user clicks Google or Apple sign-in.
- **Google Maps:**  
  - `src/components/common/AddressAutocomplete.jsx` – `@googlemaps/js-api-loader` is dynamically imported in `useEffect`.  
  - `src/components/applicantForm/BasicInfo.jsx` – same pattern.  
  - `src/hooks/useGoogleAutocomplete.js` – same pattern; cleanup with `cancelled` flag.  
  Maps SDK loads only when a component that uses address autocomplete is mounted.
- **Effect:** Firebase and Maps are not in the initial bundle; they load on demand.

### 9. **PersistGate loading shell**
- **File:** `src/ReduxProvider.js`
- `loading={null}` replaced with `loading={<MinimalShell />}`. MinimalShell is a minimal full-screen spinner (no MUI) so it doesn’t depend on theme/layout.
- **Effect:** Visible feedback while Redux rehydrates instead of a blank screen.

### 10. **Bundle analyzer**
- **File:** `next.config.mjs`  
  Wrapped with `@next/bundle-analyzer`; enabled when `ANALYZE=true`.
- **File:** `package.json`  
  Script: `"analyze": "set ANALYZE=true && next build"` (Windows). On macOS/Linux use `ANALYZE=true next build` or `npm run build` with `ANALYZE=true` in the env.
- **Effect:** Run `npm run analyze` to generate bundle reports and target large dependencies.

### 11. **Prefetch**
- Next.js `<Link>` prefetches by default. No code change; ensure main navigation uses `next/link` (already the case).

### 12. **PWA**
- `next-pwa` is already used with `runtimeCaching` from `next-pwa/cache.js`. No change; repeat visits benefit from existing cache.

---

## Verification

- **Features:** Login (email + Google/Apple), address autocomplete, post media images, Redux persistence, and navigation should behave as before. Firebase and Maps load only when used.
- **Build:** Run `npm run build`. Then run `npm run analyze` to inspect bundle sizes.
- **Runtime:** Check “First Load JS” and route sizes in the build output to confirm impact of these optimizations.
