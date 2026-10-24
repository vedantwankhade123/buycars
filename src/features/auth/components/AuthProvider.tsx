import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { toast } from "sonner";
import { AuthModal } from "./AuthModal";
import { AuthContext, type AuthContextValue, type AuthStatus } from "@/features/auth/AuthContext";

interface AuthService {
  isFirebaseConfigured: boolean;
  missingConfig: string[];
  authErrorMessage: (error: unknown) => string;
  isAuthCancellation: (error: unknown) => boolean;
  completeRedirectSignIn: () => Promise<User | null>;
  signInWithGoogle: () => Promise<"popup" | "redirect">;
  signOutUser: () => Promise<void>;
  subscribeToAuthUser: (onChange: (user: User | null) => void) => () => void;
}

/**
 * Firebase Auth is loaded on demand rather than imported at the module top level: the
 * landing page paints without the SDK, and the module arrives immediately after mount.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [modalOpen, setModalOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const serviceRef = useRef<AuthService | null>(null);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    void import("@/features/auth/services/authService")
      .then(async (service) => {
        if (cancelled) return;
        serviceRef.current = service;

        if (!service.isFirebaseConfigured) {
          setStatus("unavailable");
          return;
        }

        unsubscribe = service.subscribeToAuthUser((nextUser) => {
          setUser(nextUser);
          setStatus("ready");
        });

        try {
          await service.completeRedirectSignIn();
        } catch (error) {
          if (service.isAuthCancellation(error)) return;
          toast.error("Could not finish sign-in", {
            description: service.authErrorMessage(error),
          });
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const googleSignIn = useCallback(async () => {
    const service = serviceRef.current;
    if (!service) {
      toast.info("Sign-in is still loading", { description: "Try again in a moment." });
      return;
    }
    if (!service.isFirebaseConfigured) {
      toast.error("Firebase is not configured", {
        description: `Missing ${service.missingConfig.join(", ")}. Add them to .env.local and restart the dev server.`,
      });
      return;
    }

    setPending(true);
    try {
      const result = await service.signInWithGoogle();
      if (result === "redirect") {
        toast.info("Continuing in Google sign-in", {
          description: "Your browser blocked the pop-up, so we opened the full-page flow.",
        });
      }
    } catch (error) {
      if (service.isAuthCancellation(error)) return;
      toast.error("Could not sign in", { description: service.authErrorMessage(error) });
    } finally {
      setPending(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    const service = serviceRef.current;
    if (!service) return;
    setPending(true);
    try {
      await service.signOutUser();
      toast.success("Signed out");
    } catch {
      toast.error("Could not sign out", { description: "Please try again." });
    } finally {
      setPending(false);
    }
  }, []);

  const signIn = useCallback(async () => {
    setModalOpen(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, pending, signIn, signOut }),
    [user, status, pending, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} onGoogle={googleSignIn} />}
    </AuthContext.Provider>
  );
}
