import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { ListingPreview } from "@/components/shared/ListingPreview";
import { AccountGate } from "@/components/shared/AccountGate";
import { getProfile, saveProfile, uploadImage, publishCar } from "@/features/marketplace/service";
import { BODY_TYPES, FUEL_TYPES, TRANSMISSIONS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import type { CarImage, Car } from "@/types/car.types";
export default function SellPage() {
  return (
    <AccountGate>
      <SellerForm />
    </AccountGate>
  );
}
function SellerForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [listingId] = useState(() => crypto.randomUUID());
  const [uploaded, setUploaded] = useState<CarImage[]>([]);
  const [name, setName] = useState(user?.displayName || "");
  const [city, setCity] = useState("");
  const [draft, setDraft] = useState<Record<string, string>>({
    fuelType: FUEL_TYPES[0]!,
    transmission: TRANSMISSIONS[0]!,
    bodyType: BODY_TYPES[0]!,
  });
  useEffect(() => {
    void getProfile(user!.uid)
      .then((p) => {
        setOnboarded(!!p?.sellerOnboarded);
        if (p) {
          setName(p.name);
          setCity(p.city);
        }
        setReady(true);
      })
      .catch((e) => setError(e.message));
  }, [user]);
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);
  async function onboard(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await saveProfile({ name, city, intent: "both", sellerOnboarded: true });
      setOnboarded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save profile.");
    } finally {
      setBusy(false);
    }
  }
  async function publish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (files.length !== 4) {
      setError("Choose exactly four car photos.");
      return;
    }
    const data = new FormData(e.currentTarget);
    const features = String(data.get("features") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (features.length > 30 || String(data.get("description") || "").trim().length < 30) {
      setError("Add at least 30 characters of description and no more than 30 features.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const images = [...uploaded];
      for (let i = images.length; i < 4; i++) {
        setProgress(`Uploading photo ${i + 1} of 4…`);
        images.push(await uploadImage(files[i]!, listingId, i));
        setUploaded([...images]);
      }
      setProgress("Publishing your listing…");
      const str = (k: string) => String(data.get(k) || "").trim();
      const num = (k: string) => Number(data.get(k));
      const car: Omit<Car, "id"> = {
        sellerId: user!.uid,
        make: str("make"),
        model: str("model"),
        variant: str("variant"),
        year: num("year"),
        price: num("price"),
        mileageKm: num("mileageKm"),
        fuelType: str("fuelType") as Car["fuelType"],
        transmission: str("transmission") as Car["transmission"],
        bodyType: str("bodyType") as Car["bodyType"],
        ownershipCount: num("ownershipCount"),
        registrationState: str("registrationState").toUpperCase(),
        color: str("color"),
        city: str("city"),
        state: str("state"),
        description: str("description"),
        features: str("features")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        images,
        coverImage: images[0]!.url,
        status: "active",
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await publishCar(car, listingId);
      navigate(`/cars/${listingId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not publish listing.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }
  return (
    <div className={`workspace-page ${onboarded ? "" : "max-w-3xl"}`}>
      <p className="eyebrow">Sell with BuyCars</p>
      <h1 className="mt-2 text-4xl font-extrabold">
        {onboarded ? "Tell your car's story" : "Meet your next buyer"}
      </h1>
      <p className="mb-8 mt-3 text-muted">
        {onboarded
          ? "Add the details, four clear photos and your asking price."
          : "Set up your seller profile. You can buy and sell with the same account."}
      </p>
      {error && (
        <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-danger">
          {error}
        </p>
      )}
      {!ready ? (
        <p>Loading seller profile…</p>
      ) : !onboarded ? (
        <form className="panel grid gap-5" onSubmit={(e) => void onboard(e)}>
          <label>
            Your name
            <input
              className="field"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Your city
            <input
              className="field"
              required
              maxLength={80}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label className="flex gap-3 text-sm">
            <input type="checkbox" required />I will provide accurate details and only list a car I
            am authorised to sell.
          </label>
          <Button type="submit" disabled={busy}>
            Continue to listing →
          </Button>
        </form>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] xl:gap-12">
          <form
            onSubmit={(e) => void publish(e)}
            className="grid min-w-0 gap-6"
            onChange={(event) => {
              const field = event.target;
              if (
                (field instanceof HTMLInputElement ||
                  field instanceof HTMLSelectElement ||
                  field instanceof HTMLTextAreaElement) &&
                field.name &&
                field.type !== "file" &&
                field.type !== "checkbox"
              ) {
                setDraft((current) => ({ ...current, [field.name]: field.value }));
              }
            }}
          >
            <fieldset disabled={busy} className="panel grid gap-5 sm:grid-cols-2">
              <legend className="text-lg font-bold">1. Car details</legend>
              {[
                ["make", "Brand", "text"],
                ["model", "Model", "text"],
                ["variant", "Variant", "text"],
                ["year", "Manufacturing year", "number"],
                ["price", "Asking price (₹)", "number"],
                ["mileageKm", "Odometer (km)", "number"],
                ["ownershipCount", "Number of owners", "number"],
                ["color", "Colour", "text"],
                ["registrationState", "Registration state (e.g. MH)", "text"],
                ["city", "City", "text"],
                ["state", "State", "text"],
              ].map(([key, label, type]) => (
                <label key={key}>
                  {label}
                  <input
                    className="field"
                    name={key}
                    type={type}
                    required={key !== "variant"}
                    defaultValue={key === "city" ? city : undefined}
                    maxLength={key === "registrationState" ? 2 : 80}
                    pattern={key === "registrationState" ? "[A-Za-z]{2}" : undefined}
                    min={
                      key === "year" ? 1990 : key === "ownershipCount" || key === "price" ? 1 : 0
                    }
                    max={
                      key === "year"
                        ? new Date().getFullYear()
                        : key === "ownershipCount"
                          ? 10
                          : key === "price"
                            ? 100000000
                            : key === "mileageKm"
                              ? 2000000
                              : undefined
                    }
                    step={type === "number" ? 1 : undefined}
                  />
                </label>
              ))}
              {[
                ["fuelType", "Fuel", FUEL_TYPES],
                ["transmission", "Transmission", TRANSMISSIONS],
                ["bodyType", "Body type", BODY_TYPES],
              ].map(([key, label, options]) => (
                <label key={String(key)}>
                  {label}
                  <select className="field" name={String(key)} required>
                    {(options as readonly string[]).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
              ))}
              <label className="sm:col-span-2">
                Description
                <textarea
                  className="field min-h-32"
                  name="description"
                  required
                  minLength={30}
                  maxLength={5000}
                  placeholder="Condition, service history, reason for selling…"
                />
              </label>
              <label className="sm:col-span-2">
                Features (separate with commas)
                <input
                  className="field"
                  name="features"
                  maxLength={1000}
                  placeholder="Reverse camera, sunroof, cruise control"
                />
              </label>
            </fieldset>
            <fieldset disabled={busy || uploaded.length > 0} className="panel">
              <legend className="text-lg font-bold">2. Four photos</legend>
              <p className="mb-4 text-sm text-muted">
                Front, rear, side and interior. JPG, PNG or WebP, up to 5 MB each. The first photo
                is your cover.
              </p>
              <input
                aria-label="Choose four car photos"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => {
                  const chosen = Array.from(e.target.files || []);
                  if (
                    chosen.length !== 4 ||
                    chosen.some(
                      (f) =>
                        f.size > 5 * 1024 * 1024 ||
                        !["image/jpeg", "image/png", "image/webp"].includes(f.type),
                    )
                  ) {
                    setError("Select exactly four JPG, PNG or WebP photos, each under 5 MB.");
                    return;
                  }
                  setError("");
                  setFiles(chosen);
                  setPreviews(chosen.map((f) => URL.createObjectURL(f)));
                  setUploaded([]);
                }}
              />
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {previews.map((url, i) => (
                  <div key={url}>
                    <img
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                      src={url}
                      alt={`Selected car photo ${i + 1}`}
                    />
                    <p className="mt-1 text-xs text-muted">
                      {i === 0 ? "Cover photo" : `Photo ${i + 1}`}
                    </p>
                  </div>
                ))}
              </div>
            </fieldset>
            <label className="flex items-start gap-3 text-sm">
              <input className="mt-1" required type="checkbox" disabled={busy} />I confirm the
              details are accurate and I am authorised to sell this car.
            </label>
            <Button type="submit" disabled={busy || files.length !== 4}>
              {busy ? progress : "Publish listing →"}
            </Button>
            <p className="text-xs text-muted">
              Your listing will appear publicly in the catalog. Conversations stay private.
            </p>
          </form>
          <ListingPreview draft={draft} images={previews} city={city} />
        </div>
      )}
    </div>
  );
}
