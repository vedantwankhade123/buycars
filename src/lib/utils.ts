import { CURRENT_YEAR, GREAT_VALUE_RATIO, PRICE_BUCKETS, RECENT_DAYS } from "@/lib/constants";
import type { PriceBucket } from "@/lib/constants";
import type { Car, CarBadge, CarSearchQuery } from "@/types/car.types";

/** Joins conditional class names; falsy entries are dropped. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** True when any facet of a search is constraining the result set. */
export function isQueryActive(query: CarSearchQuery): boolean {
  return (
    Boolean(query.make || query.model || query.city || query.bodyType) ||
    query.minPrice !== null ||
    query.maxPrice !== null
  );
}

/**
 * The budget bucket matching both bounds of a query, or null when the range is open or was
 * built outside the offered buckets. Lets the Budget select reflect a query set by a tile or URL.
 */
export function priceBucketFor(query: CarSearchQuery): PriceBucket | null {
  return (
    PRICE_BUCKETS.find((bucket) => bucket.min === query.minPrice && bucket.max === query.maxPrice) ??
    null
  );
}

/** Human label for an arbitrary price range, used when no bucket matches. */
export function priceRangeLabel(query: CarSearchQuery): string {
  const bucket = priceBucketFor(query);
  if (bucket) return bucket.label;
  if (query.minPrice !== null && query.maxPrice !== null)
    return `${formatINR(query.minPrice)} – ${formatINR(query.maxPrice)}`;
  if (query.maxPrice !== null) return `Under ${formatINR(query.maxPrice)}`;
  if (query.minPrice !== null) return `Above ${formatINR(query.minPrice)}`;
  return "Any budget";
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹12,45,000 — Indian digit grouping, no decimals. */
export function formatINR(price: number): string {
  return inrFormatter.format(Math.round(price));
}

/** ₹12.45 lakh / ₹1.2 crore — for compact card and chart labels. */
export function formatINRShort(price: number): string {
  if (price >= 10000000) return `₹${trimZero(price / 10000000)} Cr`;
  if (price >= 100000) return `₹${trimZero(price / 100000)} L`;
  return formatINR(price);
}

function trimZero(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

/** 42,500 km */
export function formatKm(km: number): string {
  return `${new Intl.NumberFormat("en-IN").format(Math.round(km))} km`;
}

export function carTitle(car: Car): string {
  return `${car.make} ${car.model}`;
}

export function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return Number.POSITIVE_INFINITY;
  return Math.floor((Date.now() - then) / 86_400_000);
}

/** "Today" / "3 days ago" / "2 weeks ago" — coarse on purpose, listing freshness is not precise. */
export function relativeAge(iso: string): string {
  const days = daysSince(iso);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function ageInYears(year: number): number {
  return Math.max(0, CURRENT_YEAR - year);
}

/**
 * Median of the sorted values. Uses the lower-middle element for even counts so the
 * result is always an actual observed price rather than a synthetic average.
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor((sorted.length - 1) / 2);
  return sorted[mid] ?? 0;
}

/**
 * Median price per `${make} ${model}` across the given set. Powers the Great Value badge
 * so the claim is relative to comparable listings actually present, not a fixed threshold.
 */
export function buildPriceIndex(cars: Car[]): Map<string, number> {
  const groups = new Map<string, number[]>();
  for (const car of cars) {
    const key = `${car.make} ${car.model}`;
    const bucket = groups.get(key);
    if (bucket) bucket.push(car.price);
    else groups.set(key, [car.price]);
  }
  return new Map([...groups].map(([key, prices]) => [key, median(prices)]));
}

/**
 * Badges are derived from real conditions only — never hardcoded for presentation.
 * `great_value` needs a price index built from the full active set, so it is passed in
 * rather than computed from a single card's own data.
 *
 * Capped at two, most specific first: nearly every featured listing is also recent, and
 * three stacked pills on a card reads as decoration rather than information.
 */
export function badgesFor(car: Car, priceIndex: Map<string, number>): CarBadge[] {
  const badges: CarBadge[] = [];
  if (car.featured) badges.push("featured");
  const comparable = priceIndex.get(`${car.make} ${car.model}`);
  if (comparable !== undefined && comparable > 0 && car.price <= comparable * GREAT_VALUE_RATIO) {
    badges.push("great_value");
  }
  if (daysSince(car.createdAt) <= RECENT_DAYS) badges.push("recent");
  return badges.slice(0, 2);
}

export const BADGE_LABELS: Record<CarBadge, string> = {
  recent: "Recently Added",
  featured: "Featured",
  great_value: "Great Value",
};

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again.";
}
