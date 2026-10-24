import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/Button";
export function AccountGate({ children }: { children: ReactNode }) {
  const { user, status, signIn } = useAuth();
  if (status === "loading") return <p className="workspace-page">Loading account…</p>;
  if (!user)
    return (
      <div className="workspace-page">
        <h1 className="text-3xl font-bold">Your journey starts here</h1>
        <p className="my-4 text-muted">Sign in to save cars, sell a car and manage your conversations.</p>
        <Button onClick={() => void signIn()}>Sign in or create account</Button>
      </div>
    );
  return children;
}
