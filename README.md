# BuyCars

A peer-to-peer marketplace for pre-owned cars in India. Sellers list a car in five guided steps;
buyers search by make, model, budget and city, save favourites, and contact sellers directly.

BuyCars is **not** a dealer. It does not inspect vehicles, verify ownership documents, guarantee
condition, or process payments. Every specification on a listing is self-reported by its seller.

**Tagline:** Find Your Next Drive.

---

## Stack

| Layer    | Choice                                                                        |
| -------- | ----------------------------------------------------------------------------- |
| UI       | React 19 + TypeScript (strict), Vite 8                                        |
| Styling  | Tailwind CSS v4 — tokens in `src/styles/globals.css`, no `tailwind.config.js` |
| Routing  | React Router 7, route-level `lazy()` splitting                                |
| Icons    | lucide-react                                                                  |
| Toasts   | sonner                                                                        |
| Auth     | Firebase Authentication, Google sign-in — live                               |
| Database | Cloud Firestore + Security Rules _(Phase 5)_                                  |
| Images   | Cloudinary signed uploads via a Netlify Function _(Phase 7)_                  |
| Hosting  | Netlify (frontend + functions), Firebase (auth + data)                        |

Added later, deliberately not installed yet: `@tanstack/react-query` (Phase 3), `react-hook-form` +
`zod` + `@hookform/resolvers` (Phase 6), `zustand` only if shared client state earns it, `recharts`
(Phase 6).

> **TypeScript version note:** `typescript` is pinned to `~5.9.3`, not 7.x. `typescript-eslint`
> declares a peer range of `>=4.8.4 <6.1.0`, so TS 7 breaks linting. Revisit when the ESLint
> toolchain supports it.

---

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run build      # typecheck + production build to dist/
npm run preview    # serve the built output
```

No credentials are needed to browse the marketplace: the landing page reads
`src/features/cars/data/demo-cars.ts` through the service layer. Google sign-in needs the Firebase
web config in `.env.local` (see [Configuration](#configuration)); without it the button explains
which variables are missing instead of failing silently.

Firebase Auth is loaded as a separate chunk after first paint, and Firestore is not imported at all
yet — neither adds to the landing-page bundle.

---

## Project layout

```
src/
  app/            App, providers, router, ErrorBoundary
  components/
    ui/           Button, Input, Select, Badge, Skeleton, EmptyState
    layout/       Navbar, Footer, MainLayout
    shared/       CarCard, CarGrid, CarSearchBar, BrandLogo, Section, LegalPage, Logo
  features/
    auth/         AuthProvider, AccountMenu, Google sign-in service
    cars/         data/ demo listings · services/ read boundary · hooks/ async state
    home/         homepage sections
  lib/            utils, constants, firebase, phaseNotices
  pages/          route-level pages
  styles/         globals.css (design tokens)
  types/          car.types.ts
```

**The one rule that matters:** components never touch data sources. Everything reads through
`src/features/cars/services/carService.ts`. Phase 5 rewrites that file's internals to call
Firestore; no component changes.

---

## Design system

Tokens live in `@theme` inside `src/styles/globals.css` and are the only place a colour is written.

| Token                 | Value     | Tailwind utility         |
| --------------------- | --------- | ------------------------ |
| `--color-brand`       | `#2563EB` | `bg-brand`, `text-brand` |
| `--color-brand-hover` | `#1D4ED8` | `hover:bg-brand-hover`   |
| `--color-ink`         | `#0B1220` | `bg-ink`, `text-ink`     |
| `--color-ink-2`       | `#111827` | `bg-ink-2`               |
| `--color-canvas`      | `#F8FAFC` | `bg-canvas`              |
| `--color-surface`     | `#FFFFFF` | `bg-surface`             |
| `--color-line`        | `#E2E8F0` | `border-line`            |
| `--color-muted`       | `#64748B` | `text-muted`             |
| `--color-success`     | `#16A34A` | `text-success`           |
| `--color-warning`     | `#F59E0B` | `text-warning`           |
| `--color-danger`      | `#DC2626` | `text-danger`            |

Type is Manrope for headings and Inter for body. Spacing stays on an 8px grid — use even scale
steps (`2` = 8px, `4` = 16px, `6` = 24px, `8` = 32px, `12` = 48px, `16` = 64px). Radii and shadows
are tokenised as `rounded-card`, `rounded-field`, `shadow-card`, `shadow-raised`.

---

## Data model

Defined in `src/types/car.types.ts`, mirrored by the Firestore collections in §13 of the spec:

- `users/{uid}` — profile; UID is the document ID
- `cars/{carId}` — listing, `status` in `draft | pending_review | active | reserved | sold | archived`
- `users/{uid}/wishlist/{carId}` — subcollection, so wishlist reads never fan out across a public collection
- `inquiries/{inquiryId}` — buyer ↔ seller record, `type` in `general | test_drive`
- `reports/{reportId}`, `moderationEvents/{eventId}` — privileged, admin-write only

Two conventions worth keeping:

1. **Timestamps are ISO-8601 strings in the UI layer.** The Firestore read layer converts `Timestamp`
   → ISO on the way out, so no component imports a Firebase type.
