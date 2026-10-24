import { CarFront } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="container-page grid min-h-dvh place-items-center py-24">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-tint text-brand">
          <CarFront aria-hidden="true" className="size-8" />
        </span>
        <p className="mt-6 font-display text-6xl font-extrabold tracking-tight text-ink">404</p>
        <h1 className="mt-2 text-xl font-bold text-ink">This road leads nowhere</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          The page you were looking for has been sold, moved, or never existed. Head back to the
          marketplace and keep browsing.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" size="lg">
            Back to home
          </ButtonLink>
          <ButtonLink href="/#featured-cars" variant="outline" size="lg">
            Browse cars
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
