# Activate the BuyCars marketplace

## Firebase console

1. Open the existing Firebase project. In **Authentication → Sign-in method**, enable **Email/Password** and **Google**. Add localhost and the deployed domain under **Authentication → Settings → Authorized domains**.
2. Open **Firestore Database → Rules**. Replace the editor with the **entire contents of `firebase/firestore.rules`** and click **Publish**. These are Firestore rules, not Realtime Database or Storage rules.
3. Keep the existing `VITE_FIREBASE_*` values in `.env.local` and add the same public values to Netlify. Restart Vite after configuration changes.
4. A configured Firebase project uses real Firestore listings. An empty database produces an empty catalog. Sample cars are used only when Firebase is not configured; live database errors are shown rather than replaced with fake results.
5. No composite indexes are required by the current single-field queries. `firebase/firestore.indexes.json` is provided for CLI deployments.

Alternative rules deployment:

```sh
npx firebase login
npx firebase deploy --project YOUR_FIREBASE_PROJECT_ID --only firestore:rules,firestore:indexes
```

The rules restrict profiles to their owner, require seller onboarding and four image records, prevent sellers setting featured status, restrict conversations to the buyer and seller, and prevent message sender impersonation. Admin operations use the server SDK. Enquiry records are immutable and deduplicated per car and buyer.

## Cloudinary: what you need and where to find it

Create/sign in to your account at https://console.cloudinary.com/.

| Variable | Obtain it from | Where it belongs |
| --- | --- | --- |
| `CLOUDINARY_CLOUD_NAME` | Product Environment / dashboard cloud name | Netlify server environment |
| `CLOUDINARY_API_KEY` | Settings → API Keys | Netlify server environment |
| `CLOUDINARY_API_SECRET` | Settings → API Keys → reveal secret | Netlify server environment only |
| `CLOUDINARY_UPLOAD_PRESET` | Settings → Upload → Upload presets → Add upload preset | Netlify server environment |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase → Project settings → Service accounts → Generate new private key | Complete JSON as one server environment variable |

**Do not paste API secrets or service-account JSON into chat or any `VITE_` variable.** The Firebase service account must belong to the same project as the browser configuration. Add its JSON directly to Netlify's environment-variable editor. It authorizes the upload function to verify Firebase sessions, check onboarding and maintain upload quotas.

Create a preset named, for example, `buycars_signed`:

- Signing mode: **Signed**.
- Allowed formats: **jpg, jpeg, png, webp**.
- Maximum file size: **5,242,880 bytes (5 MB)**.
- Leave public ID/folder configuration empty; the server supplies `buycars/UID/LISTING_ID/SLOT` for slots 0–3.
- Optional incoming transformation: limit dimensions to 2000 × 1500 while preserving aspect ratio.
- Save the preset and copy its exact name to `CLOUDINARY_UPLOAD_PRESET`.

The browser requests a signature from `/.netlify/functions/sign-upload`, attaching its Firebase ID token. The function checks the token and seller profile, limits each user to 24 signature requests per hour, and signs a fixed listing/photo path. The browser then uploads directly to Cloudinary and stores the four returned CDN URLs/public IDs in Firestore. The private secret stays on the server. Preset format/size restrictions are essential because the server never receives the image bytes.

Official references: [signed upload flow](https://cloudinary.com/documentation/upload_images), [upload API](https://cloudinary.com/documentation/image_upload_api_reference), [Firestore rule conditions](https://firebase.google.com/docs/firestore/security/rules-conditions).

## Netlify and local development

- Build command: `npm run build`; publish directory: `dist`.
- Functions directory: `netlify/functions` (already configured in `netlify.toml`).
- Add the five server variables above plus the existing public `VITE_FIREBASE_*` configuration in Netlify, then redeploy.
- `npm run dev` serves the frontend and the signed-upload endpoint on the same Vite port (5173, or the next available port). Server settings are loaded from the ignored `.env` file. Restart the dev server after changing credentials. For a local service-account file, set `FIREBASE_SERVICE_ACCOUNT_FILE=C:/path/to/service-account.json` instead of copying its contents. The file is read only by the Node server. Never commit credentials. Netlify deployments still use `FIREBASE_SERVICE_ACCOUNT` with the complete JSON.
- A signed upload cannot work until these values and the preset are configured. Missing server configuration returns a clear error.

## Available flows

- Sign in / sign up / Google / password reset in a native, focus-contained overlay.
- Any account can buy and sell. Account menu: Buy a car, Sell a car, My listings, Enquiries & messages, Account, Settings.
- `/sell`: seller profile and consent, vehicle details, exactly four image previews, signed uploads and publication to Firestore.
- `/cars`: catalog with URL-preserved text, brand, city, fuel, body type, budget and price sorting. All active listings are available, with 12 cars per catalog page. Filtering and pagination currently happen in the browser.
- `/cars/:id`: photo gallery, specifications, seller description, Buy now enquiry.
- `/seller`: owned listings and Mark as sold.
- `/inquiries`: real-time buyer/seller conversations and free-text price negotiation. New enquiries appear in the seller inbox; there are no email or push notifications.
- `/account`, `/settings`: profile, buy/sell preference and password reset request.

Buy now sends an enquiry and opens a conversation. It does not charge money or reserve the vehicle. Existing conversations remain available after a listing is sold.

## Verification and current limits

```sh
npm run build
npm run lint
npm run test:rules
npm run test:functions
```

Rules tests use the local Firestore emulator and a `demo-buycars` project, never the live database. Java 21+ is required. Tests cover successful publication/enquiry/chat and denied cross-account writes/reads, incorrect photos, forged participants, featured escalation and sender impersonation.

Live email/Google authentication and real Cloudinary upload require your enabled providers and server configuration. They cannot be validated with missing credentials. Published listing editing, automatic deletion of abandoned Cloudinary uploads, moderation/reporting, email notifications, and payments are not included in this increment. Uploaded photos are reused on an in-page retry; leaving before publication can leave orphaned images. Review your `buycars/` assets periodically until cleanup is implemented. Negotiation currently uses private text messages, not binding offer/acceptance or payment processing.

## Authentication and database rules

The complete console-ready rule set is `firebase/firestore.rules`. Paste the whole file into Firestore Database → Rules and publish it. It covers private user profiles, public active listings, seller-owned listings, buyer/seller enquiries, private messages, and server-only upload quotas. All other paths are denied by default. Enquiry titles must match the actual listing.

Firestore rules protect **database access for authenticated users**. Email/password sign-up, Google sign-in and password-reset emails are handled by **Firebase Authentication**; they do not have a separate Firestore rule file. Enable Email/Password and Google under Authentication → Sign-in method, configure authorised domains, and configure email templates under Authentication → Templates. Do not add `allow read, write: if true` to make sign-in work.

The auth overlay starts with Continue with email / Continue with Google. Email sign-up asks for email and password; users can add their name and city in Account or seller onboarding. The platform uses Outfit, loaded from Google Fonts, with system fallbacks. Decorative hero animation respects reduced-motion preferences.

## Wishlist

Publish the latest `firebase/firestore.rules` to enable `users/{uid}/wishlist/{carId}`. Only the owner can read, add or remove saved cars. New saves must reference an active listing; removed or sold listings remain removable. Each save contains only `carId` and a server `createdAt` timestamp. No composite index is required. The header heart, account menu and `/wishlist` open saved cars. Hearts synchronize through one Firestore subscription per signed-in account. Signed-out users are prompted to sign in before saving.
