import type { User } from "firebase/auth";
import { cn } from "@/lib/utils";

function initialsFor(user: User): string {
  const name = user.displayName?.trim();
  if (name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }
  return (user.email?.charAt(0) ?? "?").toUpperCase();
}

export function Avatar({ user, className }: { user: User; className?: string }) {
  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt=""
        width={32}
        height={32}
        referrerPolicy="no-referrer"
        className={cn("size-8 rounded-full object-cover ring-1 ring-black/10", className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-8 place-items-center rounded-full bg-brand text-xs font-bold text-white",
        className,
      )}
    >
      {initialsFor(user)}
    </span>
  );
}
