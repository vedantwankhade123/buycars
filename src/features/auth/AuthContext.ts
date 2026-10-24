import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

/** `unavailable` means the VITE_FIREBASE_* env vars are missing in this build. */
export type AuthStatus = "loading" | "ready" | "unavailable";

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  pending: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (value === null) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}
