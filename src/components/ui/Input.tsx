import { useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldShellProps {
  label: string;
  htmlFor: string;
  hint?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
  className?: string | undefined;
  children: ReactNode;
}

export function FieldShell({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "id"> {
  label: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className, required, ...rest }: InputProps) {
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
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          "h-11 w-full rounded-field border bg-surface px-3 text-sm text-ink placeholder:text-muted-2",
          "transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-ring",
          error ? "border-danger" : "border-line",
        )}
        {...rest}
      />
    </FieldShell>
  );
}
