import { toast } from "sonner";

/**
 * Single place where un-built affordances announce themselves.
 *
 * Controls whose behaviour depends on an unbuilt phase must not silently do nothing. Each
 * call site is deleted as its phase lands — Phase 3 removes "Vehicle details", Phase 5
 * "Saved cars", Phase 6 "List your car", Phase 8 "Message the seller".
 */
export function comingSoon(feature: string, phase: string) {
  toast.info(`${feature} arrives in ${phase}`, {
    description: "This build is the landing page UI. No action was taken.",
  });
}
