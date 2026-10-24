import { BRAND_ASSETS } from "@/lib/constants";
import type { Brand } from "@/lib/constants";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Section, SectionHeading } from "@/components/shared/Section";
import type { Car } from "@/types/car.types";

/**
 * Tiles are buttons, not links: selecting a brand applies the Make filter and moves to the
 * Search Results section on this page. Phase 3 redirects the same action to /cars?make=…
 */
export function BrandStrip({ cars, onSelect }: { cars: Car[]; onSelect: (make: Brand) => void }) {
  const counts = new Map<string, number>();
  for (const car of cars) counts.set(car.make, (counts.get(car.make) ?? 0) + 1);

  return (
    <Section id="browse-by-brand" className="bg-surface">
      <SectionHeading
        eyebrow="Browse by brand"
        title="Browse by brand"
        description="Choose a brand you love. Find a car that fits."
      />
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {BRAND_ASSETS.map((brand) => {
          const count = counts.get(brand.name) ?? 0;
          return (
            <li key={brand.name}>
              <button
                type="button"
                onClick={() => onSelect(brand.name)}
                aria-label={`Browse ${count} used ${brand.name} listings`}
                className="group flex h-full w-full flex-col items-center justify-center gap-3 rounded-card border border-line bg-canvas px-4 py-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand-tint/50 hover:shadow-card disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
              >
                <BrandLogo name={brand.name} src={brand.logo} className="h-9" />
                <span className="text-xs font-medium text-muted group-hover:text-brand-hover">
                  {count === 0 ? "Explore cars" : `${count} ${count === 1 ? "car" : "cars"}`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
