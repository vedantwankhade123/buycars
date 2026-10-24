import { useState } from "react";
import type { Brand } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Manufacturer marks are trademarked assets sourced from Wikimedia Commons; see
 * public/images/CREDITS.md for the licence of each file. If a logo is missing or fails
 * to load we fall back to the wordmark rather than rendering a broken image.
 */
export function BrandLogo({
  name,
  src,
  className,
}: {
  name: Brand;
  src: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={cn("font-display text-sm font-bold tracking-tight text-ink-3", className)}>
        {name}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("h-8 w-auto object-contain", className)}
    />
  );
}
