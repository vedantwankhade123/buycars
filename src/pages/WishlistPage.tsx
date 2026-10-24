import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { AccountGate } from "@/components/shared/AccountGate";
import { CarGrid } from "@/components/shared/CarGrid";
import { ButtonLink } from "@/components/ui/Button";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { readSavedCar } from "@/features/wishlist/service";
import { buildPriceIndex } from "@/lib/utils";
import type { Car } from "@/types/car.types";
export default function WishlistPage() {
  return (
    <AccountGate>
      <SavedCars />
    </AccountGate>
  );
}
function SavedCars() {
  const { ids, loading, error } = useWishlist();
  return (
    <div className="workspace-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Your saved cars</h1>
          <p className="mt-2 text-muted">
            Keep your favourites close. Come back when you're ready.
          </p>
        </div>
        <ButtonLink href="/cars" variant="outline">
          Explore more cars
        </ButtonLink>
      </div>
      {error ? (
        <p role="alert" className="panel mt-8 text-danger">
          Could not load saved cars. {error}
        </p>
      ) : loading ? (
        <p role="status" className="mt-8 text-muted">
          Loading your wishlist…
        </p>
      ) : (
        <SavedResults key={JSON.stringify(ids)} ids={ids} />
      )}
    </div>
  );
}
function SavedResults({ ids }: { ids: string[] }) {
  const { remove, pending } = useWishlist();
  const [state, setState] = useState<{
    cars: Car[];
    unavailable: string[];
    loading: boolean;
    error: string;
  }>({ cars: [], unavailable: [], loading: ids.length > 0, error: "" });
  useEffect(() => {
    if (!ids.length) return;
    let active = true;
    void Promise.all(ids.map(async (id) => ({ id, car: await readSavedCar(id) })))
      .then((rows) => {
        if (active)
          setState({
            cars: rows.flatMap((row) => (row.car ? [row.car] : [])),
            unavailable: rows.filter((row) => !row.car).map((row) => row.id),
            loading: false,
            error: "",
          });
      })
      .catch(() => {
        if (active)
          setState({
            cars: [],
            unavailable: [],
            loading: false,
            error:
              "Could not load the saved listings. Check your connection and refresh to try again.",
          });
      });
    return () => {
      active = false;
    };
  }, [ids]);
  if (!ids.length)
    return (
      <div className="panel mt-8 flex min-h-72 flex-col items-center justify-center text-center">
        <Heart aria-hidden="true" className="mb-4 size-10 text-brand" />
        <h2 className="text-xl font-semibold">Your next car could be a favourite</h2>
        <p className="mb-6 mt-2 max-w-md text-sm text-muted">
          Tap the heart on any car to save it here. Your wishlist stays with your account.
        </p>
        <ButtonLink href="/cars">Find a car</ButtonLink>
      </div>
    );
  return (
    <div className="mt-8">
      {state.error ? (
        <p role="alert" className="panel text-danger">
          {state.error}
        </p>
      ) : (
        <>
          {(state.loading || state.cars.length > 0) && (
            <CarGrid
              cars={state.cars}
              loading={state.loading}
              priceIndex={buildPriceIndex(state.cars)}
            />
          )}{" "}
          {state.unavailable.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">No longer available</h2>
              <p className="mb-4 text-sm text-muted">
                These listings may have been sold or removed.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {state.unavailable.map((id) => (
                  <li key={id} className="panel flex items-center justify-between gap-3">
                    <span className="text-sm text-muted">Listing unavailable</span>
                    <button
                      type="button"
                      disabled={pending.has(id)}
                      onClick={() => void remove(id)}
                      className="text-sm font-medium text-brand disabled:opacity-50"
                    >
                      {pending.has(id) ? "Removing…" : "Remove"}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
