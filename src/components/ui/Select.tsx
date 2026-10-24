import { useId } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldShell } from "@/components/ui/Input";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<ComponentPropsWithoutRef<"select">, "id" | "children"> {
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  hint?: string;
  error?: string;
}

/**
 * Native <select> rather than a listbox widget: correct mobile behaviour, keyboard
 * support and screen-reader semantics for free. Revisit only if we need grouped or
 * searchable options, which is a Phase 3 marketplace concern.
 */
export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  className,
  required,
  ...rest
}: SelectProps) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            "h-11 w-full appearance-none rounded-field border bg-surface pl-3 pr-9 text-sm text-ink",
            "transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-ring",
            error ? "border-danger" : "border-line",
          )}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
      </div>
    </FieldShell>
  );
}
