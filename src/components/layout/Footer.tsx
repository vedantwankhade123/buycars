import { Logo } from "@/components/shared/Logo";

const columns = [
  {
    title: "Marketplace",
    links: [
      { label: "Explore cars", href: "/cars" },
      { label: "Browse by brand", href: "/#browse-by-brand" },
      { label: "Body types", href: "/#browse-by-body-type" },
      { label: "Recently added", href: "/#recently-added" },
    ],
  },
  {
    title: "Sellers",
    links: [
      { label: "Sell your car", href: "/sell" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Listing tips", href: "/#faq" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Frequently asked", href: "/#faq" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-2">
          <Logo variant="light" />
          <p className="max-w-xs text-sm leading-6 text-slate-400">
            Buy and sell pre-owned cars directly with people across India.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="font-display text-sm font-bold text-white">{column.title}</h2>
            <ul className="mt-3 space-y-2">
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
        <div className="container-page flex flex-col gap-3 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
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
