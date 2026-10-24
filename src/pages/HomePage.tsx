import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { EMPTY_SEARCH } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/Button";
import { useActiveCars } from "@/features/cars/hooks/useActiveCars";
import { applyFilters, featuredCars, recentlyAddedCars } from "@/features/cars/services/carService";
import { buildPriceIndex, isQueryActive } from "@/lib/utils";
import type { Brand } from "@/lib/constants";
import type { BodyType, CarSearchQuery } from "@/types/car.types";
import { Hero } from "@/features/home/components/Hero";
import { BrandStrip } from "@/features/home/components/BrandStrip";
import { CarListSection } from "@/features/home/components/CarListSection";
import { BodyTypeGrid } from "@/features/home/components/BodyTypeGrid";
import { WhyBuyCars } from "@/features/home/components/WhyBuyCars";
import { HowItWorks } from "@/features/home/components/HowItWorks";
import { SearchResults } from "@/features/home/components/SearchResults";
import { SellCta } from "@/features/home/components/SellCta";
import { FaqSection } from "@/features/home/components/FaqSection";

const FEATURED_LIMIT = 8;
const RECENT_LIMIT = 4;

export default function HomePage() {
  const { cars, loading, error } = useActiveCars();
  const navigate = useNavigate();
  const [query, setQuery] = useState<CarSearchQuery>(EMPTY_SEARCH);

  const priceIndex = buildPriceIndex(cars);
  const results = applyFilters(cars, query);

  const openCatalog = (next: CarSearchQuery) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) {
      if (value !== "" && value !== null) params.set(key, String(value));
    }
    navigate(`/cars?${params.toString()}`);
  };
  const scrollToResults = () => openCatalog(query);
  const search = (next: CarSearchQuery) => openCatalog(next);

  return (
    <>
      <Hero cars={cars} query={query} onQueryChange={setQuery} onSubmit={scrollToResults} />

      {error && (
        <div className="container-page pt-10">
          <p className="rounded-card border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">
            Could not load listings: {error}
          </p>
        </div>
      )}

      {isQueryActive(query) && (
        <SearchResults
          query={query}
          results={results}
          priceIndex={priceIndex}
          loading={loading}
          onQueryChange={search}
        />
      )}

      <BrandStrip cars={cars} onSelect={(make: Brand) => search({ ...query, make, model: "" })} />

      <CarListSection
        id="featured-cars"
        eyebrow="Featured"
        title="Featured cars"
        description="A selection of cars worth a closer look."
        cars={featuredCars(cars, FEATURED_LIMIT)}
        priceIndex={priceIndex}
        loading={loading}
        skeletonCount={FEATURED_LIMIT}
        action={
          <ButtonLink href="/cars" variant="outline">
            Explore all cars
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        }
        emptyAction={
          <ButtonLink href="#browse-by-brand" variant="outline">
            Browse by brand instead
          </ButtonLink>
        }
      />

      <BodyTypeGrid cars={cars} onSelect={(bodyType: BodyType) => search({ ...query, bodyType })} />

      <WhyBuyCars />
      <HowItWorks />

      <CarListSection
        id="recently-added"
        eyebrow="Fresh on the market"
        title="Recently added cars"
        description="Fresh listings. Your next drive could be here."
        cars={recentlyAddedCars(cars, RECENT_LIMIT)}
        priceIndex={priceIndex}
        loading={loading}
        skeletonCount={RECENT_LIMIT}
      />

      <SellCta />
      <FaqSection />
    </>
  );
}
