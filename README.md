# BuyCars

A private-seller car marketplace for India, built with React, TypeScript, Vite, Firebase Authentication, Firestore and Cloudinary signed uploads through Netlify Functions.

## Run

```sh
npm install
npm run dev
npm run build
npm run lint
```

For Firebase rules, Cloudinary credentials, signed preset settings, local upload development and deployment, follow **[SETUP.md](SETUP.md)**. Copy `.env.example` to `.env.local` for public frontend configuration; store server secrets only in ignored environment files or Netlify.

## Implemented

Sentence-case labels and compact footer; sign-in/sign-up overlay with email/password, Google and password reset; catalog and detail pages; seller onboarding; four-photo car listing form; Firestore publication; seller garage; Buy now enquiries; private real-time conversations; account and settings pages.

The live catalog reads Firestore when Firebase is configured. Demo data is available only without Firebase. Rules must be published before live reads or writes work. Photo uploads additionally require the Cloudinary preset and server environment variables described in SETUP.md.

## Layout

- `src/features/marketplace/service.ts`: profiles, Firestore listings, enquiries, messages and upload boundary.
- `src/features/cars/services/carService.ts`: public listing reads and filters.
- `src/features/auth/`: auth state, overlay and account menu.
- `src/pages/`: home, catalog, car detail, onboarding/listing, garage, inbox, account/settings and legal routes.
- `netlify/functions/sign-upload.mjs`: authenticated, rate-limited Cloudinary signature endpoint.
- `firebase/firestore.rules`: console-ready database access rules.
- `tests/firestore.rules.test.mjs`: emulator checks for authorization and validation.

## Wishlist

Save/remove cars using the heart on listing cards or detail pages. Open saved cars from the header heart or account menu. Saves sync privately through Firestore; sold or removed listings can be removed from the saved-cars page. Publish the latest `firebase/firestore.rules` to enable the new wishlist subcollection.

## Checks

```sh
npm run test:rules
npm run test:functions
```

See SETUP.md for the tested scope and current limits. Catalog filtering and pagination currently run in the browser over all active listings. Negotiation is through private text messages; BuyCars does not process payments or ownership transfers.

## Image credits

`public/images/CREDITS.md` records the source and licence for bundled sample photos and brand assets. Seller uploads are stored in Cloudinary.
