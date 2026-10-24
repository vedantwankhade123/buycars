import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  ArrowRight,
  Calendar,
  Fuel,
  Heart,
  MapPin,
  Route,
  Settings2,
  Sparkles,
  Tag,
} from "lucide-react";
import { BADGE_LABELS, carTitle, cn, formatINR, formatKm } from "@/lib/utils";
import { comingSoon } from "@/lib/phaseNotices";
import type { Car, CarBadge } from "@/types/car.types";
import { Badge } from "@/components/ui/Badge";
import type { BadgeTone } from "@/components/ui/Badge";

const badgeTones: Record<CarBadge, BadgeTone> = {
  recent: "brand",
  featured: "dark",
  great_value: "success",
};

const badgeIcons: Record<CarBadge, LucideIcon> = {
  recent: Sparkles,
  featured: BadgeCheck,
  great_value: Tag,
};

export function CarCard({ car, badges }: { car: Car; badges: CarBadge[] }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line transition-shadow duration-200 hover:shadow-raised">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        {imageFailed ? (
          <div className="grid h-full w-full place-items-center text-muted-2">
            <span className="flex flex-col items-center gap-2 text-xs">
              <Route aria-hidden="true" className="size-7" />
              Photo unavailable
            </span>
          </div>
        ) : (
          <img
            src={car.coverImage}
            alt={car.images[0]?.alt ?? `${carTitle(car)} — cover photo`}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}

        {badges.length > 0 && (
          <ul className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {badges.map((badge) => {
              const Icon = badgeIcons[badge];
              return (
                <li key={badge}>
                  <Badge tone={badgeTones[badge]} className="shadow-sm">
                    <Icon aria-hidden="true" className="size-3" />
                    {BADGE_LABELS[badge]}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}

        <button
          type="button"
          onClick={() => comingSoon("Saved cars", "Phase 5")}
          aria-label={`Save ${carTitle(car)} to your wishlist`}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-brand"
        >
          <Heart aria-hidden="true" className="size-[18px]" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-base font-bold leading-snug text-ink">
            {carTitle(car)}
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted">{car.variant}</p>
        </div>

        <p className="text-xl font-extrabold tracking-tight text-ink">{formatINR(car.price)}</p>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-ink-3">
          <Spec icon={Calendar} value={`${car.year}`} label="Year" />
          <Spec icon={Route} value={formatKm(car.mileageKm)} label="Odometer" />
          <Spec icon={Fuel} value={car.fuelType} label="Fuel" />
          <Spec icon={Settings2} value={car.transmission} label="Transmission" />
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <MapPin aria-hidden="true" className="size-3.5" />
            {car.city}
          </p>
          <button
            type="button"
            onClick={() => comingSoon("Vehicle details", "Phase 3")}
            className={cn(
              "inline-flex items-center gap-1 rounded-field px-2.5 py-1.5 text-xs font-semibold text-brand",
              "transition-colors hover:bg-brand-tint",
            )}
          >
            View Details
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <li className="flex items-center gap-1.5" title={label}>
      <Icon aria-hidden="true" className="size-3.5 shrink-0 text-muted-2" />
      <span className="truncate">{value}</span>
      <span className="sr-only">{label}</span>
    </li>
  );
}
