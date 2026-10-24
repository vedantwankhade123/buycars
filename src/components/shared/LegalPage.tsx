import type { ReactNode } from "react";

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="container-page max-w-3xl py-16 sm:py-24">
      <p className="text-xs font-bold text-brand">Legal</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
      <p className="mt-6 text-base leading-7 text-ink-3">{intro}</p>

      <div className="mt-10 space-y-10">
        {sections.map((section, index) => (
          <section key={section.heading}>
            <h2 className="font-display text-lg font-bold text-ink">
              <span className="mr-2 text-muted-2 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-ink-3">{section.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
