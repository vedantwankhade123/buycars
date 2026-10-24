import { cn } from "@/lib/utils";

export function Logo({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-[10px]",
          variant === "light" ? "bg-white text-ink" : "bg-brand text-white",
        )}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M4 14.5h16M5.5 14.5V12l1.8-4.2A2 2 0 0 1 9.1 6.6h5.8a2 2 0 0 1 1.8 1.2L18.5 12v2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="17.5" r="1.6" />
          <circle cx="16" cy="17.5" r="1.6" />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-lg font-extrabold tracking-tight",
          variant === "light" ? "text-white" : "text-ink",
        )}
      >
        Buy<span className={variant === "light" ? "text-brand-tint" : "text-brand"}>Cars</span>
      </span>
    </span>
  );
}
