import type { ReactNode } from "react";
import { SearchX } from "lucide-react";
import { CarCard } from "@/components/shared/CarCard";
import { CarGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { badgesFor } from "@/lib/utils";
import type { Car } from "@/types/car.types";

export function CarGrid({
  cars,
  priceIndex,
  loading = false,
  skeletonCount = 4,
  emptyAction,
}: {
  cars: Car[];
  priceIndex: Map<string, number>;
  loading?: boolean;
  skeletonCount?: number;
  emptyAction?: ReactNode;
}) {
  if (loading) return <CarGridSkeleton count={skeletonCount} />;

  if (cars.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No matching cars yet"
        description="Try widening the budget or clearing the city filter. New listings are published every day."
        action={emptyAction}
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cars.map((car) => (
        <li key={car.id}>
          <CarCard car={car} badges={badgesFor(car, priceIndex)} />
        </li>
      ))}
    </ul>
  );
}
