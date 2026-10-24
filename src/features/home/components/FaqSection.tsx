import { Plus } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/Section";

const FAQS = [
  {
    question: "Is listing a car free?",
    answer:
      "Yes. Creating a listing, uploading photos, receiving enquiries and marking a car sold all cost nothing. BuyCars does not take a commission on a sale, because it is not part of the transaction.",
  },
  {
    question: "How do I contact a seller?",
    answer:
      "Open the listing and use the contact form to send an enquiry. Your message is attached to that specific car, so the seller knows exactly which vehicle you mean. You can also request a test drive from the same form.",
  },
  {
    question: "Can I edit my listing after publishing?",
    answer:
      "Yes. Price, description, photos and location can all be updated from your seller dashboard at any time. Edits take effect immediately.",
  },
  {
    question: "How do I remove a car that is already sold?",
    answer:
      "Mark it as sold from your dashboard and it stops appearing in search results the same moment. You can archive a listing instead if you would rather keep the record without deleting it.",
  },
  {
    question: "Does BuyCars handle payments or paperwork?",
    answer:
      "No. We never hold money, and we do not process the registration transfer. Negotiate price, arrange payment and complete the RTO transfer directly with the other party. Inspect the car and verify the documents before any money moves.",
  },
  {
    question: "Do you inspect or verify the cars listed?",
    answer:
      "No. Every specification, condition claim and document detail is self-reported by the seller. Badges you see on a card — Recently Added, Featured, Great Value — describe listing metadata such as recency or price relative to comparable listings. None of them is a statement about the car's condition.",
  },
  {
    question: "How can I report a suspicious listing?",
    answer:
      "Use the report option on the listing and tell us what looks wrong. A BuyCars administrator reviews the report and can archive the listing. Repeated false reports from an account are themselves reviewed.",
  },
];

export function FaqSection() {
  return (
    <Section id="faq" className="bg-surface">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
        <SectionHeading
          eyebrow="FAQ"
          title="Straight answers before you commit"
          description="If something is not covered here, the listing page itself states what the seller has and has not declared."
          note="These answers describe the marketplace being built. Google sign-in works today; listings, saved cars, enquiry forms and dashboards are not live in this preview."
          valign="start"
        />
        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-display text-base font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-canvas text-muted transition-transform duration-200 group-open:rotate-45">
                  <Plus aria-hidden="true" className="size-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-5 text-sm leading-7 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
