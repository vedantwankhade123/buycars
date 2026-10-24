import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCar, enquire } from "@/features/marketplace/service";
import { DEMO_CARS } from "@/features/cars/data/demo-cars";
import type { Car } from "@/types/car.types";
import { useAuth } from "@/features/auth/AuthContext";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { Button } from "@/components/ui/Button";
import { formatINR, formatKm } from "@/lib/utils";
export default function CarDetailPage() {
  const { carId } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [image, setImage] = useState(0);
  const [busy, setBusy] = useState(false);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    const task = import.meta.env.VITE_FIREBASE_PROJECT_ID
      ? getCar(carId!)
      : Promise.resolve(DEMO_CARS.find((c) => c.id === carId) || null);
    void task
      .then((c) => {
        if (active) {
          setCar(c);
          setImage(0);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [carId]);
  async function buy() {
    if (!user) {
      await signIn();
      return;
    }
    setBusy(true);
    try {
      const id = await enquire(car!);
      navigate(`/inquiries?thread=${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send enquiry.");
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <div className="workspace-page">Loading car…</div>;
  if (!car)
    return (
      <div className="workspace-page">
        <h1>Car unavailable</h1>
        <p>{error || "This listing is no longer available."}</p>
        <a href="/cars" className="text-brand">
          Explore cars
        </a>
      </div>
    );
  return (
    <div className="workspace-page">
      <a href="/cars" className="text-sm text-brand">
        ← Back to cars
      </a>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <img
            className="aspect-[4/3] w-full rounded-2xl object-cover"
            src={car.images[image]?.url || car.coverImage}
            alt={car.images[image]?.alt || car.model}
          />
          <div className="mt-3 flex gap-3">
            {car.images.map((photo, i) => (
              <button
                key={photo.publicId}
                onClick={() => setImage(i)}
                aria-label={`View photo ${i + 1}`}
                aria-pressed={i === image}
                className={`w-1/4 overflow-hidden rounded-lg border-2 ${i === image ? "border-brand" : "border-transparent"}`}
              >
                <img className="aspect-[4/3] w-full object-cover" src={photo.url} alt={photo.alt} />
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-7">
          <p className="eyebrow">
            {car.city}, {car.state}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold">
            {car.make} {car.model}
          </h1>
          <p className="mt-2 text-muted">
            {car.variant} · {car.year}
          </p>
          <p className="my-6 text-3xl font-extrabold">{formatINR(car.price)}</p>
          <WishlistButton carId={car.id} title={`${car.make} ${car.model}`} className="mb-5" />
          <dl className="grid grid-cols-2 gap-5 border-y border-line py-6">
            {[
              ["Odometer", formatKm(car.mileageKm)],
              ["Fuel", car.fuelType],
              ["Transmission", car.transmission],
              ["Owners", car.ownershipCount],
              ["Body type", car.bodyType],
              ["Registration", car.registrationState],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="mt-1 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="my-5 text-sm text-muted">
            Buy now sends an enquiry. Discuss the price and arrange a viewing in your private
            conversation.
          </p>
          {error && (
            <p role="alert" className="mb-4 text-danger">
              {error}
            </p>
          )}
          <Button
            fullWidth
            disabled={
              busy ||
              user?.uid === car.sellerId ||
              car.status !== "active" ||
              !import.meta.env.VITE_FIREBASE_PROJECT_ID
            }
            onClick={() => void buy()}
          >
            {user?.uid === car.sellerId
              ? "Your listing"
              : car.status !== "active"
                ? "No longer available"
                : busy
                  ? "Opening conversation…"
                  : "Buy now · Enquire"}
          </Button>
        </div>
      </div>
      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl font-bold">About this car</h2>
        <p className="mt-4 whitespace-pre-wrap leading-7 text-muted">{car.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {car.features.map((f) => (
            <span key={f} className="rounded-full bg-brand-tint px-4 py-2 text-sm text-brand">
              {f}
            </span>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted">
          Specifications are provided by the seller. Inspect the car and verify documents before
          agreeing to a purchase.
        </p>
      </section>
    </div>
  );
}
