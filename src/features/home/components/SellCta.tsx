import { ArrowRight, Camera, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { comingSoon } from "@/lib/phaseNotices";

const POINTS = [
  { icon: IndianRupee, label: "No listing fee, no commission" },
  { icon: Clock, label: "Live in about five minutes" },
  { icon: Camera, label: "Up to ten photos per car" },
];

export function SellCta() {
  return (
    <section id="sell-cta" className="container-page py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-card bg-ink px-6 py-14 text-white sm:px-12 lg:px-16">
        {/* Decorative road-line motif; purely visual, so hidden from assistive tech. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 text-white/[0.06]"
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M40 300c60-90 40-180 120-260" />
          <path d="M120 300c60-90 40-180 120-260" />
          <path d="M200 300c60-90 40-180 120-260" />
          <path d="M280 300c60-90 40-180 120-260" />
        </svg>

        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
            Sell your car
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            Your next buyer is waiting.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Create your listing in minutes and connect with people already looking for a car like
            yours in your city.
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {POINTS.map((point) => (
              <li key={point.label} className="flex items-center gap-2 text-sm text-slate-200">
                <point.icon aria-hidden="true" className="size-4 text-blue-300" />
                {point.label}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button
              variant="dark"
              size="lg"
              onClick={() => comingSoon("Seller listing creation", "Phase 6")}
              trailingIcon={<ArrowRight aria-hidden="true" className="size-4" />}
            >
              List Your Car
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
