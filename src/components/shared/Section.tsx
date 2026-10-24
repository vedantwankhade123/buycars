import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  note,
  action,
  align = "left",
  valign = "end",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Small-print qualifier, e.g. scoping a section to what this build actually does. */
  note?: string;
  action?: ReactNode;
  align?: "left" | "center";
  /** "end" lines the heading up with a trailing button; "start" suits tall side-by-side content. */
  valign?: "start" | "end";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center"
          ? "items-center text-center"
          : cn("sm:flex-row sm:justify-between", valign === "end" ? "sm:items-end" : "sm:items-start"),
        className,
      )}
    >
      <div className={cn("space-y-2", align === "center" ? "max-w-2xl" : "max-w-2xl")}>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">{eyebrow}</p>
        )}
        <h2 className="text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{title}</h2>
        {description && <p className="text-sm leading-6 text-muted sm:text-base">{description}</p>}
        {note && <p className="text-xs leading-5 text-muted/90">{note}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("container-page py-16 sm:py-20", className)}>
      {children}
    </section>
  );
}
