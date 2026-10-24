import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Section, SectionHeading } from "@/components/shared/Section";
import { cn } from "@/lib/utils";

const MODES = [
  {
    id: "buyers",
    label: "For Buyers",
    steps: [
      {
        title: "Search for a car",
        body: "Filter by make, model, budget and city, then narrow further by year, fuel type, transmission, odometer reading and body type.",
      },
      {
        title: "Explore vehicle details",
        body: "Read the full specification sheet, browse every photo the seller uploaded, and check the features and ownership information they declared.",
      },
      {
        title: "Contact the seller",
        body: "Send an enquiry from the listing. Ask about service history, negotiability or anything the photographs do not answer.",
      },
      {
        title: "Arrange inspection and purchase",
        body: "Agree a test drive, have the car evaluated by a mechanic you trust, verify the documents, and complete the transfer directly with the seller.",
      },
    ],
  },
  {
    id: "sellers",
    label: "For Sellers",
    steps: [
      {
        title: "Sign in",
        body: "Use your Google account. There is no separate seller registration, no dealer onboarding and no listing fee.",
      },
      {
        title: "Add vehicle details",
        body: "Work through five guided steps: basic information, specifications, pricing and location, photos, then review.",
      },
      {
        title: "Upload photos",
        body: "Add up to ten images and pick the cover shot. Exterior angles in daylight and a clean background perform best.",
      },
      {
        title: "Publish and manage your listing",
        body: "Track enquiries from your dashboard, reply to buyers, and mark the car reserved or sold the moment it is off the market.",
      },
    ],
  },
] as const;

type ModeId = (typeof MODES)[number]["id"];

export function HowItWorks() {
  const [active, setActive] = useState<ModeId>(MODES[0]!.id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = MODES.findIndex((mode) => mode.id === active);
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % MODES.length
        : (index - 1 + MODES.length) % MODES.length;
    const target = MODES[next]!;
    setActive(target.id);
    tabRefs.current[next]?.focus();
  };

  const mode = MODES.find((entry) => entry.id === active) ?? MODES[0]!;

  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow="How it works"
        title="How it works"
        description="Find your car, meet the seller and take the next step together."
        align="center"
        className="mx-auto"
      />

      <div
        role="tablist"
        aria-label="How BuyCars works"
        className="mx-auto mt-10 flex w-fit gap-1 rounded-full bg-surface-2 p-1"
      >
        {MODES.map((entry, index) => (
          <button
            key={entry.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            role="tab"
            type="button"
            id={`tab-${entry.id}`}
            aria-selected={active === entry.id}
            aria-controls={`panel-${entry.id}`}
            onKeyDown={onKeyDown}
            onClick={() => setActive(entry.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
              active === entry.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink",
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <ol
        role="tabpanel"
        id={`panel-${mode.id}`}
        aria-labelledby={`tab-${mode.id}`}
        className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        {mode.steps.map((step, index) => (
          <li key={step.title} className="relative rounded-card border border-line bg-surface p-6">
            <span className="font-display text-3xl font-extrabold text-brand-tint">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-display text-base font-bold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
