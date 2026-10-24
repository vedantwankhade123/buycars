import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useActiveCars } from "@/features/cars/hooks/useActiveCars";
import { CarGrid } from "@/components/shared/CarGrid";
import { buildPriceIndex } from "@/lib/utils";
import { BODY_TYPES, FUEL_TYPES } from "@/lib/constants";
export default function CatalogPage() {
  const { cars, loading, error } = useActiveCars();
  const [params, setParams] = useSearchParams();
  const value = (key: string) => params.get(key) || "";
  const change = (key: string, v: string) => {
    const next = new URLSearchParams(params);
    next.delete("page");
    if (v) next.set(key, v);
    else next.delete(key);
    setParams(next);
  };
  const filtered = useMemo(
    () =>
      cars
        .filter(
          (c) =>
            (!params.get("q") ||
              `${c.make} ${c.model} ${c.variant}`
                .toLowerCase()
                .includes(params.get("q")!.toLowerCase())) &&
            (!params.get("city") || c.city === params.get("city")) &&
            (!params.get("make") || c.make === params.get("make")) &&
            (!params.get("bodyType") || c.bodyType === params.get("bodyType")) &&
            (!params.get("fuel") || c.fuelType === params.get("fuel")) &&
            (!params.get("maxPrice") || c.price <= Number(params.get("maxPrice"))) &&
            (!params.get("minPrice") || c.price > Number(params.get("minPrice"))),
        )
        .sort((a, b) =>
          params.get("sort") === "low"
            ? a.price - b.price
            : params.get("sort") === "high"
              ? b.price - a.price
              : b.createdAt.localeCompare(a.createdAt),
        ),
    [cars, params],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12));
  const page = Math.max(1, Math.min(pageCount, Number(params.get("page")) || 1));
  return (
    <div className="workspace-page">
      <p className="eyebrow">The marketplace</p>
      <h1 className="mt-2 text-4xl font-extrabold">Find a car. Make it yours.</h1>
      <p className="mt-3 text-muted">
        Browse private listings and start a conversation with the seller.
      </p>
      <div className="my-8 grid gap-3 rounded-2xl border border-line bg-white p-5 sm:grid-cols-3 lg:grid-cols-4">
        <label>
          Search
          <input
            className="field"
            placeholder="Make or model"
            value={value("q")}
            onChange={(e) => change("q", e.target.value)}
          />
        </label>
        {[
          ["make", "Brand", [...new Set(cars.map((c) => c.make))]],
          ["city", "City", [...new Set(cars.map((c) => c.city))]],
          ["bodyType", "Body type", BODY_TYPES],
          ["fuel", "Fuel", FUEL_TYPES],
        ].map(([key, label, options]) => (
          <label key={String(key)}>
            {label}
            <select
              className="field"
              value={value(String(key))}
              onChange={(e) => change(String(key), e.target.value)}
            >
              <option value="">All</option>
              {(options as readonly string[]).map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
        <label>
          Maximum price (₹)
          <input
            className="field"
            type="number"
            min="0"
            value={value("maxPrice")}
            onChange={(e) => change("maxPrice", e.target.value)}
          />
        </label>
        <label>
          Sort by
          <select
            className="field"
            value={value("sort")}
            onChange={(e) => change("sort", e.target.value)}
          >
            <option value="">Newest first</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
        <button className="text-sm font-semibold text-brand" onClick={() => setParams({})}>
          Clear filters
        </button>
      </div>
      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-danger">
          Could not load listings. {error}
        </p>
      ) : (
        <>
          <p className="mb-5 text-sm text-muted">{filtered.length} cars available</p>
          <CarGrid
            cars={filtered.slice((page - 1) * 12, page * 12)}
            loading={loading}
            priceIndex={buildPriceIndex(cars)}
          />
          {pageCount > 1 && (
            <nav
              aria-label="Catalog pagination"
              className="mt-8 flex items-center justify-center gap-5"
            >
              <button
                disabled={page === 1}
                className="text-sm text-brand disabled:opacity-40"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.set("page", String(page - 1));
                  setParams(next);
                }}
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {page} of {pageCount}
              </span>
              <button
                disabled={page === pageCount}
                className="text-sm text-brand disabled:opacity-40"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.set("page", String(page + 1));
                  setParams(next);
                }}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
