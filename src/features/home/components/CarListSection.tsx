import type { ReactNode } from "react";
import { Section, SectionHeading } from "@/components/shared/Section";
import { CarGrid } from "@/components/shared/CarGrid";
import type { Car } from "@/types/car.types";

export function CarListSection({
  id,
  eyebrow,
  title,
  description,
  cars,
  priceIndex,
  loading,
  skeletonCount = 4,
  action,
  emptyAction,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cars: Car[];
  priceIndex: Map<string, number>;
  loading: boolean;
  skeletonCount?: number;
  action?: ReactNode;
  emptyAction?: ReactNode;
}) {
  return (
    <Section id={id} className="bg-surface">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} action={action} />
      <div className="mt-10">
        <CarGrid
          cars={cars}
          priceIndex={priceIndex}
          loading={loading}
          skeletonCount={skeletonCount}
          emptyAction={emptyAction}
        />
      </div>
    </Section>
  );
}
