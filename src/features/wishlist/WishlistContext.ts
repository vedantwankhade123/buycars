import { createContext, useContext } from "react";
export interface WishlistValue {
  ids: string[];
  loading: boolean;
  error: string;
  pending: Set<string>;
  toggle: (carId: string) => Promise<void>;
  remove: (carId: string) => Promise<void>;
}
export const WishlistContext = createContext<WishlistValue | null>(null);
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("Wishlist provider is missing.");
  return context;
}
