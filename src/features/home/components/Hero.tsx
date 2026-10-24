import { ArrowRight, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CarSearchBar } from "@/components/shared/CarSearchBar";
import { EMPTY_SEARCH } from "@/lib/constants";
import {
  citiesWithCounts,
  makesWithCounts,
  modelsForMake,
} from "@/features/cars/services/carService";
import type { Car, CarSearchQuery } from "@/types/car.types";

export const HERO_IMAGE = "/images/hero/hero-1.jpg";

export function Hero({
  cars,
  query,
  onQueryChange,
  onSubmit,
}: {
  cars: Car[];
  query: CarSearchQuery;
  onQueryChange: (next: CarSearchQuery) => void;
  onSubmit: () => void;
}) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      </div>

      <div className="container-page relative flex min-h-[38rem] flex-col justify-center pb-32 pt-28 sm:min-h-[42rem]">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-100 ring-1 ring-inset ring-white/15 backdrop-blur">
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            India&apos;s private seller marketplace
          </p>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Find Your Next Drive.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
            Explore quality pre-owned cars, compare your favourites, and connect directly with
            sellers across India.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#featured-cars" size="lg">
              Explore Cars
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <ButtonLink href="#sell-cta" variant="dark" size="lg">
              Sell Your Car
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="container-page relative -mt-24 pb-16">
        <div className="mx-auto max-w-5xl">
          <CarSearchBar
            query={query}
            onChange={onQueryChange}
            onSubmit={onSubmit}
            onReset={() => onQueryChange(EMPTY_SEARCH)}
            makeOptions={makesWithCounts(cars)}
            modelOptions={modelsForMake(cars, query.make)}
            cityOptions={citiesWithCounts(cars)}
          />
          <p className="mt-3 text-center text-xs text-slate-300">
            {cars.length > 0
              ? `${cars.length} active listings in this demo build`
              : "Loading listings…"}
          </p>
        </div>
      </div>
    </section>
  );
}
