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
      "Open the listing and choose Buy now to send an enquiry. Continue in Enquiries & messages to ask questions, discuss your offer or arrange a test drive.",
  },
  {
    question: "Where do I manage my listings?",
    answer: "Open My listings from your account menu to see your cars and mark a listing as sold.",
  },
  {
    question: "How do I remove a car that is already sold?",
    answer:
      "Mark it as sold from My listings. It will disappear from the public catalog. Your existing conversations remain available.",
  },
  {
    question: "Does BuyCars handle payments or paperwork?",
    answer:
      "No. We never hold money, and we do not process the registration transfer. Negotiate price, arrange payment and complete the RTO transfer directly with the other party. Inspect the car and verify the documents before any money moves.",
  },
  {
    question: "Do you inspect or verify the cars listed?",
    answer:
      "No. Every specification, condition claim and document detail is self-reported by the seller. Badges you see on a card — Recently added, Featured, Great Value — describe listing metadata such as recency or price relative to comparable listings. None of them is a statement about the car's condition.",
  },
];

export function FaqSection() {
  return (
    <Section id="faq" className="bg-surface">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
        <SectionHeading
          eyebrow="FAQ"
          title="Your questions, answered"
          description="A few things to know before you get started."
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
