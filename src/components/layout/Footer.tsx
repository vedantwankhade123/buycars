import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const columns = [
  {
    title: "Marketplace",
    links: [
      { label: "Explore Cars", href: "#featured-cars" },
      { label: "Browse by Brand", href: "#browse-by-brand" },
      { label: "Body Types", href: "#browse-by-body-type" },
      { label: "Recently Added", href: "#recently-added" },
    ],
  },
  {
    title: "Sellers",
    links: [
      { label: "Sell Your Car", href: "#sell-cta" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Listing Tips", href: "#faq" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Frequently Asked", href: "#faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo variant="light" />
          <p className="max-w-xs text-sm leading-6 text-slate-400">
            A peer-to-peer marketplace for quality pre-owned cars across India. Browse, compare and
            connect directly with sellers — no middlemen, no inflated dealer margins.
          </p>
          <ul className="space-y-2 pt-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <Mail aria-hidden="true" className="size-4 shrink-0" />
              <a className="hover:text-white" href="mailto:hello@buycars.example">
                hello@buycars.example
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone aria-hidden="true" className="size-4 shrink-0" />
              <span>+91 00000 00000 (placeholder)</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              <span>Serving all Indian states</span>
            </li>
          </ul>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              {column.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BuyCars. All rights reserved.</p>
          <p>
            BuyCars does not handle payments, inspections or ownership verification. Transactions
            are agreed directly between buyer and seller.
          </p>
        </div>
      </div>
    </footer>
  );
}
