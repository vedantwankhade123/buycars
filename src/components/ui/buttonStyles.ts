import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "dark";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-field font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55 whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "bg-ink text-white hover:bg-ink-2",
  outline: "bg-surface text-ink ring-1 ring-inset ring-line hover:bg-surface-2",
  ghost: "text-ink hover:bg-surface-2",
  dark: "bg-white text-ink hover:bg-slate-100",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}
