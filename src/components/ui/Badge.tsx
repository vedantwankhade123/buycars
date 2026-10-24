import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "brand" | "success" | "warning" | "danger" | "neutral" | "dark";

const tones: Record<BadgeTone, string> = {
  brand: "bg-brand-tint text-brand-hover ring-brand/20",
  success: "bg-green-50 text-success ring-success/20",
  warning: "bg-amber-50 text-amber-700 ring-warning/25",
  danger: "bg-red-50 text-danger ring-danger/20",
  neutral: "bg-surface-2 text-muted ring-line",
  dark: "bg-ink text-white ring-white/10",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
