import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { AccountGate } from "@/components/shared/AccountGate";
import { myCars, markSold } from "@/features/marketplace/service";
import type { Car } from "@/types/car.types";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
export default function SellerPage() {
  return (
    <AccountGate>
      <Listings />
    </AccountGate>
  );
}
function Listings() {
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  useEffect(() => {
    void myCars(user!.uid)
      .then(setCars)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);
  return (
    <div className="workspace-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Your garage</h1>
        <a href="/sell" className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white">
          + List a car
        </a>
      </div>
      <p className="my-4 text-muted">Manage listings and connect with interested buyers.</p>
      <a href="/inquiries" className="text-brand">
        View buyer enquiries →
      </a>
      {error && (
        <p role="alert" className="my-4 text-danger">
          {error}
        </p>
      )}
      {loading ? (
        <p className="mt-8">Loading listings…</p>
      ) : cars.length === 0 ? (
        <div className="panel mt-8">
          Your garage is empty. Create your first listing to get started.
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {cars.map((car) => (
            <article key={car.id} className="panel flex flex-wrap items-center gap-5">
              <img
                className="h-24 w-36 rounded-xl object-cover"
                src={car.coverImage}
                alt={car.model}
              />
              <div className="mr-auto">
                <a href={`/cars/${car.id}`} className="font-bold">
                  {car.make} {car.model}
                </a>
                <p className="my-1 text-sm text-muted">
                  {formatINR(car.price)} · {car.status}
                </p>
              </div>
              {car.status === "active" && (
                <Button
                  variant="secondary"
                  disabled={busy === car.id}
                  onClick={async () => {
                    setBusy(car.id);
                    try {
                      await markSold(car.id);
                      setCars((rows) =>
                        rows.map((c) => (c.id === car.id ? { ...c, status: "sold" } : c)),
                      );
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Could not update.");
                    } finally {
                      setBusy("");
                    }
                  }}
                >
                  Mark as sold
                </Button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
