import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/components/AuthProvider";

/**
 * Provider stack. QueryProvider (TanStack Query) is added in Phase 3 when async data
 * fetching begins.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </AuthProvider>
  );
}
