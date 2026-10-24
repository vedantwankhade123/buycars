import { Handshake, ListFilter, ScrollText, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/Section";

interface Benefit {
  icon: LucideIcon;
  title: string;
  body: string;
}

/**
 * Every claim here is one the product actually supports. BuyCars does not inspect vehicles,
 * verify ownership, guarantee condition or hold funds, so none of those words appear.
 */
const BENEFITS: Benefit[] = [
  {
    icon: ListFilter,
    title: "Discover more cars",
    body: "Explore cars by brand, budget and location in one place.",
  },
  {
    icon: Handshake,
    title: "Connect directly with sellers",
    body: "Ask questions and discuss your offer with the seller in a private chat.",
  },
  {
    icon: ScrollText,
    title: "Transparent vehicle details",
    body: "See the photos, specifications and history shared by each seller.",
  },
  {
    icon: Sparkles,
    title: "Simple listing experience",
    body: "Add your car details and four photos. Publish when you are ready.",
  },
];

export function WhyBuyCars() {
  return (
    <Section id="why-buycars" className="bg-surface">
      <SectionHeading
        eyebrow="Why BuyCars"
        title="A simpler way to buy and sell"
        description="Clear car details. Direct conversations. You stay in control."
      />
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {BENEFITS.map((benefit) => (
          <li
            key={benefit.title}
            className="rounded-card border border-line bg-canvas p-6 transition-colors hover:border-brand/40 hover:bg-brand-tint/40"
          >
            <span className="grid size-11 place-items-center rounded-field bg-brand/10 text-brand">
              <benefit.icon aria-hidden="true" className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-ink">{benefit.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{benefit.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
