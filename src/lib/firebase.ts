import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

/**
 * Firebase bootstrap.
 *
 * Everything here is public configuration. Authorization is enforced by Firebase Auth and
 * Firestore Security Rules, never by hiding these values. No service-account credential
 * may ever be imported into this module — it would be shipped to the browser.
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "",
};

const REQUIRED_KEYS = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
] as const satisfies ReadonlyArray<keyof typeof config>;

/** Names of missing vars, for a developer-facing message. Empty means configured. */
export const missingFirebaseConfig: string[] = REQUIRED_KEYS.filter((key) => !config[key]).map(
  (key) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, (char) => `_${char}`).toUpperCase()}`,
);

function createApp(): FirebaseApp | null {
  if (missingFirebaseConfig.length > 0) return null;
  return getApps().length > 0 ? getApp() : initializeApp(config);
}

const app = createApp();

export const firebaseApp: FirebaseApp | null = app;
export const auth: Auth | null = app ? getAuth(app) : null;

// Firestore is initialized by the marketplace service when a database operation is needed.

/**
 * Analytics is optional and only runs in production builds, loaded on demand so it never
 * blocks first paint or inflates the landing-page bundle.
 */
export async function initAnalytics(): Promise<void> {
  if (!app || !import.meta.env.PROD || !config.measurementId) return;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (await isSupported()) getAnalytics(app);
}