2. **Prices are integer INR.** Formatting happens in `formatINR()` at render time, never in storage.

### Firestore query limits (Phase 5)

Firestore cannot combine arbitrary ranges or do full-text search. The marketplace will therefore use
composite indexes such as:

```
status == active + make == X + price range   →  cars_status_make_price
status == active + city == X + createdAt     →  cars_status_city_created
status == active + featured == true          →  cars_status_featured
```

Text search across make/model/variant is bounded client-side refinement over a fetched page, not a
database feature. Anything beyond that needs an external search index — a paid dependency, so it is
out of scope until there is revenue to justify it.

---

## Configuration

Copy `.env.example` to `.env.local` (git-ignored) and fill in the values. Only `VITE_`-prefixed
values reach the browser, and every one of them is public configuration — Firebase web API keys are
identifiers, not secrets. Real secrets (`CLOUDINARY_API_SECRET`, the Firebase service account) live
**only** in Netlify's environment.

### 1. Firebase project

Already created for this build (`buycars-bff35`) and wired for Google sign-in:

1. `firebaseConfig` values live in `.env.local` as `VITE_FIREBASE_*`, never in source.
2. **Authentication → Sign-in method → Google** is enabled.
3. **Authorised domains** need the deployment host added before the first deploy:
   `localhost` works today; add your `*.netlify.app` host and production domain in
   console → Authentication → Settings → Authorised domains.
4. **Firestore Database** is created. Rules and composite indexes are added in Phase 5, from the
   repo, not the console:
   ```bash
   npm i -D firebase-tools
   npx firebase login
   npx firebase deploy --only firestore:rules,firestore:indexes
   ```
   `firebase.json` and `firebase/` rules files do not exist yet — they arrive with Phase 5, and no
   client writes to Firestore until then.
5. App Check (recommended before launch): console → **App Check**, register reCAPTCHA v3 for your
   domains, then enforce it on Firestore.
6. Analytics is optional: `VITE_FIREBASE_MEASUREMENT_ID` is read only in production builds and the
   analytics SDK loads on demand, after render.

No service-account JSON is used anywhere in this repo. Privileged operations will run server-side
with Admin SDK credentials held in Netlify's environment, never in a `VITE_` variable.

### 2. Cloudinary

1. cloudinary.com/console → create a free account; note your **cloud name** → `VITE_CLOUDINARY_CLOUD_NAME`.
2. Settings → **Upload → Add upload preset**, create a _signed_ preset (`Signed` = true). Copy the
   API secret into Netlify only — never into a preset or the client.
3. The Netlify Function in `netlify/functions/` mints the signature per upload after verifying the
   caller's Firebase ID token, and pins `folder`, `public_id` prefix, `max_file_size`, `eager`
   transformations and `allowed_formats`. Nothing those five come from the client.
4. Cleanup: images uploaded before a listing is published are orphaned. A scheduled function sweeps
   the `buycars/tmp/` folder for assets older than 24 hours with no matching listing.

**If signed uploads are not viable at deploy time**, the fallback is an unsigned preset locked to a
single folder, 5MB, three formats and a per-IP rate limit — and you must accept that anyone can
upload to that folder and burn your free bandwidth. That trade-off is called out before it is taken,
never chosen silently.

### 3. Netlify

1. netlify.com → **Add new site → Import an existing project** → pick the GitHub repo.
2. Build command `npm run build`, publish directory `dist` — both already in `netlify.toml`.
3. Site settings → **Environment variables**: add every `VITE_*` value, plus the server-side secrets.
4. Deploys → **All settings → Functions** confirms `netlify/functions`. `netlify.toml` already
   rewrites `/*` to `/index.html`, so refreshing `/cars/abc` works.
5. Add the final `*.netlify.app` domain to Firebase's authorised domains, then redeploy.

---

## Image credits

`public/images/` mixes AI-free stock photography and manufacturer marks sourced from Wikimedia
Commons. **`public/images/CREDITS.md` is the authoritative licence manifest** — every file there
records its source page, licence and author. Do not add images to this directory without appending
a row.

---

## Current state

Phase 2 landing page plus the Phase 4 authentication foundation. Working: the full homepage,
responsive from 320px, hero search that really filters the demo set, brand and body-type tiles that
apply filters, derived listing badges, skeleton and empty states, and Google sign-in with an account
menu, sign-out and session restore on refresh. The mobile drawer is portalled above the sticky
header so it stays full-height once the page is scrolled.

Not built yet, and every control that would need one says so in a toast instead of pretending:
marketplace and detail pages (Phase 3), Firestore and wishlist (Phase 5), seller dashboard
(Phase 6), uploads (Phase 7), inquiries (Phase 8), admin (Phase 9), tests (Phase 10).

Sign-in creates a Firebase Auth account only. No profile document is written to Firestore, no roles
exist, and no privileged operation is reachable from the client — those arrive with Firebase Security
Rules in Phase 5, where authorization is enforced server-side rather than by a user-editable field.

Listing photos come from Wikimedia Commons and are recorded one row per file in
`public/images/CREDITS.md`. Where Commons only had an older generation of a car, the demo listing's
year, variant and features were rewritten to match the photograph rather than mislabelling it.
