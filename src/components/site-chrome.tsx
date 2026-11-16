import Link from "next/link";
import { Logo, Mark } from "./brand";
import { ButtonLink } from "./ui";

const links = [
  { href: "/businesses", label: "For businesses" },
  { href: "/investors", label: "For investors" },
  { href: "/institutions", label: "For institutions" },
  { href: "/how-it-works", label: "How it works" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-8">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-aubergine-50 hover:text-aubergine-800">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </ButtonLink>
          <ButtonLink href="/onboarding">Get started</ButtonLink>
        </div>
      </div>
      <nav aria-label="Main, small screens" className="border-t border-ink-100 md:hidden">
        <ul className="flex gap-1 overflow-x-auto px-4 py-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold text-ink-700 hover:bg-aubergine-50">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-aubergine-900 text-aubergine-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Mark reversed className="size-8" />
            <span className="text-lg font-bold text-white">serwaa</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-aubergine-200">
            Private credit for growing businesses. Investor money is held by licensed custodians, never by Serwaa.
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
        <FooterCol title="Company" links={[{ href: "/brand", label: "Brand" }, { href: "/institutions", label: "Partnerships" }]} />
      </div>
      <div className="border-t border-aubergine-800">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-aubergine-300 sm:px-8">
          © 2026 Serwaa. Investing on Serwaa opens after regulatory approval. Expected returns are not guaranteed and your capital is at risk.
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
