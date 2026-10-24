import { ArrowRight, ArrowUpRight, MessageCircle, MapPin } from "lucide-react";
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
    <section id="top" className="hero-scene relative isolate overflow-hidden bg-ink">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={HERO_IMAGE}
          alt=""
          fetchPriority="high"
          className="hero-photo h-full w-full object-cover object-[65%_center]"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
        <div className="hero-glow" />
      </div>
      <div className="container-page hero-layout relative">
        <div className="hero-copy mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <h1 className="hero-enter hero-headline font-semibold leading-[1.02] tracking-[-0.045em] text-white">
            Find your
            <br />
            <span className="hero-title-accent">next drive.</span>
          </h1>
          <p className="hero-enter hero-delay-1 hero-description max-w-lg text-base leading-relaxed text-slate-200 sm:text-lg">
            Great cars. Real people. Buy and sell directly with car owners across India.
          </p>
          <div className="hero-enter hero-delay-2 hero-actions flex flex-wrap justify-center gap-3">
            <ButtonLink href="/cars" size="lg" className="hero-primary rounded-full">
              Explore cars <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <ButtonLink
              href="/sell"
              size="lg"
              className="rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15"
              variant="ghost"
            >
              Sell your car <ArrowUpRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
          <div className="hero-enter hero-delay-3 hero-details flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-200">
            <span className="flex items-center gap-2">
              <MessageCircle className="size-4 text-blue-300" aria-hidden="true" />
              Talk directly to sellers
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-blue-300" aria-hidden="true" />
              Find cars near you
            </span>
          </div>
        </div>
        <div className="hero-enter hero-delay-3 relative mx-auto w-full max-w-6xl">
          <CarSearchBar
            query={query}
            onChange={onQueryChange}
            onSubmit={onSubmit}
            onReset={() => onQueryChange(EMPTY_SEARCH)}
            makeOptions={makesWithCounts(cars)}
            modelOptions={modelsForMake(cars, query.make)}
            cityOptions={citiesWithCounts(cars)}
            className="hero-search"
          />
        </div>
      </div>
    </section>
  );
}
