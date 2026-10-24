import { ArrowRight, Camera, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

const POINTS = [
  { icon: IndianRupee, label: "No listing fee, no commission" },
  { icon: Clock, label: "Live in about five minutes" },
  { icon: Camera, label: "Four photos per car" },
];

export function SellCta() {
  const navigate = useNavigate();
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
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            Ready to sell your car?
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            List in minutes. Meet buyers in your city.
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
              onClick={() => navigate("/sell")}
              trailingIcon={<ArrowRight aria-hidden="true" className="size-4" />}
            >
              List your car
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
