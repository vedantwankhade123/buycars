import { useState } from "react";
import { BODY_TYPE_ASSETS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { BodyType, Car } from "@/types/car.types";
import { Section, SectionHeading } from "@/components/shared/Section";

export function BodyTypeGrid({
  cars,
  onSelect,
}: {
  cars: Car[];
  onSelect: (bodyType: BodyType) => void;
}) {
  const counts = new Map<string, number>();
  for (const car of cars) counts.set(car.bodyType, (counts.get(car.bodyType) ?? 0) + 1);

  return (
    <Section id="browse-by-body-type">
      <SectionHeading
        eyebrow="Browse by body type"
        title="Pick the shape that fits the job"
        description="From a city hatchback to a seven-seat MUV for the long drive home."
        action={
          <p className="text-sm text-muted">
            <span className="font-semibold text-ink">{cars.length}</span> active listings
          </p>
        }
      />
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {BODY_TYPE_ASSETS.map((category) => (
          <li key={category.type}>
            <BodyTypeTile
              image={category.image}
              type={category.type}
              blurb={category.blurb}
              count={counts.get(category.type) ?? 0}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function BodyTypeTile({
  image,
  type,
  blurb,
  count,
  onSelect,
}: {
  image: string;
  type: BodyType;
  blurb: string;
  count: number;
  onSelect: (bodyType: BodyType) => void;
}) {
  const [failed, setFailed] = useState(false);
  const empty = count === 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      disabled={empty}
      aria-label={empty ? `${type} — no listings in this build yet` : `Browse ${count} used ${type} listings`}
      className={cn(
        "group relative block h-40 w-full overflow-hidden rounded-card bg-ink text-left ring-1 ring-line",
        empty
          ? "cursor-not-allowed saturate-50"
          : "transition-shadow duration-200 hover:shadow-raised",
      )}
    >
      {!failed && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-display text-base font-bold text-white">{type}</p>
        <p className="text-xs text-slate-300">{blurb}</p>
        <p className="mt-1.5 text-xs font-semibold text-blue-200">
          {empty ? "No listings yet" : `${count} ${count === 1 ? "listing" : "listings"}`}
        </p>
      </div>
    </button>
  );
}
