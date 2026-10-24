import { Heart } from "lucide-react";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";
export function WishlistButton({
  carId,
  title,
  compact = false,
  className,
}: {
  carId: string;
  title: string;
  compact?: boolean;
  className?: string;
}) {
  const { ids, pending, loading, toggle } = useWishlist();
  const { user, status } = useAuth();
  const saved = ids.includes(carId);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`${saved ? "Remove" : "Save"} ${title} ${saved ? "from" : "to"} your wishlist`}
      disabled={pending.has(carId) || status === "loading" || (!!user && loading)}
      onClick={() => void toggle(carId)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/95 text-sm font-medium shadow-sm transition-colors hover:bg-brand-tint disabled:opacity-60",
        compact ? "size-9" : "min-h-11 px-5",
        saved ? "text-brand" : "text-ink",
        className,
      )}
    >
      <Heart aria-hidden="true" className={cn("size-[18px]", saved && "fill-current")} />
      {!compact && (pending.has(carId) ? "Updating…" : saved ? "Saved to wishlist" : "Save car")}
    </button>
  );
}
