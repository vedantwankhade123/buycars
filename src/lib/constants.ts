import type { BodyType, CarSearchQuery, FuelType, Transmission } from "@/types/car.types";

export const BRANDS = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Honda",
  "Toyota",
  "Mahindra",
  "Kia",
  "Volkswagen",
  "BMW",
  "Mercedes-Benz",
] as const;

export type Brand = (typeof BRANDS)[number];

/** `logo` is the path under /images/brands/; falls back to the wordmark if the file is absent. */
export const BRAND_ASSETS: ReadonlyArray<{ name: Brand; logo: string }> = [
  { name: "Maruti Suzuki", logo: "/images/brands/maruti-suzuki.svg" },
  { name: "Hyundai", logo: "/images/brands/hyundai.svg" },
  { name: "Tata", logo: "/images/brands/tata.svg" },
  { name: "Honda", logo: "/images/brands/honda.svg" },
  { name: "Toyota", logo: "/images/brands/toyota.svg" },
  { name: "Mahindra", logo: "/images/brands/mahindra.svg" },
  { name: "Kia", logo: "/images/brands/kia.svg" },
  { name: "Volkswagen", logo: "/images/brands/volkswagen.svg" },
  { name: "BMW", logo: "/images/brands/bmw.svg" },
  { name: "Mercedes-Benz", logo: "/images/brands/mercedes-benz.svg" },
];

export const BODY_TYPES: readonly BodyType[] = [
  "Hatchback",
  "Sedan",
  "SUV",
  "MUV",
  "Coupe",
  "Convertible",
  "Electric",
];

export const BODY_TYPE_ASSETS: ReadonlyArray<{ type: BodyType; image: string; blurb: string }> = [
  { type: "Hatchback", image: "/images/body-type/hatchback.jpg", blurb: "City-friendly" },
  { type: "Sedan", image: "/images/body-type/sedan.jpg", blurb: "Comfort first" },
  { type: "SUV", image: "/images/body-type/suv.jpg", blurb: "Space and stance" },
  { type: "MUV", image: "/images/body-type/muv.jpg", blurb: "Seven seats" },
  { type: "Coupe", image: "/images/body-type/coupe.jpg", blurb: "Driver's car" },
  { type: "Convertible", image: "/images/body-type/convertible.jpg", blurb: "Open top" },
  { type: "Electric", image: "/images/body-type/electric.jpg", blurb: "Zero tailpipe" },
];

export const FUEL_TYPES: readonly FuelType[] = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];

export const TRANSMISSIONS: readonly Transmission[] = ["Manual", "Automatic", "AMT", "CVT"];

export const CITIES = [
  "Mumbai",
  "Pune",
  "Bengaluru",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
  "Ahmedabad",
  "Kolkata",
  "Jaipur",
  "Chandigarh",
  "Kochi",
  "Lucknow",
] as const;

export type City = (typeof CITIES)[number];

export type PriceBucket = { label: string; min: number | null; max: number | null };

/**
 * Budget buckets offered by the hero search. Bounds are integer INR; a null bound means that
 * edge of the range is open. `min` is exclusive, `max` is inclusive.
 */
export const PRICE_BUCKETS: ReadonlyArray<PriceBucket> = [
  { label: "Under ₹5 lakh", min: null, max: 500000 },
  { label: "₹5 – 8 lakh", min: 500000, max: 800000 },
  { label: "₹8 – 12 lakh", min: 800000, max: 1200000 },
  { label: "₹12 – 20 lakh", min: 1200000, max: 2000000 },
  { label: "Above ₹20 lakh", min: 2000000, max: null },
];

export const MIN_YEAR = 2010;
export const CURRENT_YEAR = new Date().getFullYear();

/** A listing counts as "Recently Added" only within this window. */
export const RECENT_DAYS = 14;

/** A listing is "Great Value" at or below this fraction of its model's median asking price. */
export const GREAT_VALUE_RATIO = 0.92;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore cars", href: "/cars" },
  { label: "Sell your car", href: "/sell" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About", href: "/#why-buycars" },
] as const;

export const DEMO_DATA_NOTICE =
  "Demo listings — sample data shown while the marketplace is under construction.";

/** Neutral starting point for every search surface. */
export const EMPTY_SEARCH: CarSearchQuery = {
  make: "",
  model: "",
  minPrice: null,
  maxPrice: null,
  city: "",
  bodyType: "",
};
