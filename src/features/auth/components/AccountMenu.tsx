import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import type { User } from "firebase/auth";
import { cn } from "@/lib/utils";
import { Avatar } from "@/features/auth/components/Avatar";

export function AccountMenu({
  user,
  onDark,
  onSignOut,
  pending,
}: {
  user: User;
  onDark: boolean;
  onSignOut: () => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const name = user.displayName?.trim() || "your account";

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${name}`}
        className={cn(
          "flex h-11 items-center gap-2 rounded-field pl-1.5 pr-2.5 transition-colors",
          onDark ? "text-white hover:bg-white/10" : "text-ink hover:bg-surface-2",
        )}
      >
        <Avatar user={user} />
        <span className="hidden max-w-28 truncate text-sm font-semibold xl:block">
          {user.displayName?.split(/\s+/)[0] ?? "Account"}
        </span>
        <ChevronDown aria-hidden="true" className="size-4 opacity-70" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-[calc(100%+0.5rem)] w-64 rounded-card border border-line bg-surface p-2 shadow-raised"
        >
          <div className="border-b border-line px-3 pb-3 pt-2">
            <p className="truncate text-sm font-semibold text-ink">
              {user.displayName ?? "Signed in"}
            </p>
            {user.email && <p className="truncate text-xs leading-5 text-muted">{user.email}</p>}
          </div>
          <button
            type="button"
            role="menuitem"
            disabled={pending}
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="mt-1 flex w-full items-center gap-2.5 rounded-field px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-surface-2 disabled:opacity-60"
          >
            <LogOut aria-hidden="true" className="size-4 text-muted" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
