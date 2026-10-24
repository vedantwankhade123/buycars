/**
 * Vehicle domain types. These are the shapes the UI renders.
 *
 * Deliberately Firestore-free: `createdAt`/`updatedAt` are ISO-8601 strings rather
 * than `Timestamp`, and `CarImage.publicId` is an opaque storage identifier. The
 * Firestore read layer converts on the way in, so no component ever imports a Firebase
 * type. See src/features/cars/services/carService.ts.
 */

export type CarStatus = "draft" | "pending_review" | "active" | "reserved" | "sold" | "archived";

export type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric" | "Hybrid";

export type Transmission = "Manual" | "Automatic" | "AMT" | "CVT";

export type BodyType = "Hatchback" | "Sedan" | "SUV" | "MUV" | "Coupe" | "Convertible" | "Electric";

export interface CarImage {
  /** Resolvable image URL (local path during UI development, Cloudinary CDN URL later). */
  url: string;
  /** Cloudinary public_id once uploads are wired up; `demo:` prefixed during UI development. */
  publicId: string;
  alt: string;
}

export interface Car {
  id: string;
  sellerId: string;
  make: string;
  model: string;
  variant: string;
  /** Manufacturing year, AD. */
  year: number;
  /** Asking price in integer INR — never a float, never a formatted string. */
  price: number;
  /** Odometer reading in kilometres. */
  mileageKm: number;
  fuelType: FuelType;
  transmission: Transmission;
  bodyType: BodyType;
  ownershipCount: number;
  /** Two-letter vehicle registration state code, e.g. "MH". */
  registrationState: string;
  color: string;
  city: string;
  state: string;
  description: string;
  /** Seller-declared features and equipment. Not verified by BuyCars. */
  features: string[];
  images: CarImage[];
  coverImage: string;
  status: CarStatus;
  /** Set by an administrator only; clients must not be able to write this (Phase 5 rules). */
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CarBadge = "recent" | "featured" | "great_value";

/**
 * Search parameters shared by the hero search bar, the brand and body-type tiles, and the
 * Phase 3 marketplace page (where they serialise into URL search params).
 * Empty string means "no constraint" for the text facets; a null bound means that edge of
 * the price range is open, so `minPrice: 500000, maxPrice: 800000` reads "₹5 – 8 lakh".
 */
export interface CarSearchQuery {
  make: string;
  model: string;
  minPrice: number | null;
  maxPrice: number | null;
  city: string;
  bodyType: string;
}
