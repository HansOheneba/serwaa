import Link from "next/link";
import { Logo, Mark } from "./brand";
import { MobileMenu } from "./mobile-menu";
import { ButtonLink } from "./ui";
import { Weave } from "./weave";

const links = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/businesses", label: "Businesses" },
  { href: "/investors", label: "Investors" },
  { href: "/institutions", label: "Institutions" },
  { href: "/products", label: "Products" },
  { href: "/verify", label: "Verify" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/protection", label: "Protection" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-8">
        <Logo />
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap text-ink-700 hover:bg-aubergine-50 hover:text-aubergine-800">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost" className="max-sm:hidden">
            Sign in
          </ButtonLink>
          <ButtonLink href="/onboarding">Get started</ButtonLink>
          <MobileMenu links={links} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-aubergine-900 text-aubergine-100">
      <Weave tone="dark" fade="b" className="inset-x-0 top-0 h-28 opacity-60" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Mark reversed className="size-8" />
            <span className="text-lg font-bold text-white">serwaa</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-aubergine-200">
            Private credit for growing businesses. Investor money is held by licensed custodians, never by Serwaa.
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-aubergine-200">
            Serwaa is owned and operated by <span className="font-semibold text-white">Bomevan Group</span>.
          </p>
        </div>
        <FooterCol title="Platform" links={links} />
        <FooterCol
          title="Account"
          links={[
            { href: "/login", label: "Sign in" },
            { href: "/onboarding?as=business", label: "Register a business" },
            { href: "/onboarding?as=investor", label: "Become an investor" },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { href: "/faq", label: "Questions" },
            { href: "/protection#risks", label: "Risks of investing" },
            { href: "/institutions", label: "Partnerships" },
            { href: "/brand", label: "Brand" },
          ]}
        />
      </div>
      <div className="relative border-t border-aubergine-800">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-aubergine-300 sm:px-8">
          © 2026 Bomevan Group. Investing on Serwaa opens after regulatory approval. Expected returns are not guaranteed and your capital is at risk.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.08em] text-saffron-300 uppercase">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-aubergine-100 hover:text-white hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
