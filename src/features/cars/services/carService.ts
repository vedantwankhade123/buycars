import { DEMO_CARS } from "@/features/cars/data/demo-cars";
import { RECENT_DAYS } from "@/lib/constants";
import { daysSince } from "@/lib/utils";
import type { Car, CarSearchQuery } from "@/types/car.types";

/** Public listing read boundary: live Firestore when configured, samples otherwise. */

const SIMULATED_LATENCY_MS = 220;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Public listings only: anything not `active` is invisible to buyers. */
export async function fetchActiveCars(): Promise<Car[]> {
  if (import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    const { liveCars } = await import("@/features/marketplace/service");
    return liveCars();
  }
  await delay(SIMULATED_LATENCY_MS);
  return DEMO_CARS.filter((car) => car.status === "active");
}

export function applyFilters(cars: Car[], query: CarSearchQuery): Car[] {
  return cars.filter((car) => {
    if (query.make && car.make !== query.make) return false;
    if (query.model && car.model !== query.model) return false;
    if (query.city && car.city !== query.city) return false;
    if (query.bodyType && car.bodyType !== query.bodyType) return false;
    if (query.minPrice !== null && car.price <= query.minPrice) return false;
    if (query.maxPrice !== null && car.price > query.maxPrice) return false;
    return true;
  });
}

/** Admin-set flag only — never inferred from price or recency. */
export function featuredCars(cars: Car[], limit: number): Car[] {
  return cars.filter((car) => car.featured).slice(0, limit);
}

export function recentlyAddedCars(cars: Car[], limit: number): Car[] {
  return cars
    .filter((car) => daysSince(car.createdAt) <= RECENT_DAYS)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function makesWithCounts(cars: Car[]): Array<{ value: string; label: string }> {
  return countBy(cars, (car) => car.make);
}

export function modelsForMake(cars: Car[], make: string): Array<{ value: string; label: string }> {
  return countBy(
    cars.filter((car) => car.make === make),
    (car) => car.model,
  );
}

export function citiesWithCounts(cars: Car[]): Array<{ value: string; label: string }> {
  return countBy(cars, (car) => car.city);
}

function countBy(cars: Car[], key: (car: Car) => string) {
  const counts = new Map<string, number>();
  for (const car of cars) counts.set(key(car), (counts.get(key(car)) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => ({ value, label: `${value} (${count})` }));
}
