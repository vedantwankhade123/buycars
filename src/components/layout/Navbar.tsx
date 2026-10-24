import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Heart, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { comingSoon } from "@/lib/phaseNotices";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/features/auth/AuthContext";
import { AccountMenu } from "@/features/auth/components/AccountMenu";
import { Avatar } from "@/features/auth/components/Avatar";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, pending, signIn, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  // Solid bar once scrolled; transparent over the dark hero at the top of the page.
  const onDark = !scrolled && !drawerOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        scrolled
          ? "border-b border-line bg-surface/90 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="container-page flex h-16 items-center justify-between gap-4 lg:h-20"
      >
        <a href="#top" className="rounded-field" aria-label="BuyCars home">
          <Logo variant={onDark ? "light" : "dark"} />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={cn(
                  "rounded-field px-3 py-2 text-sm font-medium transition-colors",
                  onDark ? "text-white/85 hover:text-white" : "text-ink-3 hover:text-brand",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => comingSoon("Saved cars", "Phase 5")}
            className={cn(
              "hidden size-11 place-items-center rounded-field transition-colors sm:grid",
              onDark ? "text-white hover:bg-white/10" : "text-ink-3 hover:bg-surface-2",
            )}
            aria-label="Wishlist"
          >
            <Heart aria-hidden="true" className="size-5" />
          </button>

          {user ? (
            <div className="hidden lg:block">
              <AccountMenu
                user={user}
                onDark={onDark}
                onSignOut={() => void signOut()}
                pending={pending}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void signIn()}
              disabled={pending}
              className={cn(
                "hidden h-11 rounded-field px-5 text-sm font-semibold transition-colors disabled:opacity-70 lg:block",
                onDark
                  ? "bg-white text-ink hover:bg-slate-100"
                  : "bg-brand text-white hover:bg-brand-hover",
              )}
            >
              {pending ? "Signing in…" : "Sign In"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "grid size-11 place-items-center rounded-field transition-colors lg:hidden",
              onDark ? "text-white hover:bg-white/10" : "text-ink hover:bg-surface-2",
            )}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            <Menu aria-hidden="true" className="size-6" />
          </button>
        </div>
      </nav>

      {/* Portalled to <body>: the header's backdrop-blur would otherwise become the
          containing block and clip these fixed layers to the 64px bar. */}
      {drawerOpen &&
        createPortal(
          <div id="mobile-drawer" className="lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-[60] cursor-default bg-ink/50"
              onClick={() => setDrawerOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(20rem,88vw)] flex-col overflow-y-auto bg-surface shadow-raised"
            >
              <div className="flex h-16 items-center justify-between border-b border-line px-5">
                <Logo />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="grid size-10 place-items-center rounded-field text-ink hover:bg-surface-2"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>
              <ul className="flex flex-col px-3 py-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className="block rounded-field px-4 py-3 text-base font-medium text-ink hover:bg-surface-2"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t border-line px-5 py-5">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 pb-4">
                      <Avatar user={user} className="size-9" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">
                          {user.displayName ?? "Signed in"}
                        </p>
                        {user.email && (
                          <p className="truncate text-xs leading-5 text-muted">{user.email}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        void signOut();
                      }}
                      disabled={pending}
                      className="h-11 w-full rounded-field border border-line text-sm font-semibold text-ink hover:bg-surface-2 disabled:opacity-60"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        void signIn();
                      }}
                      disabled={pending}
                      className="h-11 w-full rounded-field bg-brand text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-70"
                    >
                      {pending ? "Signing in…" : "Sign in with Google"}
                    </button>
                    <p className="pt-3 text-xs leading-5 text-muted">
                      Sign in to create your account. Saved cars, listings and enquiries arrive in
                      later phases.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
