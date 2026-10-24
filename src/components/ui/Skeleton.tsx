import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton rounded-field", className)} />;
}

/** Matches CarCard's box model so the grid does not reflow when data arrives. */
export function CarCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-2/5" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function CarGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
      role="status"
      aria-label="Loading vehicles"
    >
      {Array.from({ length: count }, (_, index) => (
        <CarCardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading vehicles…</span>
    </div>
  );
}
