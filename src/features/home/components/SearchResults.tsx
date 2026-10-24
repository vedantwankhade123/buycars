import { X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CarGrid } from "@/components/shared/CarGrid";
import { Section } from "@/components/shared/Section";
import { DEMO_DATA_NOTICE, EMPTY_SEARCH } from "@/lib/constants";
import { priceRangeLabel } from "@/lib/utils";
import type { Car, CarSearchQuery } from "@/types/car.types";

/**
 * Renders wherever the hero search currently points. Phase 3 replaces this in-page panel with
 * the /cars route, which reads the same CarSearchQuery from URL search params.
 */
export function SearchResults({
  query,
  results,
  priceIndex,
  loading,
  onQueryChange,
}: {
  query: CarSearchQuery;
  results: Car[];
  priceIndex: Map<string, number>;
  loading: boolean;
  onQueryChange: (next: CarSearchQuery) => void;
}) {
  const chips: Array<{ key: string; label: string; clear: () => void }> = [];
  if (query.make) {
    chips.push({
      key: "make",
      label: query.make,
      clear: () => onQueryChange({ ...query, make: "", model: "" }),
    });
  }
  if (query.model)
    chips.push({
      key: "model",
      label: query.model,
      clear: () => onQueryChange({ ...query, model: "" }),
    });
  if (query.bodyType) {
    chips.push({
      key: "bodyType",
      label: query.bodyType,
      clear: () => onQueryChange({ ...query, bodyType: "" }),
    });
  }
  if (query.city)
    chips.push({
      key: "city",
      label: query.city,
      clear: () => onQueryChange({ ...query, city: "" }),
    });
  if (query.minPrice !== null || query.maxPrice !== null) {
    chips.push({
      key: "price",
      label: priceRangeLabel(query),
      clear: () => onQueryChange({ ...query, minPrice: null, maxPrice: null }),
    });
  }

  return (
    <Section id="search-results" className="scroll-mt-24 bg-canvas">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {loading
              ? "Searching…"
              : `${results.length} ${results.length === 1 ? "car" : "cars"} for you`}
          </h2>
          <p className="mt-1 text-sm text-muted">{DEMO_DATA_NOTICE}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onQueryChange(EMPTY_SEARCH)}>
          Clear all filters
        </Button>
      </div>

      {chips.length > 0 && (
        <ul className="mt-5 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <li key={chip.key}>
              <Badge tone="brand">
                {chip.label}
                <button
                  type="button"
                  onClick={chip.clear}
                  aria-label={`Remove ${chip.label} filter`}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-brand/15"
                >
                  <X aria-hidden="true" className="size-3" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <CarGrid
          cars={results}
          priceIndex={priceIndex}
          loading={loading}
          skeletonCount={4}
          emptyAction={
            <Button variant="outline" onClick={() => onQueryChange(EMPTY_SEARCH)}>
              Reset and browse everything
            </Button>
          }
        />
      </div>
    </Section>
  );
}
