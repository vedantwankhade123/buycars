import { Search } from "lucide-react";
import { PRICE_BUCKETS } from "@/lib/constants";
import type { CarSearchQuery } from "@/types/car.types";
import { Select } from "@/components/ui/Select";
import type { SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { cn, isQueryActive, priceBucketFor } from "@/lib/utils";

/**
 * The hero search is a real filter over the active listing set, not decoration:
 * Model options are derived from the chosen Make, and submitting narrows the results
 * shown in the Search Results section. Phase 3 moves the same query object to /cars
 * via URL search params.
 */
export function CarSearchBar({
  query,
  onChange,
  onSubmit,
  onReset,
  makeOptions,
  modelOptions,
  cityOptions,
  tone = "light",
  className,
}: {
  query: CarSearchQuery;
  onChange: (next: CarSearchQuery) => void;
  onSubmit: () => void;
  onReset: () => void;
  makeOptions: readonly SelectOption[];
  modelOptions: readonly SelectOption[];
  cityOptions: readonly SelectOption[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const budgetOptions: SelectOption[] = PRICE_BUCKETS.map((bucket, index) => ({
    value: String(index),
    label: bucket.label,
  }));

  const bucket = priceBucketFor(query);
  const budgetIndex = bucket === null ? "" : String(PRICE_BUCKETS.indexOf(bucket));

  const setBudget = (value: string) => {
    const next = value === "" ? null : PRICE_BUCKETS[Number(value)];
    onChange({ ...query, minPrice: next?.min ?? null, maxPrice: next?.max ?? null });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className={cn(
        "rounded-2xl p-4 shadow-raised ring-1 sm:p-6",
        tone === "light" ? "bg-surface ring-line" : "bg-white/95 ring-white/40 backdrop-blur",
        className,
      )}
      aria-label="Search used cars"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_1fr_1fr_auto] lg:items-end">
        <Select
          label="Car brand"
          placeholder="Any brand"
          value={query.make}
          options={makeOptions}
          onChange={(event) =>
            // Changing the make invalidates the model, so both reset together.
            onChange({ ...query, make: event.target.value, model: "" })
          }
        />
        <Select
          label="Model"
          placeholder={query.make ? "All models" : "Choose a brand"}
          value={query.model}
          options={modelOptions}
          disabled={!query.make}
          onChange={(event) => onChange({ ...query, model: event.target.value })}
        />
        <Select
          label="Your budget"
          placeholder="Any budget"
          value={budgetIndex}
          options={budgetOptions}
          onChange={(event) => setBudget(event.target.value)}
        />
        <Select
          label="Location"
          placeholder="All cities"
          value={query.city}
          options={cityOptions}
          onChange={(event) => onChange({ ...query, city: event.target.value })}
        />
        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
          <Button type="submit" size="md" className="h-11 flex-1 lg:flex-none lg:px-6">
            <Search aria-hidden="true" className="size-4" />
            Find cars
          </Button>
          {isQueryActive(query) && (
            <Button type="button" variant="outline" size="md" onClick={onReset} className="h-11">
              Reset
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
