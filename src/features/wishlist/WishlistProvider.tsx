import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";
import { WishlistContext } from "./WishlistContext";
import { watchWishlist, saveCar, removeCar } from "./service";
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return <WishlistSession key={user?.uid || "guest"}>{children}</WishlistSession>;
}
function WishlistSession({ children }: { children: ReactNode }) {
  const { user, signIn } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(!!user);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Set<string>>(new Set());
  const locks = useRef(new Set<string>());
  useEffect(() => {
    if (!user) return;
    return watchWishlist(
      user.uid,
      (next) => {
        setIds(next);
        setLoading(false);
        setError("");
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      },
    );
  }, [user]);
  async function change(id: string, remove: boolean) {
    if (!user) {
      toast.info("Sign in to save your favourite cars.");
      await signIn();
      return;
    }
    if (locks.current.has(id)) return;
    locks.current.add(id);
    setPending(new Set(locks.current));
    try {
      if (remove) await removeCar(user.uid, id);
      else await saveCar(user.uid, id);
      toast.success(remove ? "Removed from saved cars" : "Car saved to your wishlist");
    } catch {
      toast.error("Could not update saved cars", {
        description:
          "Please try again. If this continues, check that the latest database rules are published.",
      });
    } finally {
      locks.current.delete(id);
      setPending(new Set(locks.current));
    }
  }
  return (
    <WishlistContext.Provider
      value={{
        ids,
        loading,
        error,
        pending,
        toggle: (id) => change(id, ids.includes(id)),
        remove: (id) => change(id, true),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
