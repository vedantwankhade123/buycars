import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { WishlistProvider } from "@/features/wishlist/WishlistProvider";
import { AuthProvider } from "@/features/auth/components/AuthProvider";

/**
 * Provider stack. QueryProvider (TanStack Query) is added in Phase 3 when async data
 * fetching begins.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>{children}</WishlistProvider>
      <Toaster position="bottom-right" richColors closeButton />
    </AuthProvider>
  );
}
