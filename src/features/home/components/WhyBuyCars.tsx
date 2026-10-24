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
    title: "Discover More Cars",
    body: "Search by make, model, budget and city across private sellers and local dealers, and see every match on one page instead of jumping between ten different sites.",
  },
  {
    icon: Handshake,
    title: "Connect Directly with Sellers",
    body: "No middleman call centre. Your enquiry reaches the person who owns the car, and you agree price, inspection and paperwork between yourselves.",
  },
  {
    icon: ScrollText,
    title: "Transparent Vehicle Details",
    body: "Year, odometer reading, fuel, transmission, body type, ownership count and registration state are required fields on every listing, not optional extras.",
  },
  {
    icon: Sparkles,
    title: "Simple Listing Experience",
    body: "Five guided steps, from basic details to photos and publish. Most sellers finish in a few minutes, and you can edit or mark a car sold at any time.",
  },
];

export function WhyBuyCars() {
  return (
    <Section id="why-buycars" className="bg-surface">
      <SectionHeading
        eyebrow="Why BuyCars"
        title="A marketplace built around the information that actually matters"
        description="Used-car buying in India fails on trust and missing facts. We cannot verify a car for you, so we make sure the details a seller controls are always present, and that you reach that seller directly."
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
