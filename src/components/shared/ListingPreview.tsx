import { useState } from "react";
import { Camera, Calendar, Fuel, Gauge, MapPin, Settings2 } from "lucide-react";
import { formatINR, formatKm } from "@/lib/utils";

export function ListingPreview({
  draft,
  images,
  city,
}: {
  draft: Record<string, string>;
  images: string[];
  city: string;
}) {
  const [photo, setPhoto] = useState(0);
  const value = (key: string, fallback: string) => draft[key]?.trim() || fallback;
  const price = Number(draft.price);
  const mileage = draft.mileageKm?.trim();
  const features = (draft.features || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const title =
    [draft.make?.trim(), draft.model?.trim()].filter(Boolean).join(" ") ||
    "Your car's next chapter";
  return (
    <aside aria-label="Live listing preview" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Listing preview</h2>
        <span className="flex items-center gap-1.5 rounded-full bg-brand-tint px-3 py-1 text-xs font-medium text-brand">
          <span className="size-1.5 rounded-full bg-brand" />
          Live preview
        </span>
      </div>
      <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
          {images.length ? (
            <img
              src={images[photo] || images[0]}
              alt={`${title}, photo ${photo + 1}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted">
              <Camera className="size-9 text-muted-2" strokeWidth={1.5} />
              <p className="text-sm">Your car photo goes here</p>
              <p className="text-xs text-muted-2">The first photo becomes your cover</p>
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-ink shadow-sm">
            Preview · Not published
          </span>
          {images.length > 0 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-white">
              {Math.min(photo + 1, images.length)} / {images.length}
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 border-b border-line p-3">
            {images.map((src, i) => (
              <button
                type="button"
                key={src}
                onClick={() => setPhoto(i)}
                aria-label={`Preview photo ${i + 1}`}
                aria-pressed={i === photo}
                className={`overflow-hidden rounded-lg border-2 ${i === photo ? "border-brand" : "border-transparent"}`}
              >
                <img
                  src={src}
                  className="aspect-[4/3] w-full object-cover"
                  alt={`Car photo ${i + 1}`}
                />
              </button>
            ))}
          </div>
        )}
        <div className="p-5">
          <h3 className="break-words text-xl font-semibold leading-tight">{title}</h3>
          <p className="mt-1 min-h-5 text-sm text-muted">
            {value("variant", "Add a variant to complete your title")}
          </p>
          <p className={`my-5 text-2xl font-semibold ${price > 0 ? "text-ink" : "text-muted-2"}`}>
            {Number.isFinite(price) && price > 0 ? formatINR(price) : "Set your asking price"}
          </p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 border-y border-line py-4">
            {[
              { icon: Calendar, label: "Year", value: value("year", "Year") },
              {
                icon: Gauge,
                label: "Odometer",
                value:
                  mileage && Number.isFinite(Number(mileage))
                    ? formatKm(Number(mileage))
                    : "Odometer",
              },
              { icon: Fuel, label: "Fuel", value: value("fuelType", "Petrol") },
              { icon: Settings2, label: "Transmission", value: value("transmission", "Manual") },
            ].map(({ icon: Icon, label, value: text }) => (
              <div key={label} className="flex min-w-0 items-center gap-2">
                <Icon aria-hidden="true" className="size-4 shrink-0 text-muted" />
                <div className="min-w-0">
                  <dt className="text-[11px] text-muted">{label}</dt>
                  <dd className="truncate text-sm font-medium">{text}</dd>
                </div>
              </div>
            ))}
          </dl>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="break-words">
              {[draft.city?.trim() || city, draft.state?.trim()].filter(Boolean).join(", ") ||
                "Your location"}
            </span>
          </p>
          {draft.description?.trim() && (
            <p className="mt-4 line-clamp-3 break-words text-sm leading-6 text-muted">
              {draft.description}
            </p>
          )}
          {features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {features.slice(0, 4).map((feature, i) => (
                <span
                  key={`${feature}-${i}`}
                  className="max-w-full truncate rounded-full bg-brand-tint px-3 py-1 text-xs text-brand"
                >
                  {feature}
                </span>
              ))}
              {features.length > 4 && (
                <span className="py-1 text-xs text-muted">+{features.length - 4} more</span>
              )}
            </div>
          )}
        </div>
      </article>
      <p className="mt-4 text-xs leading-5 text-muted">
        This is how buyers will see your car. Your listing goes live only when you select Publish
        listing.
      </p>
    </aside>
  );
}
