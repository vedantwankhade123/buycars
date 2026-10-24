import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";
import { auth, missingFirebaseConfig } from "@/lib/firebase";

export const isFirebaseConfigured = auth !== null;
export const missingConfig = missingFirebaseConfig;

const googleProvider = new GoogleAuthProvider();
// Always let the user pick an account instead of silently reusing the last one.
googleProvider.setCustomParameters({ prompt: "select_account" });

const CANCELLED_CODES = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
  "auth/user-cancelled",
]);

function errorCode(error: unknown): string | null {
  if (typeof error === "object" && error !== null && "code" in error) {
    const { code } = error as { code?: unknown };
    return typeof code === "string" ? code : null;
  }
  return null;
}

export function isAuthCancellation(error: unknown): boolean {
  const code = errorCode(error);
  return code !== null && CANCELLED_CODES.has(code);
}

export function authErrorMessage(error: unknown): string {
  switch (errorCode(error)) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email or password is incorrect. Please try again.";
    case "auth/email-already-in-use":
      return "This email already has an account. Choose Sign in instead.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Choose a password with at least 8 characters.";
    case "auth/network-request-failed":
      return "The network request failed. Check your connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts from this device. Wait a few minutes and try again.";
    case "auth/unauthorized-domain":
      return "This domain is not authorised in Firebase Authentication settings.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled for this Firebase project.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in window. Allow pop-ups and try again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method.";
    default:
      return "Something went wrong while signing in. Please try again.";
  }
}

export function subscribeToAuthUser(onChange: (user: User | null) => void): () => void {
  if (!auth) {
    onChange(null);
    return () => {};
  }
  return onAuthStateChanged(auth, onChange);
}

/**
 * Completes a sign-in that fell back to a full-page redirect (blocked pop-up). Must run on
 * every load; resolves to null when there is no pending redirect.
 */
export async function completeRedirectSignIn(): Promise<User | null> {
  if (!auth) return null;
  const result = await getRedirectResult(auth);
  return result?.user ?? null;
}

/**
 * Opens Google sign-in in a pop-up. If the browser blocks it, falls back to a redirect so
 * the user is never left on a dead button.
 */
export async function signInWithGoogle(): Promise<"popup" | "redirect"> {
  if (!auth) {
    throw new Error(
      "Firebase is not configured. Add the VITE_FIREBASE_* variables to .env.local and restart the dev server.",
    );
  }
  try {
    await signInWithPopup(auth, googleProvider);
    return "popup";
  } catch (error) {
    if (errorCode(error) === "auth/popup-blocked") {
      await signInWithRedirect(auth, googleProvider);
      return "redirect";
    }
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}
